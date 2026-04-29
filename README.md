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
10. [Time Distribution](#time-distribution)
11. [Export to Excel](#export-to-excel)
12. [Data Storage](#data-storage)
13. [Tech Stack](#tech-stack)
14. [Architecture Overview](#architecture-overview)
15. [Project Structure](#project-structure)
16. [API Reference](#api-reference)
17. [Data Model](#data-model)
18. [Component Reference](#component-reference)
19. [State & Data Flow](#state--data-flow)
20. [Styling System](#styling-system)
21. [Migrating from localStorage](#migrating-from-localstorage)
22. [Notes & Limitations](#notes--limitations)
23. [Security](#security)
24. [Roadmap](#roadmap)

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

This creates the `timecardtracker` database with all required tables and seeds the default settings row.

### Configure environment

Create `.env.local` in the project root with your MySQL credentials:

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
# Terminal 1 — Backend (Express + MySQL)
npm run dev:server

# Terminal 2 — Frontend (Vite)
npm run dev
```

App opens at `http://localhost:5173`. The `--host` flag also makes it accessible from other devices on your local network.

> The backend must be running before the frontend loads — all data calls go to `/api`.

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

### Step 1 — Create Categories

Before logging time, define your categories:

1. Click **+ Category** in the top toolbar.
2. Fill in:
   - **Name** — e.g., "Client A" or "Development"
   - **Weekly Hours Target** — optional goal (e.g., `40`). Drives the Time Distribution progress bars.
   - **Personal time** — check this to exclude the category from the work-hours summary.
   - **Color** — pick from 12 preset colors.
3. Click **Add Category**.

You can edit or delete categories at any time from the same modal. A category cannot be deleted while it has projects assigned to it.

---

### Step 2 — Create Projects

Projects live under categories and appear on calendar entries.

1. Click **+ Projects** in the top toolbar.
2. Select a **Category** and enter a **Project name**.
3. Click **Add Project**.

You can have as many categories and projects as needed. When a project is deleted, all references to it are removed from existing time entries automatically.

---

### Step 3 — Log Time

Each calendar entry represents **exactly one hour** of work.

**Two ways to create an entry:**

| Method | How |
|---|---|
| Click a slot | Click any hour cell in the calendar grid |
| + Task button | Click **+ Task** in the top toolbar (defaults to current hour, today) |

The entry form asks for:
- **Date** — shown as read-only when clicking a slot
- **Hour** — which hour you worked (selectable when using the toolbar button)
- **Description** — what you worked on (required)
- **Projects** — optional — assign to one or more projects via checkboxes

Entries appear as color-coded strips inside their hour slot, colored by their assigned category. Multiple entries in the same slot stack vertically and split the hour equally between them in the Time Distribution panel.

---

### Step 4 — Edit or Delete Entries

Click any entry on the calendar to open the edit form:

- Change the hour, description, or project assignments → **Save**
- **Duplicate** — creates a copy of the entry at the same time slot (useful for recurring tasks)
- **Delete** — removes the entry permanently

---

### Step 5 — Move Entries by Dragging

Drag any calendar entry to a different slot:

1. Grab the entry and drop it on a new hour slot (same day or another day)
2. A confirmation dialog appears before the move is applied
3. The entry keeps its original duration

---

### Step 6 — Copy Last Week

Click **Copy last week** in the top toolbar to duplicate the previous week's entries into the current view:

- Copies all entries from the 7 days prior to the currently visible days
- Warns you if the current week already has entries (duplicates may be created)
- Useful for recurring weekly schedules

---

### Step 7 — Use the To-Do Sidebar

The **To-Do panel** (left side) is a holding area for tasks you plan to schedule. It starts collapsed — click **›** to expand it.

**Adding tasks:**
- Type a title in the input field → press **Enter** or click **+**
- Click **≡** to add an optional note to the task before saving

**Managing tasks:**

| Button | Action |
|---|---|
| ✏️ | Edit title and note |
| ⧉ | Duplicate |
| ✕ | Delete |
| Clear all | Wipe entire list (with confirmation) |

**Scheduling a task:**
1. Drag a task from the sidebar and drop it onto any calendar hour slot
2. A dialog appears — confirm the hour and optionally assign a project
3. Click **Add to Calendar** — the task moves from To-Do to the calendar as a time entry

**Collapsing the sidebar:**
Click **‹** to collapse the panel to a narrow icon strip. Click **›** to expand.

---

### Step 8 — Navigate the Calendar

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

### Step 9 — Analytics

Click **Analytics** at the bottom of the sidebar.

Shows **hours worked per day** for a selected date range (default: last 7 days), broken down two ways:

| View | Description |
|---|---|
| **Timeline** (default) | Heat-map grid — rows = projects or categories, columns = days, cells = hours logged |
| **Bar Chart** | Stacked bars — one per day, segmented by project or category |

Both views display a **By Project** section and a **By Category** section side by side.

---

### Step 10 — Export to Excel

Click the green **Export** button in the calendar sub-header:

1. Select a date range (default: last 28 days)
2. The modal shows how many entries will be included
3. Click **Download .xlsx** — a file downloads automatically

Columns: Date, Start Time, End Time, Duration (hrs), Description, Projects, Category.

---

## UI Layout

```
+--------------------------------------------------------------------+
|  TOOLBAR: [Today] [<] [>] [Date Label]   [+Task][+Cat][+Proj][Copy]|
+------------------+-------------------------------------------------+
|                  | SUBHEADER: [Time Range v] [Week|WorkWk|Day] [Export] |
|  TO-DO           +-------------------------------------------------+
|  SIDEBAR         |                                                 |
|  (collapsed      |  CALENDAR GRID                                  |
|   by default)    |  Mon   Tue   Wed   Thu   Fri                    |
|                  |  -----------------------------------------------+
|  [task list]     |  8am  [entry]  [entry]                          |
|                  |  9am  [entry]                                   |
|  ------------    |  10am                                           |
|  Analytics       |  ...  (fills full viewport height)              |
|  Settings        +-------------------------------------------------+
|                  |  TIME DISTRIBUTION (progress bars per category) |
+------------------+-------------------------------------------------+
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
| Work Hours | 9 am – 5 pm (8 slots) |
| **Extended** (default) | 8 am – 6 pm (10 slots) |
| Full Day | 6 am – 10 pm (16 slots) |

---

## Appearance & Settings

Access via **Settings** at the bottom of the sidebar (the gear icon).

- **Light / Dark mode** — toggle anytime, saved automatically to the database
- Theming uses CSS custom properties — no hardcoded colors anywhere
- Settings open as a centered modal overlay

---

## Analytics

### Timeline View (default)

Heat-map grid displayed in two sections:

**By Project:**
- Rows = projects active in the date range
- Columns = each day
- Cells = hours logged, with color intensity proportional to hours

**By Category:**
- Same layout, but rows are aggregated by category

### Bar Chart View

Stacked vertical bars displayed in two sections:

**By Project:**
- Each bar = one day
- Each segment = one project
- Height = hours logged

**By Category:**
- Same layout, but segments are aggregated by category

---

## Time Distribution

The **Time Distribution** panel appears at the bottom of the calendar (below the grid) in both Week and Day views. It shows how the currently visible week's hours are distributed across categories.

### What it shows

- One row per category that has a weekly hours target set **or** has hours logged this week
- Categories with a `weeklyHours` target come first, then any others with logged hours
- Each row shows: category color dot, category name, hours logged, target (if set), and a progress bar

### Progress bar states

| State | Condition |
|---|---|
| Normal | < 75% of target reached |
| Warning (yellow) | >= 75% of target, not yet over |
| Over (red) | Exceeded target — shows "+Xh over" |

### Work summary

If any category has a weekly hours target, a **work summary** appears in the header: `Xh / Yh`. This total excludes categories marked as **Personal time**.

### Hour-splitting logic

When multiple entries share the same date and start hour, the hour is split equally among them for distribution purposes (e.g., two entries at 9am = 0.5h each). Multi-hour entries count their full duration.

### Totals footer

If any category has a target, a footer row shows total logged vs total target across all categories.

---

## Export to Excel

Uses **SheetJS (`xlsx`)** — the spreadsheet is generated entirely in the browser with no server call. Downloads as `.xlsx`.

Default date range: last 28 days. The modal shows a live count of entries that will be included before you export.

---

## Data Storage

Data is stored in **MySQL** (local or any hosting provider). The Express API (`/api/...`) handles all reads and writes.

| Table | Contents |
|---|---|
| `categories` | Category definitions — name, color, weekly_hours |
| `projects` | Project definitions — name, category reference |
| `time_entries` | All logged hours — date, start/end hour, description |
| `entry_projects` | Many-to-many: entries to projects |
| `todos` | To-Do task list — text, sort_order |
| `todo_projects` | Many-to-many: todos to projects |
| `settings` | Single-row table: theme, time_range, view_mode |

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
        │     ├── apiService.ts  All fetch() calls to /api
        │     └── storageService.ts  Legacy localStorage helpers (kept for migration reference)
        ├── models/types.ts      Shared TypeScript interfaces
        ├── utils/               Date math, colors, UUID, migration helper
        └── components/          All UI components

Express Server (server/)
  ├── index.js                   Entry point — serves /api + /dist in production
  ├── db.js                      MySQL connection pool (reads from env vars)
  └── routes/
        ├── entries.js           GET/POST/PUT/DELETE /api/entries
        ├── projects.js          GET/POST/DELETE /api/projects
        ├── categories.js        GET/POST/PUT/DELETE /api/categories
        ├── todos.js             GET/POST/PUT/DELETE /api/todos
        └── settings.js          GET/PUT /api/settings

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
- **Transactions for multi-table writes.** Entry and todo saves use MySQL transactions to keep `entry_projects` / `todo_projects` in sync.

---

## Project Structure

```
TimeCardTracker/
├── index.html
├── vite.config.ts
├── package.json
├── .env.local                   Local DB credentials (git-ignored)
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
    │   ├── apiService.ts        HTTP calls to /api (active)
    │   └── storageService.ts    Legacy localStorage helpers (migration reference only)
    ├── hooks/
    │   ├── useTimeEntries.ts    entries[], addEntry, updateEntry, deleteEntry, scrubProjectId
    │   ├── useProjects.ts       projects[], addProject, deleteProject
    │   ├── useCategories.ts     categories[], addCategory, updateCategory, deleteCategory
    │   ├── useSettings.ts       settings, setTheme, setTimeRange
    │   └── useTodos.ts          todos[], addTodo, updateTodo, deleteTodo, duplicateTodo, clearAllTodos
    ├── utils/
    │   ├── dateUtils.ts         Date math, hour slots, formatting helpers
    │   ├── colorUtils.ts        Preset colors, category color lookup, multi-project color logic
    │   ├── uuidUtils.ts         ID generation (nanoid)
    │   └── migrateToDb.ts       One-time localStorage -> MySQL migration utility
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
        ├── CategoryModal/
        ├── ExportModal/
        ├── WeekView/
        ├── DailyView/
        ├── TimeDistribution/
        └── Analytics/
              ├── AnalyticsPanel.tsx
              ├── BarChart.tsx
              └── Timeline.tsx
```

---

## API Reference

All endpoints are under `/api`. The frontend connects via `apiService.ts`.

### Categories

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/categories` | — | List all categories |
| POST | `/api/categories` | `{ id, name, color, weekly_hours }` | Create category |
| PUT | `/api/categories/:id` | `{ name, color, weekly_hours }` | Update category |
| DELETE | `/api/categories/:id` | — | Delete category |

### Projects

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/projects` | — | List all projects |
| POST | `/api/projects` | `{ id, name, color, category_id }` | Create project |
| DELETE | `/api/projects/:id` | — | Delete project (cascades entry_projects) |

### Time Entries

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/entries` | `?start=YYYY-MM-DD&end=YYYY-MM-DD` | List entries (optional date filter) |
| POST | `/api/entries` | `{ id, date, startHour, endHour, description, projectIds[] }` | Create entry |
| PUT | `/api/entries/:id` | `{ date, startHour, endHour, description, projectIds[] }` | Update entry |
| DELETE | `/api/entries/:id` | — | Delete entry (cascades entry_projects) |

### Todos

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/todos` | — | List all todos |
| POST | `/api/todos` | `{ id, text, done, sort_order }` | Create todo |
| PUT | `/api/todos/:id` | `{ text, done, sort_order }` | Update todo |
| DELETE | `/api/todos/:id` | — | Delete todo |

### Settings

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/settings` | — | Get current settings (single row) |
| PUT | `/api/settings` | `{ theme, time_range, view_mode }` | Save settings |

---

## Data Model

```typescript
interface TimeEntry {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  startHour: number;    // integer 0–23
  endHour: number;      // always startHour + 1
  description: string;
  projectIds: string[]; // references Project.id[]
}

interface Project {
  id: string;
  name: string;
  categoryId: string;   // references CategoryDef.id
}

interface CategoryDef {
  id: string;
  name: string;
  color: string;        // hex e.g. '#4285F4'
  weeklyHours: number;  // target hours per week (0 = no target)
  isPersonal?: boolean; // if true, excluded from work-hours summary
}

interface TodoItem {
  id: string;
  title: string;
  note?: string;        // optional freeform note
  createdAt: string;    // ISO timestamp
}

interface AppSettings {
  theme: 'light' | 'dark';
  timeRange: 'work' | 'extended' | 'full';
}

type ViewMode = 'week-with-weekends' | 'week-without-weekends' | 'daily';
```

---

## Component Reference

| Component | Role |
|---|---|
| `CalendarShell` | Main orchestrator — owns view state, modal state, drag-drop handlers, copy-last-week logic |
| `Toolbar` | Top nav: Today, prev/next, date label, + Task, + Category, + Projects, Copy last week |
| `CalendarSubHeader` | 3-column bar: time range select, view toggle (Week / Work Week / Day), export button |
| `TimeGrid` | Core grid — header row + day columns + hour slots |
| `TimeEntryBlock` | Absolutely-positioned block rendered inside each hour slot |
| `WeekView` | Renders TimeGrid for a multi-day range |
| `DailyView` | Renders TimeGrid for a single day |
| `TimeDistribution` | Progress bar panel below the grid — category hours vs weekly target |
| `TodoSidebar` | Collapsible left panel: To-Do list + Analytics button + Settings button |
| `EntryModal` | Add/edit entry form (React Portal) — description, hour, project checkboxes |
| `ConfirmDropModal` | Confirm todo→calendar drop with hour + project selection (React Portal) |
| `CategoryModal` | Create / edit / delete categories with color picker and weekly hours target (React Portal) |
| `ProjectModal` | Create / delete projects grouped under categories (React Portal) |
| `ExportModal` | Date range picker → generates and downloads `.xlsx` in the browser (React Portal) |
| `AnalyticsPanel` | Date filter + tab switcher (Timeline / Bar Chart) with By Project and By Category sections |
| `Timeline` | Heat-map grid used inside AnalyticsPanel |
| `BarChart` | Stacked bar chart used inside AnalyticsPanel |

---

## State & Data Flow

```
App.tsx
  ├── useTimeEntries()   -> entries[], addEntry, updateEntry, deleteEntry, scrubProjectId
  ├── useProjects()      -> projects[], addProject, deleteProject
  ├── useCategories()    -> categories[], addCategory, updateCategory, deleteCategory
  ├── useSettings()      -> settings, setTheme, setTimeRange
  └── useTodos()         -> todos[], addTodo, updateTodo, deleteTodo, duplicateTodo, clearAllTodos
        |
        └── <CalendarShell> receives all as props
              ├── <Toolbar />
              ├── <TodoSidebar />
              ├── <CalendarSubHeader />          (calendar view only)
              ├── <WeekView /> / <DailyView />   (calendar view)
              │     └── <TimeGrid />
              │           └── <TimeEntryBlock /> (per entry)
              ├── <TimeDistribution />           (below the grid, calendar view)
              └── <AnalyticsPanel />             (analytics view)
                    ├── <Timeline />
                    └── <BarChart />
```

Data flows top-down as props. Mutations flow up as callbacks. No context or global store.

Each hook fetches its data from the API on mount and keeps a local React state copy in sync. Writes go to the API first, then optimistically update local state.

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

Dark mode overrides all variables via `[data-theme="dark"]` on `<html>`, set by `useSettings` whenever the theme changes.

**Color utilities (`colorUtils.ts`):**

- `PRESET_COLORS` — 12 curated hex colors used in color pickers
- `getCategoryColor(categoryId, categories)` — returns a category's hex color, or grey if not found
- `deriveBlockColor(projectIds, projects, categories)` — returns the category color when all assigned projects share one category, or grey for mixed-category entries

---

## Migrating from localStorage

If you previously ran an older version of this app that stored data in localStorage (keys: `tct_entries`, `tct_projects`, `tct_categories`, `tct_todos`, `tct_settings`), you can migrate that data to MySQL using the included utility.

**From the browser console** (with the backend running):

```javascript
import('/src/utils/migrateToDb.ts').then(m => m.migrateToDb())
```

Or temporarily add `migrateToDb()` to a `useEffect` in `App.tsx`, run the app once, then remove it.

The function logs progress to the console and migrates: categories, projects, time entries, todos, and settings.

---

## Notes & Limitations

| Item | Detail |
|---|---|
| 1-hour granularity | Entries are whole hours — no half-hours or minutes |
| No undo | Deletions are permanent |
| No multi-user | Single-user tool — no accounts, no sharing |
| No offline mode | Requires a running backend server |
| Export as backup | Use Excel export regularly if running without a persistent DB |
| Entry drag confirm | Moving an entry uses `window.confirm` — cannot be dismissed with keyboard only |

---

## Security

- No secrets in the codebase — credentials are environment variables only
- `.env.local` is git-ignored — never committed
- No authentication — intentional for a single-user local tool
- No external API calls at runtime — all data stays local
- All user input rendered via React's default escaping — no `dangerouslySetInnerHTML`
- MySQL credentials read from env vars at runtime — never hardcoded

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
