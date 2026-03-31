# Backend Setup — TimeCardTracker

## Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL (Hostinger shared DB or local MySQL)
- **ORM:** none — raw `mysql2/promise` queries

---

## Folder structure added

```
project root/
├── server/
│   ├── index.js          ← Express entry point
│   ├── db.js             ← MySQL connection pool
│   └── routes/
│       ├── entries.js
│       ├── projects.js
│       ├── categories.js
│       ├── todos.js
│       └── settings.js
├── docs/
│   ├── database.sql      ← Run once to create all tables
│   └── backend-setup.md  ← This file
├── .env.local            ← Local dev credentials (never commit real values)
└── .env.production       ← Production template (real values set in Hostinger panel)
```

---

## 1. Create the database

### Local
```bash
mysql -u root -p < docs/database.sql
```

### Hostinger
1. Go to **Hosting → Databases → MySQL Databases**
2. Create a database and user, grant all privileges
3. Open **phpMyAdmin** → select the database → **Import** → upload `docs/database.sql`

---

## 2. Install server dependencies

```bash
npm install express mysql2 dotenv
```

Update `package.json` scripts:
```json
"scripts": {
  "dev":        "vite --host",
  "dev:server": "node --env-file=.env.local server/index.js",
  "build":      "tsc && vite build",
  "start":      "node server/index.js"
}
```

---

## 3. Environment variables

### Local — `.env.local`
```
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=yourLocalPassword
DB_NAME=timecardtracker
PORT=3001
```
Run locally with:
```bash
npm run dev:server
```

### Production — Hostinger
Set these in **Hosting → Node.js → Environment Variables** (do NOT commit real credentials):
```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_hostinger_db_user
DB_PASS=your_hostinger_db_password
DB_NAME=your_hostinger_db_name
PORT=3001
```

---

## 4. How local vs production is detected

`server/db.js` and `server/index.js` read `process.env.NODE_ENV`:

| `NODE_ENV`     | Behavior |
|---|---|
| `development`  | Uses `.env.local` values, 5 DB connections, skips static file serving |
| `production`   | Uses Hostinger env vars, 10 DB connections, serves `/dist` as static frontend |

No code change needed between environments — only env vars differ.

---

## 5. Hostinger deployment

1. Push to GitHub (`main` branch)
2. In Hostinger → **Node.js** → connect your GitHub repo
3. Set entry point: `server/index.js`
4. Set environment variables (see section 3)
5. Run **Build command:** `npm run build`
6. **Start command:** `npm start`

Hostinger will auto-deploy on each push to `main`.

---

## 6. API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/entries?start=&end=` | List entries (optional date range) |
| POST | `/api/entries` | Create entry |
| PUT | `/api/entries/:id` | Update entry |
| DELETE | `/api/entries/:id` | Delete entry |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/todos` | List todos |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update settings |

---

## 7. Security notes

- `.env.local` and `.env.production` are in `.gitignore` — never commit real credentials
- The `.env.production` file in this repo is a **template only** with placeholder values
- Real production credentials are stored exclusively in Hostinger's environment variable panel
- The public GitHub repo never contains any database passwords
