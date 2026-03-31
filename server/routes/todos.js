import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT t.*, GROUP_CONCAT(tp.project_id) AS project_ids
    FROM todos t
    LEFT JOIN todo_projects tp ON tp.todo_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order, t.id
  `);
  const todos = rows.map(r => ({
    ...r,
    projectIds: r.project_ids ? r.project_ids.split(',') : [],
    project_ids: undefined,
  }));
  res.json(todos);
});

router.post('/', async (req, res) => {
  const { id, text, done = false, sort_order = 0, projectIds = [] } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO todos (id, text, done, sort_order) VALUES (?, ?, ?, ?)', [id, text, done, sort_order]);
    for (const pid of projectIds) {
      await conn.query('INSERT INTO todo_projects (todo_id, project_id) VALUES (?, ?)', [id, pid]);
    }
    await conn.commit();
    res.status(201).json({ id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.put('/:id', async (req, res) => {
  const { text, done, sort_order, projectIds = [] } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE todos SET text=?, done=?, sort_order=? WHERE id=?', [text, done, sort_order, req.params.id]);
    await conn.query('DELETE FROM todo_projects WHERE todo_id = ?', [req.params.id]);
    for (const pid of projectIds) {
      await conn.query('INSERT INTO todo_projects (todo_id, project_id) VALUES (?, ?)', [req.params.id, pid]);
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
