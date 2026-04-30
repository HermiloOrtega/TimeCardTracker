/**
 * auth.js — Authentication routes
 *
 * POST /api/auth/login
 *   Body:    { username: string, password: string }
 *   200:     { id, username }  — credentials valid
 *   400:     { error }         — missing fields
 *   401:     { error }         — invalid credentials
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'username is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }

  const [[user]] = await pool.query(
    'SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER(?)',
    [username.trim()]
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({ id: user.id, username: user.username });
});

export default router;
