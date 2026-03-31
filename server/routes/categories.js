import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id, name, color } = req.body;
  await pool.query('INSERT INTO categories (id, name, color) VALUES (?, ?, ?)', [id, name, color]);
  res.status(201).json({ id });
});

router.put('/:id', async (req, res) => {
  const { name, color } = req.body;
  await pool.query('UPDATE categories SET name=?, color=? WHERE id=?', [name, color, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
