/**
 * db.js — MySQL connection pool
 *
 * Reads credentials from environment variables.
 * Uses .env.local in development and server env vars in production.
 */

import mysql from 'mysql2/promise';

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || '127.0.0.1',
  port:     parseInt(process.env.DB_PORT      || '3306', 10),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASS     || '',
  database:           process.env.DB_NAME     || 'timecardtracker',
  waitForConnections: true,
  connectionLimit:    isProduction ? 10 : 5,
  queueLimit:         0,
  timezone:           'Z',
});

// Verify connection on startup
pool.getConnection()
  .then(conn => {
    console.log(`[db] Connected to MySQL (${isProduction ? 'production' : 'local'})`);
    conn.release();
  })
  .catch(err => {
    console.error('[db] Connection failed:', err.message);
    process.exit(1);
  });

export default pool;
