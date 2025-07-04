import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, getClient } from '../config/database.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// JWT 中間件
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'SELECT id, username, email, role FROM admins WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// POST /api/admin/login - 管理員登入
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // 查找管理員
    const result = await query(
      'SELECT id, username, email, password_hash, role FROM admins WHERE username = $1 AND is_active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const admin = result.rows[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 更新最後登入時間
    await query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// GET /api/admin/submissions - 管理員查看所有提交
router.get('/submissions', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause = 'WHERE s.status = $1';
      params = [status];
    }

    const result = await query(`
      SELECT 
        s.*,
        g.group_number,
        g.group_name,
        t.task_key,
        t.title_zh as task_title_zh,
        t.title_en as task_title_en,
        COUNT(f.id) as file_count
      FROM submissions s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN tasks t ON s.task_id = t.id
      LEFT JOIN files f ON s.id = f.submission_id
      ${whereClause}
      GROUP BY s.id, g.group_number, g.group_name, t.task_key, t.title_zh, t.title_en
      ORDER BY s.submitted_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, limit, offset]);

    // 取得總數
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM submissions s
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Admin submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

// PUT /api/admin/submissions/:id/status - 更新提交狀態
router.put('/submissions/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { status, reason } = req.body;

    const result = await query(`
      UPDATE submissions 
      SET 
        status = $1,
        approved_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
        approved_by = CASE WHEN $1 = 'approved' THEN $2 ELSE approved_by END,
        submission_data = CASE 
          WHEN $3 IS NOT NULL THEN 
            COALESCE(submission_data, '{}'::jsonb) || jsonb_build_object('admin_reason', $3)
          ELSE submission_data 
        END
      WHERE id = $4
      RETURNING *
    `, [status, req.user.username, reason || null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: `Submission ${status} successfully`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update submission status'
    });
  }
});

// GET /api/admin/dashboard - 管理員儀表板統計
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // 基本統計
    const basicStats = await query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(DISTINCT group_id) as participating_groups
      FROM submissions
    `);

    // 任務分布
    const taskStats = await query(`
      SELECT 
        t.task_key,
        t.title_zh,
        COUNT(s.id) as submission_count,
        COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_count
      FROM tasks t
      LEFT JOIN submissions s ON t.id = s.task_id
      GROUP BY t.id, t.task_key, t.title_zh
      ORDER BY t.task_key
    `);

    // 檔案統計
    const fileStats = await query(`
      SELECT 
        f.file_type,
        COUNT(*) as file_count,
        SUM(f.file_size) as total_size
      FROM files f
      JOIN submissions s ON f.submission_id = s.id
      GROUP BY f.file_type
    `);

    // 最近提交
    const recentSubmissions = await query(`
      SELECT 
        s.id,
        s.title,
        s.submitted_at,
        s.status,
        g.group_number,
        t.task_key
      FROM submissions s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN tasks t ON s.task_id = t.id
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        overview: basicStats.rows[0],
        taskBreakdown: taskStats.rows,
        fileStats: fileStats.rows,
        recentSubmissions: recentSubmissions.rows
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

export default router;