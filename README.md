# TimeCardTracker

A time tracking tool for logging work hours across multiple projects and clients — visually, fast, and without friction.

---

## Why This Exists

Keeping track of time across multiple projects was always messy — sticky notes, spreadsheets, mental math at the end of the day. This tool was built to fix that in the simplest way possible: open it, click the hour you worked, type what you did, and move on.

No sign-in. No complicated setup. No subscriptions. Just a calendar where you track your time.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Demo Data — Example Scenarios](#demo-data--example-scenarios)
3. [Screenshots](#screenshots)
4. [How to Use](#how-to-use)
5. [UI Layout](#ui-layout)
6. [Calendar Views](#calendar-views)
7. [Time Slot Range](#time-slot-range)
8. [Appearance & Settings](#appearance--settings)
9. [Analytics](#analytics)
10. [Export to Excel](#export-to-excel)
11. [Data Storage](#data-storage)
12. [Tech Stack](#tech-stack)
13. [Architecture Overview](#architecture-overview)
14. [Project Structure](#project-structure)
15. [Data Model](#data-model)
16. [Component Reference](#component-reference)
17. [State & Data Flow](#state--data-flow)
18. [Styling System](#styling-system)
19. [Notes & Limitations](#notes--limitations)
20. [Security](#security)
21. [Roadmap](#roadmap)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)
- MySQL 8+

### Installation

```bash
git clone <repo-url>
cd TimeCardTracker
npm install
```

### Set up the database

Run the schema script once to create all tables:

```bash
mysql -u root -p < docs/database.sql
```

Or open `docs/database.sql` in MySQL Workbench and click Execute.

### Configure environment

Copy `.env` to `.env.local` and fill in your MySQL credentials:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_user
DB_PASS=your_password
DB_NAME=timecardtracker
```

Production credentials are set as environment variables on the server — never committed to the repo. See [docs/backend-setup.md](docs/backend-setup.md) for the full deployment guide.

### Run locally

Open **two terminals**:

```bash
# Terminal 1 — Frontend (Vite)
npm run dev

# Terminal 2 — Backend (Express + MySQL)
npm run dev:server
```

App opens at `http://localhost:5173`. The `--host` flag also makes it accessible from other devices on your local network.

---

## Demo Data — Example Scenarios

The `docs/` folder includes ready-to-run SQL scripts that populate the database with realistic sample data for three different use cases. Each script is self-contained, safe to re-run, and designed to demonstrate the full feature set of the tool.

### Loading demo data

Run the schema first (once), then run any demo script:

```bash
# Initialize schema
mysql -u root -p < docs/database.sql

# Then load ONE of the demo scenarios:
mysql -u root -p timecardtracker < docs/demo_software_engineer.sql
mysql -u root -p timecardtracker < docs/demo_accountant.sql
mysql -u root -p timecardtracker < docs/demo_estimator.sql
```

> Each demo script cleans up its own previously inserted data on re-run, so you can switch between scenarios freely without conflicts.

---

### Scenario 1 — Full-Stack Software Engineer

**File:** `docs/demo_software_engineer.sql`

A software engineer working across 5 active software projects. Categories represent the phases of the Software Development Lifecycle (SDLC).

**Categories:**

| Category | Color | Description |
|---|---|---|
| Planning & Architecture | Purple | System design, sprint planning, roadmapping |
| Development | Green | Feature coding, bug fixes, code reviews |
| DevOps & Infrastructure | Amber | CI/CD, cloud provisioning, Docker |
| QA & Testing | Blue | Unit tests, integration tests, regression |
| Meetings & Admin | Slate | Standups, email, documentation |

**Projects:**

| Project | Focus |
|---|---|
| E-Commerce Platform | Full-stack rebuild of a retail web application |
| Customer Portal API | REST API with JWT auth and role-based access |
| CI/CD & Cloud Infra | GitHub Actions, Terraform, AWS provisioning |
| Mobile App MVP | React Native app with offline sync |
| Analytics Dashboard | D3.js data visualization and reporting tool |

**Sample week:** Mon–Fri, 2026-04-07 to 2026-04-11. Includes todos linked to projects.

---

### Scenario 2 — Accountant / Bookkeeper

**File:** `docs/demo_accountant.sql`

An independent accountant tracking billable hours across 3 client engagements. Categories represent the accounting service types delivered.

**Categories:**

| Category | Color | Description |
|---|---|---|
| Bookkeeping | Green | Transaction entry, bank reconciliation, payroll |
| Tax Preparation | Blue | Tax review, filings, deduction analysis |
| Financial Reports | Amber | P&L, cash flow, investor summaries |
| Client Meetings | Purple | Review calls, onboarding, quarterly meetings |
| Administration | Slate | Invoicing, engagement letters, scheduling |

**Projects (Clients):**

| Client | Profile |
|---|---|
| Maple Grove Bakery | Small retail business — bookkeeping, payroll, sales tax |
| Sunrise Real Estate Group | Mid-size company — property accounting, investor reports |
| TechFlow Startup Inc. | Early-stage startup — catch-up books, due diligence, tax |

**Sample week:** Mon–Fri, 2026-04-07 to 2026-04-11. Includes multi-project todos (e.g., quarterly estimated tax filed for all 3 clients in one entry).

---

### Scenario 3 — Construction Estimator

**File:** `docs/demo_estimator.sql`

A civil construction estimator tracking time across 5 active bids. Categories represent the phases of the construction bid lifecycle, from solicitation through post-bid negotiation.

**Categories:**

| Category | Color | Description |
|---|---|---|
| Bid Solicitation & Review | Red | Reviewing RFPs, addenda, and go/no-go decisions |
| Site Assessment & Takeoffs | Orange | Site visits, quantity takeoffs, drawings review |
| Subcontractor Coordination | Yellow | Scope packages, sub outreach, quote comparison |
| Estimate Preparation | Green | Cost spreadsheets, markup, GC estimate builds |
| Bid Submission & Review | Blue | Bid form prep, internal reviews, submission |
| Post-Bid & Negotiation | Purple | Debrief calls, scope clarifications, leveling |
| Admin & Coordination | Slate | Bid log, scheduling, win/loss tracking |

**Projects (Active Bids):**

| Bid | Scope |
|---|---|
| Riverside Commercial Complex Ph.2 | Commercial building — structural, MEP, envelope |
| Hwy 45 Bridge Rehabilitation | Transportation infrastructure — deck, steel, MOT |
| Municipal Water Treatment Plant | Public works — civil, process piping, E&I |
| Downtown Mixed-Use Development | Urban development — demo, earthwork, vertical build |
| Industrial Warehouse Facility | Tilt-up warehouse — earthwork, slab, steel framing |

**Sample week:** Mon–Fri, 2026-04-07 to 2026-04-11. Includes a bid submission (Warehouse, Friday) and a post-bid debrief (Downtown). Todos reflect outstanding deliverables per bid.

---

## Screenshots

> Screenshots below show the tool in action for each demo scenario.

### Scenario 1 — Full-Stack Software Engineer

<!-- Add screenshot here -->
*Coming soon*

---

### Scenario 2 — Accountant / Bookkeeper

<!-- Add screenshot here -->
*Coming soon*

---

### Scenario 3 — Construction Estimator

<!-- Add screenshot here -->
*Coming soon*

---

## How to Use

### Step 1 — Set Up Categories and Projects

Before logging time, define your **categories** and **projects**:

1. Click **+ Projects** in the top toolbar.
2. Create a **Category** — give it a name and pick a color (e.g., "Client A" → blue).
3. Add a **Project** under that category (e.g., "Website Redesign").

Categories provide the color identity; projects appear as labeled entries on the calendar.

You can have as many categories and projects as you need — the tool is designed to handle multiple clients and workstreams side by side.

---

### Step 2 — Log Time

Each calendar entry represents **exactly one hour** of work.

**Two ways to create an entry:**

| Method | How |
|---|---|
| Click a slot | Click any hour cell in the calendar grid |
| + Task button | Click **+ Task** in the top toolbar (defaults to current hour, today) |

The entry form asks for:
- **Hour** — which hour you worked (e.g., 9 AM = 9:00–10:00)
- **Description** — what you worked on
- **Projects** — optional — assign to one or more projects

Entries appear as color-coded strips inside their hour slot. Multiple entries in the same slot stack vertically.

---

### Step 3 — Edit or Delete Entries

Click any entry on the calendar to open the edit form:

- Change the hour, description, or project assignments → **Save**
- **Duplicate** — creates a copy (useful for recurring tasks)
- **Delete** — removes the entry permanently

---

### Step 4 — Move Entries by Dragging

Drag any calendar entry to a different slot:

1. Grab the entry and drop it on a new hour slot (same day or another day)
2. A confirmation dialog appears before the move is applied

---

### Step 5 — Use the To-Do Sidebar

The **To-Do panel** (left side) is a holding area for tasks you plan to schedule.

**Adding tasks:**
- Type a title → press **Enter** or click **+**

**Managing tasks:**

| Button | Action |
|---|---|
| ✏️ | Edit title |
| ⧉ | Duplicate |
| ✕ | Delete |
| Clear all | Wipe entire list (with confirmation) |

**Scheduling a task:**
1. Drag a task from the sidebar and drop it onto any calendar hour slot
2. A dialog appears — confirm the hour and optionally assign a project
3. Click **Add to Calendar** — the task moves from To-Do to the calendar

**Collapsing the sidebar:**
Click **‹** to collapse the panel to a narrow icon strip. Click **›** to expand.

---

### Step 6 — Navigate the Calendar

**Top toolbar:**

| Control | Action |
|---|---|
| **Today** | Jump to current date |
| **‹ / ›** | Move backward / forward by week or day |
| Date label | Shows current date range |

**Calendar sub-header (inside the calendar):**

| Section | Controls |
|---|---|
| Left | Time range dropdown (how many hours are visible) |
| Center | Week / Work Week / Day view buttons |
| Right | Export to Excel button |

---

### Step 7 — Analytics

Click **📊 Analytics** at the bottom of the sidebar.

Shows **hours worked per project per day** for a selected date range (default: last 7 days).

| View | Description |
|---|---|
| **Timeline** (default) | Heat-map grid — rows = projects, columns = days, cells = hours logged |
| **Bar Chart** | Stacked bars — one per day, segmented by project |

---

### Step 8 — Export to Excel

Click the green **Export** button in the calendar sub-header:

1. Select a date range
2. Click **Export** — a `.xlsx` file downloads automatically

Columns: Date, Start Time, End Time, Duration, Description, Projects, Category.

---

## UI Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  TOOLBAR: [Today] [‹] [›] [Date Label]          [+ Task] [+ Proj]  │
├─────────────────┬──────────────────────────────────────────────────┤
│                 │  SUBHEADER: [Time Range ▾] [Week|WorkWk|Day] [Export] │
│  TO-DO          ├──────────────────────────────────────────────────┤
│  SIDEBAR        │                                                  │
│                 │  CALENDAR GRID                                   │
│  [task list]    │  Mon   Tue   Wed   Thu   Fri                     │
│                 │  ────────────────────────────                    │
│  ───────────    │  8am  [entry]  [entry]                           │
│  📊 Analytics   │  9am  [entry]                                    │
│  ⚙️  Settings   │  10am                                            │
│                 │  ...  (fills full viewport height)               │
└─────────────────┴──────────────────────────────────────────────────┘
```

---

## Calendar Views

| View | Days Shown |
|---|---|
| **Work Week** (default) | Monday – Friday |
| **Week** | Monday – Sunday |
| **Day** | Single selected day |

---

## Time Slot Range

| Option | Hours visible |
|---|---|
| Work Hours | 9 am – 5 pm |
| **Extended** (default) | 8 am – 6 pm |
| Full Day | 6 am – 10 pm |

---

## Appearance & Settings

Access via **⚙️ Settings** at the bottom of the sidebar.

- **Light / Dark mode** — toggle anytime, saved automatically
- Theming uses CSS custom properties — no hardcoded colors anywhere

---

## Analytics

### Timeline View (default)

Heat-map grid:
- Rows = active projects in the date range
- Columns = each day
- Cells = hours logged, with color intensity proportional to hours

### Bar Chart View

Stacked vertical bars:
- Each bar = one day
- Each segment = one project
- Height = hours logged

---

## Export to Excel

Uses **SheetJS (`xlsx`)** — the spreadsheet is generated entirely in the browser with no server call. Downloads as `.xlsx`.

---

## Data Storage

Data is stored in **MySQL** (local or any hosting provider). The Express API (`/api/...`) handles all reads and writes.

| Table | Contents |
|---|---|
| `time_entries` | All logged hours |
| `projects` | Project definitions |
| `categories` | Category definitions with colors |
| `entry_projects` | Many-to-many: entries ↔ projects |
| `todos` | To-Do task list |
| `todo_projects` | Many-to-many: todos ↔ projects |
| `settings` | Theme + time range preference |

See [docs/database.sql](docs/database.sql) for the full schema and [docs/backend-setup.md](docs/backend-setup.md) for setup and deployment instructions.

Any provider that supports Node.js + MySQL works for hosting — Railway, Render, Fly.io, DigitalOcean, AWS Lightsail, Google Cloud Run, Azure App Service, or any VPS.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.3.x |
| Language | TypeScript | 5.6.x |
| Build Tool | Vite | 5.4.x |
| Backend | Express | 5.x |
| Database | MySQL | 8+ / 9+ |
| DB Client | mysql2 | 3.x |
| Excel Export | SheetJS (`xlsx`) | 0.18.x |
| Styling | Plain CSS + custom properties | — |

No UI component library. No state management library. No routing library.

---

## Architecture Overview

```
Browser (React SPA)
  └── Vite dev server / static build (dist/)
        ├── hooks/               Custom hooks — one per data domain
        ├── services/
        │     └── apiService.ts  All fetch() calls to /api
        ├── models/types.ts      Shared TypeScript interfaces
        ├── utils/               Date math, colors, UUID
        └── components/          All UI components

Express Server (server/)
  ├── index.js                   Entry point — serves /api + /dist in production
  ├── db.js                      MySQL connection pool
  └── routes/
        ├── entries.js
        ├── projects.js
        ├── categories.js
        ├── todos.js
        └── settings.js

MySQL
  └── timecardtracker database
```

**Key decisions:**

- **No global state store.** All state lives in `App.tsx` via hooks, passed down as props.
- **One hour per entry.** Keeps the data model simple and the UI predictable.
- **No auth.** Single-user tool — no login, no sessions, no user table.
- **HTML5 Drag and Drop.** For todo→calendar and entry→slot moves.
- **React Portals for modals.** Rendered into `document.body` to escape `overflow: hidden` containers.
- **Flex-based proportional layout.** Grid fills 100% viewport height, each slot takes `flex: 1`.

---

## Project Structure

```
TimeCardTracker/
├── index.html
├── vite.config.ts
├── package.json
├── .env.local                   Local DB credentials (git-ignored)
├── .env                         Template — real values set on the hosting provider
│
├── docs/
│   ├── database.sql             MySQL schema — run once to init tables
│   ├── seed_data.sql            Generic sample data — basic multi-project setup
│   ├── demo_software_engineer.sql  Demo: full-stack software engineer
│   ├── demo_accountant.sql         Demo: accountant with 3 clients
│   ├── demo_estimator.sql          Demo: construction estimator across 5 bids
│   └── backend-setup.md         Full local + production setup guide
│
├── server/
│   ├── index.js                 Express entry point
│   ├── db.js                    MySQL pool (reads from env vars)
│   └── routes/
│       ├── entries.js
│       ├── projects.js
│       ├── categories.js
│       ├── todos.js
│       └── settings.js
│
└── src/
    ├── App.tsx                  Root — hooks wiring, renders CalendarShell
    ├── models/types.ts          All TypeScript interfaces
    ├── services/
    │   ├── apiService.ts        HTTP calls to /api
    │   └── storageService.ts    Legacy localStorage helpers (kept for reference)
    ├── hooks/
    │   ├── useTimeEntries.ts
    │   ├── useProjects.ts
    │   ├── useCategories.ts
    │   ├── useSettings.ts
    │   └── useTodos.ts
    ├── utils/
    │   ├── dateUtils.ts
    │   ├── colorUtils.ts
    │   ├── uuidUtils.ts
    │   └── migrateToDb.ts       One-time localStorage → MySQL migration utility
    └── components/
        ├── Calendar/CalendarShell.tsx
        ├── CalendarSubHeader/
        ├── Toolbar/
        ├── TimeGrid/
        ├── TimeEntryBlock/
        ├── TodoSidebar/
        ├── EntryModal/
        ├── ConfirmDropModal/
        ├── ProjectModal/
        ├── ExportModal/
        ├── WeekView/
        ├── DailyView/
        └── Analytics/
```

---

## Data Model

```typescript
interface TimeEntry {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  startHour: number;    // 0–23
  endHour: number;      // always startHour + 1
  description: string;
  projectIds: string[];
}

interface Project {
  id: string;
  name: string;
  categoryId: string;
}

interface CategoryDef {
  id: string;
  name: string;
  color: string;        // hex e.g. '#4285F4'
}

interface TodoItem {
  id: string;
  title: string;
  note?: string;
  createdAt: string;
}

interface AppSettings {
  theme: 'light' | 'dark';
  timeRange: 'work' | 'extended' | 'full';
}
```

---

## Component Reference

| Component | Role |
|---|---|
| `CalendarShell` | Main orchestrator — owns view state, modal state, drag-drop handlers |
| `CalendarSubHeader` | 3-column bar: time range select, view toggle, export button |
| `Toolbar` | Top nav: Today, prev/next, date label, + Task, + Projects |
| `TimeGrid` | Core grid — header row + day columns + hour slots |
| `TimeEntryBlock` | Absolutely-positioned block for multi-hour entries |
| `TodoSidebar` | To-Do panel + Analytics + Settings at bottom |
| `EntryModal` | Add/edit entry form (React Portal) |
| `ConfirmDropModal` | Confirm todo→calendar drop with hour + project selection |
| `ProjectModal` | Manage categories and projects |
| `ExportModal` | Date range picker → downloads .xlsx |
| `AnalyticsPanel` | Date filter + tab switcher for Timeline / Bar Chart |

---

## State & Data Flow

```
App.tsx
  ├── useTimeEntries()  → entries[], addEntry, updateEntry, deleteEntry
  ├── useProjects()     → projects[], addProject, deleteProject
  ├── useCategories()   → categories[], addCategory, deleteCategory
  ├── useSettings()     → settings, setTheme, setTimeRange
  └── useTodos()        → todos[], addTodo, updateTodo, deleteTodo, ...
        │
        └── <CalendarShell> receives all as props
              ├── <Toolbar />
              ├── <CalendarSubHeader />
              ├── <TodoSidebar />
              └── <WeekView /> / <DailyView /> / <AnalyticsPanel />
                    └── <TimeGrid />
```

Data flows top-down as props. Mutations flow up as callbacks. No context or global store.

---

## Styling System

All CSS is co-located with its component. Global variables are defined in `App.css`:

```css
:root {
  --color-accent:         #4285F4;
  --color-bg:             #ffffff;
  --color-surface:        #f8f9fa;
  --color-hover:          #f1f3f4;
  --color-border:         #e0e0e0;
  --color-text-primary:   #202124;
  --color-text-secondary: #5f6368;
  --color-danger:         #d32f2f;
}
```

Dark mode overrides all variables via `[data-theme="dark"]` on `<html>`.

---

## Notes & Limitations

| Item | Detail |
|---|---|
| 1-hour granularity | Entries are whole hours — no half-hours or minutes |
| No undo | Deletions are permanent |
| No multi-user | Single-user tool — no accounts, no sharing |
| No offline PWA | Requires a running server |
| Export as backup | Use Excel export regularly if running without a persistent DB |

---

## Security

- No secrets in the codebase — credentials are environment variables only
- `.env.local` is git-ignored — never committed
- `.env` in the repo is a placeholder template only — real values are set on the hosting provider's environment panel
- No external API calls at runtime
- No authentication — intentional for a single-user local tool
- All user input rendered via React's default escaping — no `dangerouslySetInnerHTML`

---

## Roadmap

Planned improvements:

- Google Calendar / Outlook sync
- Billing and invoicing export
- Weekly summary reports
- Mobile-friendly layout
- Role-based access for team use
- Multi-user support

---

## License

MIT
