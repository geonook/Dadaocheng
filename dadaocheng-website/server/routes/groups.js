import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/groups - 取得所有組別
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        g.*,
        CASE 
          WHEN s.group_id IS NOT NULL THEN true 
          ELSE false 
        END as has_submitted
      FROM groups g
      LEFT JOIN submissions s ON g.id = s.group_id
      WHERE g.is_active = true
      ORDER BY g.group_number
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch groups'
    });
  }
});

// GET /api/groups/available - 取得可用組別（未提交成果的組別）
router.get('/available', async (req, res) => {
  try {
    const result = await query(`
      SELECT g.*
      FROM groups g
      LEFT JOIN submissions s ON g.id = s.group_id
      WHERE g.is_active = true 
        AND s.group_id IS NULL
        AND g.group_number != 1
      ORDER BY g.group_number
    `);

    // 轉換為前端需要的格式
    const availableGroups = result.rows.map(group => ({
      value: group.group_number,
      label: {
        zh: `第${group.group_number}組`,
        en: `Group ${group.group_number}`
      }
    }));

    res.json({
      success: true,
      data: availableGroups,
      count: availableGroups.length
    });
  } catch (error) {
    console.error('Error fetching available groups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available groups'
    });
  }
});

// GET /api/groups/:groupNumber - 取得特定組別資訊
router.get('/:groupNumber', async (req, res) => {
  try {
    const { groupNumber } = req.params;

    const result = await query(`
      SELECT 
        g.*,
        s.id as submission_id,
        s.title as submission_title,
        s.description as submission_description,
        s.youtube_link,
        s.status as submission_status,
        s.submitted_at,
        t.task_key,
        t.title_zh as task_title_zh,
        t.title_en as task_title_en
      FROM groups g
      LEFT JOIN submissions s ON g.id = s.group_id
      LEFT JOIN tasks t ON s.task_id = t.id
      WHERE g.group_number = $1 AND g.is_active = true
    `, [groupNumber]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch group'
    });
  }
});

export default router;