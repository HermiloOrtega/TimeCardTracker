/**
 * server/index.js — Express API server
 *
 * Serves the built Vite frontend from /dist and exposes
 * REST endpoints under /api for all data operations.
 *
 * Start:
 *   Local:      node --env-file=.env.local server/index.js
 *   Production: Hostinger sets NODE_ENV=production and env vars
 *               automatically; entry point is this file.
 */

import express    from 'express';
import path       from 'path';
import { fileURLToPath } from 'url';
import pool       from './db.js';
import entriesRouter    from './routes/entries.js';
import projectsRouter   from './routes/projects.js';
import categoriesRouter from './routes/categories.js';
import todosRouter      from './routes/todos.js';
import settingsRouter   from './routes/settings.js';
import authRouter       from './routes/auth.js';
import { requireUser }  from './middleware/requireUser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// ── Auth (no user middleware needed) ────────────────────────
app.use('/api/auth', authRouter);

// ── Protected API routes (require X-Username header) ────────
app.use('/api/entries',    requireUser, entriesRouter);
app.use('/api/projects',   requireUser, projectsRouter);
app.use('/api/categories', requireUser, categoriesRouter);
app.use('/api/todos',      requireUser, todosRouter);
app.use('/api/settings',   requireUser, settingsRouter);

// ── Serve frontend (production) ──────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
