import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY name');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id, name, color, category_id } = req.body;
  await pool.query('INSERT INTO projects (id, name, color, category_id) VALUES (?, ?, ?, ?)', [id, name, color, category_id]);
  res.status(201).json({ id });
});

router.put('/:id', async (req, res) => {
  const { name, color, category_id } = req.body;
  await pool.query('UPDATE projects SET name=?, color=?, category_id=? WHERE id=?', [name, color, category_id, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
