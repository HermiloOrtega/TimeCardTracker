/**
 * requireUser.js
 *
 * Express middleware that reads the X-Username header,
 * looks up the user in the database, and attaches req.userId.
 * Returns 401 if the header is missing or the user is unknown.
 */

import pool from '../db.js';

export async function requireUser(req, res, next) {
  const username = req.headers['x-username'];
  if (!username) {
    return res.status(401).json({ error: 'Missing X-Username header' });
  }

  const [[user]] = await pool.query(
    'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
    [username.trim()]
  );

  if (!user) {
    return res.status(401).json({ error: 'Unknown user' });
  }

  req.userId = user.id;
  next();
}
