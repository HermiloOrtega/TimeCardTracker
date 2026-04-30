import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY name',
    [req.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id, name, color, weekly_hours = 0 } = req.body;
  await pool.query(
    'INSERT INTO categories (id, user_id, name, color, weekly_hours) VALUES (?, ?, ?, ?, ?)',
    [id, req.userId, name, color, weekly_hours]
  );
  res.status(201).json({ id });
});

router.put('/:id', async (req, res) => {
  const { name, color, weekly_hours = 0 } = req.body;
  await pool.query(
    'UPDATE categories SET name=?, color=?, weekly_hours=? WHERE id=? AND user_id=?',
    [name, color, weekly_hours, req.params.id, req.userId]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  res.json({ ok: true });
});

export default router;
