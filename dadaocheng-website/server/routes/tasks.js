import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/tasks - 取得所有任務
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        t.*,
        COUNT(s.id) as submission_count
      FROM tasks t
      LEFT JOIN submissions s ON t.id = s.task_id
      WHERE t.is_active = true
      GROUP BY t.id
      ORDER BY t.task_key
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:taskKey - 取得特定任務
router.get('/:taskKey', async (req, res) => {
  try {
    const { taskKey } = req.params;

    const result = await query(`
      SELECT 
        t.*,
        COUNT(s.id) as submission_count,
        json_agg(
          json_build_object(
            'group_number', g.group_number,
            'submission_id', s.id,
            'title', s.title,
            'submitted_at', s.submitted_at,
            'status', s.status
          ) ORDER BY s.submitted_at DESC
        ) FILTER (WHERE s.id IS NOT NULL) as submissions
      FROM tasks t
      LEFT JOIN submissions s ON t.id = s.task_id
      LEFT JOIN groups g ON s.group_id = g.id
      WHERE t.task_key = $1 AND t.is_active = true
      GROUP BY t.id
    `, [taskKey]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

export default router;