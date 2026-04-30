import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY name',
    [req.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id, name, color, category_id } = req.body;
  await pool.query(
    'INSERT INTO projects (id, user_id, name, color, category_id) VALUES (?, ?, ?, ?, ?)',
    [id, req.userId, name, color, category_id]
  );
  res.status(201).json({ id });
});

router.put('/:id', async (req, res) => {
  const { name, color, category_id } = req.body;
  await pool.query(
    'UPDATE projects SET name=?, color=?, category_id=? WHERE id=? AND user_id=?',
    [name, color, category_id, req.params.id, req.userId]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  res.json({ ok: true });
});

export default router;
