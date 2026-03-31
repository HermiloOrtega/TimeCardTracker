import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [[row]] = await pool.query('SELECT * FROM settings WHERE id = 1');
  res.json(row);
});

router.put('/', async (req, res) => {
  const { theme, time_range, view_mode } = req.body;
  await pool.query(
    'INSERT INTO settings (id, theme, time_range, view_mode) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE theme=?, time_range=?, view_mode=?',
    [theme, time_range, view_mode, theme, time_range, view_mode]
  );
  res.json({ ok: true });
});

export default router;
