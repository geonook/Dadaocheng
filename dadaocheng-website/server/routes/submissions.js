import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { query, getClient } from '../config/database.js';
import { body, validationResult } from 'express-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 確保上傳目錄存在
const uploadDir = path.join(__dirname, '..', 'uploads');
await fs.mkdir(uploadDir, { recursive: true });
await fs.mkdir(path.join(uploadDir, 'images'), { recursive: true });
await fs.mkdir(path.join(uploadDir, 'videos'), { recursive: true });
await fs.mkdir(path.join(uploadDir, 'documents'), { recursive: true });

// Multer 配置
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let subfolder = 'documents';
      if (file.mimetype.startsWith('image/')) {
        subfolder = 'images';
      } else if (file.mimetype.startsWith('video/')) {
        subfolder = 'videos';
      }
      
      const destPath = path.join(uploadDir, subfolder);
      await fs.mkdir(destPath, { recursive: true });
      cb(null, destPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'pdf', 'doc', 'docx', 'ppt', 'pptx'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB
    files: 10 // 最多10個檔案
  }
});

// 驗證規則
const submitValidation = [
  body('groupNumber')
    .isInt({ min: 2, max: 25 })
    .withMessage('Group number must be between 2 and 25'),
  body('task')
    .isIn(['task1', 'task2', 'task3', 'task4', 'task5'])
    .withMessage('Invalid task selection'),
  body('description')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  body('youtubeLink')
    .optional()
    .isURL()
    .withMessage('Invalid YouTube URL')
];

// 圖片處理函數
const processImage = async (filePath) => {
  try {
    const processedPath = filePath.replace(/\.[^/.]+$/, '_processed.jpg');
    await sharp(filePath)
      .resize(1920, 1080, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toFile(processedPath);
    
    // 刪除原始檔案，使用處理過的檔案
    await fs.unlink(filePath);
    return processedPath;
  } catch (error) {
    console.error('Image processing error:', error);
    return filePath; // 如果處理失敗，返回原始檔案
  }
};

// GET /api/submissions - 取得所有成果
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        s.*,
        g.group_number,
        g.group_name,
        t.task_key,
        t.title_zh as task_title_zh,
        t.title_en as task_title_en,
        COALESCE(
          json_agg(
            json_build_object(
              'id', f.id,
              'original_filename', f.original_filename,
              'file_path', f.file_path,
              'file_size', f.file_size,
              'mime_type', f.mime_type,
              'file_type', f.file_type
            ) ORDER BY f.uploaded_at
          ) FILTER (WHERE f.id IS NOT NULL), 
          '[]'
        ) as files
      FROM submissions s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN tasks t ON s.task_id = t.id
      LEFT JOIN files f ON s.id = f.submission_id
      WHERE s.status = 'approved' OR s.status = 'pending'
      GROUP BY s.id, g.group_number, g.group_name, t.task_key, t.title_zh, t.title_en
      ORDER BY s.submitted_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

// GET /api/submissions/statistics - 取得統計資料
router.get('/statistics', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_submissions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_submissions,
        COUNT(DISTINCT group_id) as participating_groups,
        (25 - 1 - COUNT(DISTINCT group_id)) as available_groups
      FROM submissions
    `);

    const taskStats = await query(`
      SELECT 
        t.task_key,
        t.title_zh,
        COUNT(s.id) as submission_count
      FROM tasks t
      LEFT JOIN submissions s ON t.id = s.task_id
      GROUP BY t.id, t.task_key, t.title_zh
      ORDER BY t.task_key
    `);

    res.json({
      success: true,
      data: {
        overview: stats.rows[0],
        taskBreakdown: taskStats.rows
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// POST /api/submissions - 提交成果
router.post('/', upload.array('files', 10), submitValidation, async (req, res) => {
  const client = await getClient();
  
  try {
    // 驗證輸入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 清理已上傳的檔案
      if (req.files) {
        for (const file of req.files) {
          await fs.unlink(file.path).catch(() => {});
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { groupNumber, task, description, youtubeLink } = req.body;

    await client.query('BEGIN');

    // 檢查組別是否存在且可用
    const groupResult = await client.query(
      'SELECT id FROM groups WHERE group_number = $1 AND is_active = true',
      [groupNumber]
    );

    if (groupResult.rows.length === 0) {
      throw new Error('Invalid or inactive group number');
    }

    const groupId = groupResult.rows[0].id;

    // 檢查是否已經提交過
    const existingSubmission = await client.query(
      'SELECT id FROM submissions WHERE group_id = $1',
      [groupId]
    );

    if (existingSubmission.rows.length > 0) {
      throw new Error('This group has already submitted their work');
    }

    // 取得任務 ID
    const taskResult = await client.query(
      'SELECT id FROM tasks WHERE task_key = $1',
      [task]
    );

    if (taskResult.rows.length === 0) {
      throw new Error('Invalid task selection');
    }

    const taskId = taskResult.rows[0].id;

    // 插入提交記錄
    const submissionResult = await client.query(`
      INSERT INTO submissions (group_id, task_id, title, description, youtube_link, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id
    `, [
      groupId,
      taskId,
      `第${groupNumber}組 - ${task.toUpperCase()} 成果`,
      description,
      youtubeLink || null
    ]);

    const submissionId = submissionResult.rows[0].id;

    // 處理上傳的檔案
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let finalPath = file.path;
        
        // 如果是圖片，進行處理
        if (file.mimetype.startsWith('image/')) {
          finalPath = await processImage(file.path);
        }

        // 計算相對路徑
        const relativePath = path.relative(path.join(__dirname, '..'), finalPath);

        // 確定檔案類型
        let fileType = 'document';
        if (file.mimetype.startsWith('image/')) {
          fileType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          fileType = 'video';
        }

        // 插入檔案記錄
        await client.query(`
          INSERT INTO files (submission_id, original_filename, stored_filename, file_path, file_size, mime_type, file_type)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          submissionId,
          file.originalname,
          path.basename(finalPath),
          relativePath,
          file.size,
          file.mimetype,
          fileType
        ]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: {
        submissionId,
        groupNumber,
        task,
        fileCount: req.files ? req.files.length : 0
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    // 清理已上傳的檔案
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }

    console.error('Submission error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create submission'
    });
  } finally {
    client.release();
  }
});

// GET /api/submissions/:id - 取得特定成果
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        s.*,
        g.group_number,
        g.group_name,
        t.task_key,
        t.title_zh as task_title_zh,
        t.title_en as task_title_en,
        json_agg(
          json_build_object(
            'id', f.id,
            'original_filename', f.original_filename,
            'file_path', f.file_path,
            'file_size', f.file_size,
            'mime_type', f.mime_type,
            'file_type', f.file_type
          ) ORDER BY f.uploaded_at
        ) FILTER (WHERE f.id IS NOT NULL) as files
      FROM submissions s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN tasks t ON s.task_id = t.id
      LEFT JOIN files f ON s.id = f.submission_id
      WHERE s.id = $1
      GROUP BY s.id, g.group_number, g.group_name, t.task_key, t.title_zh, t.title_en
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
});

export default router;