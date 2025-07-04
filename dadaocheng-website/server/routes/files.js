import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { query } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET /api/files/:fileId/download - 下載檔案
router.get('/:fileId/download', async (req, res) => {
  try {
    const { fileId } = req.params;

    // 從資料庫取得檔案資訊
    const result = await query(`
      SELECT f.*, s.status as submission_status
      FROM files f
      JOIN submissions s ON f.submission_id = s.id
      WHERE f.id = $1
    `, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    const file = result.rows[0];
    
    // 檢查提交狀態（只有 approved 和 pending 的可以下載）
    if (!['approved', 'pending'].includes(file.submission_status)) {
      return res.status(403).json({
        success: false,
        error: 'File access denied'
      });
    }

    // 建構檔案完整路徑
    const filePath = path.join(__dirname, '..', file.file_path);

    try {
      // 檢查檔案是否存在
      await fs.access(filePath);

      // 設定回應標頭
      res.set({
        'Content-Type': file.mime_type,
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.original_filename)}"`,
        'Cache-Control': 'public, max-age=31536000', // 快取一年
        'ETag': `"${file.id}-${file.file_size}"`
      });

      // 發送檔案
      res.sendFile(filePath);

    } catch (fileError) {
      console.error('File access error:', fileError);
      res.status(404).json({
        success: false,
        error: 'File not found on disk'
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

// GET /api/files/:fileId/info - 取得檔案資訊
router.get('/:fileId/info', async (req, res) => {
  try {
    const { fileId } = req.params;

    const result = await query(`
      SELECT 
        f.*,
        s.status as submission_status,
        s.title as submission_title,
        g.group_number
      FROM files f
      JOIN submissions s ON f.submission_id = s.id
      JOIN groups g ON s.group_id = g.id
      WHERE f.id = $1
    `, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    const file = result.rows[0];

    // 不返回敏感的路徑資訊
    const {file_path, stored_filename, ...safeFileInfo} = file;

    res.json({
      success: true,
      data: {
        ...safeFileInfo,
        download_url: `/api/files/${file.id}/download`
      }
    });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get file info'
    });
  }
});

// GET /api/files/submission/:submissionId - 取得提交的所有檔案
router.get('/submission/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    const result = await query(`
      SELECT 
        f.*,
        s.status as submission_status
      FROM files f
      JOIN submissions s ON f.submission_id = s.id
      WHERE f.submission_id = $1
      ORDER BY f.uploaded_at
    `, [submissionId]);

    const files = result.rows.map(file => {
      const {file_path, stored_filename, ...safeFileInfo} = file;
      return {
        ...safeFileInfo,
        download_url: `/api/files/${file.id}/download`
      };
    });

    res.json({
      success: true,
      data: files,
      count: files.length
    });

  } catch (error) {
    console.error('Submission files error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get submission files'
    });
  }
});

export default router;