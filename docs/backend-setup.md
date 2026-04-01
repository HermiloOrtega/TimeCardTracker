# Backend Setup — TimeCardTracker

## Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL 8+
- **ORM:** none — raw `mysql2/promise` queries

---

## Folder structure

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
└── .env.production       ← Production template (real values set on the server)
```

---

## 1. Create the database

```bash
mysql -u root -p < docs/database.sql
```

Or open `docs/database.sql` in MySQL Workbench and click Execute.

---

## 2. Install server dependencies

```bash
npm install express mysql2
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

### Production — `.env.production`
Set these as environment variables on your server (do NOT commit real credentials):
```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=timecardtracker
PORT=3001
```

---

## 4. How local vs production is detected

`server/db.js` and `server/index.js` read `process.env.NODE_ENV`:

| `NODE_ENV`    | Behavior |
|---|---|
| `development` | Uses `.env.local` values, 5 DB connections, skips static file serving |
| `production`  | Uses server env vars, 10 DB connections, serves `/dist` as static frontend |

No code change needed between environments — only env vars differ.

---

## 5. Deployment

1. Build the frontend: `npm run build`
2. Set environment variables on the server
3. Start the server: `npm start` (entry point: `server/index.js`)

### Hosting options

Any provider that supports Node.js + MySQL will work. Popular choices:

| Provider | Type | Notes |
|---|---|---|
| **Railway** | PaaS | Free tier, auto-deploys from GitHub, MySQL plugin available |
| **Render** | PaaS | Free tier, Node.js + MySQL, easy GitHub integration |
| **Fly.io** | PaaS | Free tier, good for small apps, MySQL via PlanetScale or built-in |
| **DigitalOcean App Platform** | PaaS | Managed Node.js + managed MySQL database |
| **AWS Lightsail** | VPS | Low cost, full control, install MySQL manually |
| **Google Cloud Run** | Serverless | Container-based, pairs with Cloud SQL (MySQL) |
| **Azure App Service** | PaaS | Node.js + Azure Database for MySQL |
| **VPS (any provider)** | Self-managed | Full control — install Node.js + MySQL directly |

For all options: set the environment variables from section 3 in the provider's dashboard, never in the code.

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

- `.env.local` is git-ignored — never committed
- `.env.production` in the repo is a **template only** with placeholder values
- Real production credentials are stored as server environment variables only
- The public GitHub repo never contains any database passwords
