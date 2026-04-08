import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/entries?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { start, end } = req.query;
  let sql = `
    SELECT e.*, GROUP_CONCAT(ep.project_id) AS project_ids
    FROM time_entries e
    LEFT JOIN entry_projects ep ON ep.entry_id = e.id
  `;
  const params = [];
  if (start && end) {
    sql += ' WHERE e.date BETWEEN ? AND ?';
    params.push(start, end);
  }
  sql += ' GROUP BY e.id ORDER BY e.date, e.start_hour';

  const [rows] = await pool.query(sql, params);
  const entries = rows.map(r => ({
    ...r,
    date: r.date instanceof Date
      ? r.date.toISOString().slice(0, 10)
      : r.date,
    projectIds: r.project_ids ? r.project_ids.split(',') : [],
    project_ids: undefined,
  }));
  res.json(entries);
});

// POST /api/entries
router.post('/', async (req, res) => {
  const { id, date, startHour, endHour, description, projectIds = [] } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES (?, ?, ?, ?, ?)',
      [id, date, startHour, endHour, description]
    );
    for (const pid of projectIds) {
      await conn.query('INSERT INTO entry_projects (entry_id, project_id) VALUES (?, ?)', [id, pid]);
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

// PUT /api/entries/:id
router.put('/:id', async (req, res) => {
  const { date, startHour, endHour, description, projectIds = [] } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE time_entries SET date=?, start_hour=?, end_hour=?, description=? WHERE id=?',
      [date, startHour, endHour, description, req.params.id]
    );
    await conn.query('DELETE FROM entry_projects WHERE entry_id = ?', [req.params.id]);
    for (const pid of projectIds) {
      await conn.query('INSERT INTO entry_projects (entry_id, project_id) VALUES (?, ?)', [req.params.id, pid]);
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

// DELETE /api/entries/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM time_entries WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
