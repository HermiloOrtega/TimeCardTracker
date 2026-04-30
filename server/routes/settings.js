import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const [[row]] = await pool.query(
    'SELECT * FROM settings WHERE user_id = ?',
    [req.userId]
  );
  res.json(row ?? { theme: 'light', time_range: 'extended', view_mode: 'week' });
});

router.put('/', async (req, res) => {
  const { theme, time_range, view_mode } = req.body;
  await pool.query(
    `INSERT INTO settings (user_id, theme, time_range, view_mode)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE theme=?, time_range=?, view_mode=?`,
    [req.userId, theme, time_range, view_mode, theme, time_range, view_mode]
  );
  res.json({ ok: true });
});

export default router;
