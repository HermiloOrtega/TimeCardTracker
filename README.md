# TimeCardTracker

A lightweight, browser-based time tracking application for logging work hours across multiple projects and categories. No backend, no account required — everything lives in your browser.

---

## Table of Contents

1. [What Is This?](#what-is-this)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Data Model](#data-model)
6. [Getting Started](#getting-started)
7. [How to Use](#how-to-use)
8. [UI Layout](#ui-layout)
9. [Calendar Views](#calendar-views)
10. [Appearance & Settings](#appearance--settings)
11. [Analytics](#analytics)
12. [Export to Excel](#export-to-excel)
13. [Data Storage](#data-storage)
14. [Key Concepts & Glossary](#key-concepts--glossary)
15. [Component Reference](#component-reference)
16. [State & Data Flow](#state--data-flow)
17. [Styling System](#styling-system)
18. [Notes & Limitations](#notes--limitations)

---

## What Is This?

TimeCardTracker is a personal time tracking tool built with **React 18 + TypeScript**, running entirely in the browser with no backend. It is designed for individual professionals who need a fast, visual way to log daily work hours across multiple clients or projects.

**Core capabilities:**

- Visual calendar grid — daily and weekly views with hour-level granularity
- One task per hour slot — each entry represents exactly one hour of work
- Color-coded entries by project and category
- To-Do sidebar — plan tasks and drag them directly onto the calendar
- Built-in analytics — hours per project per day (last 7 days default)
- Export to Excel (`.xlsx`) for reporting or invoicing
- Light and dark mode, persisted automatically
- Configurable time slot range (Work Hours, Extended, Full Day)
- All data stored in browser `localStorage` — zero server dependency

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.3.x |
| Language | TypeScript | 5.6.x |
| Build Tool | Vite | 5.4.x |
| Persistence | Browser `localStorage` | — |
| Excel Export | SheetJS (`xlsx`) | 0.18.x |
| Styling | Plain CSS with custom properties | — |
| Module System | ESM (native browser modules via Vite) | — |
| Type Checking | `tsc --noEmit` (strict) | — |

No UI framework libraries (no Material UI, no Tailwind). No state management library (no Redux, no Zustand). No routing library. No test framework currently configured.

---

## Architecture Overview

```
Browser
  └── React SPA (Vite dev server / static build)
        ├── App.tsx                  Entry point — wires hooks, renders CalendarShell
        ├── hooks/                   Custom hooks for each data domain
        │     ├── useTimeEntries     CRUD for time entries (localStorage)
        │     ├── useProjects        CRUD for projects (localStorage)
        │     ├── useCategories      CRUD for categories (localStorage)
        │     ├── useSettings        Theme + time range preference (localStorage)
        │     └── useTodos           CRUD for to-do items (localStorage)
        ├── services/
        │     └── storageService     Raw get/set wrappers + data migration
        ├── models/
        │     └── types.ts           All shared TypeScript interfaces
        ├── utils/
        │     ├── dateUtils          Date math, slot helpers, formatting
        │     ├── colorUtils         Category color derivation
        │     └── idUtils            UUID generation
        └── components/              All UI — no shared global store
```

**Key architectural decisions:**

- **No global state store.** All state lives in `App.tsx` via hooks and is passed down as props. `CalendarShell` is the main orchestrator receiving all callbacks.
- **localStorage as the database.** Five separate keys partition the data. Reads happen on mount; writes happen on every mutation via the hooks.
- **HTML5 Drag and Drop API.** Used for todo-to-calendar drops and entry-to-slot repositioning. `dataTransfer` carries either a `todoId` or an `entryId + entryDuration`.
- **React Portals for modals.** `EntryModal` and `ConfirmDropModal` render into `document.body` via `ReactDOM.createPortal` to escape any `overflow: hidden` containers.
- **CSS custom properties for theming.** The `[data-theme="dark"]` attribute on `<html>` switches the full theme by redefining all `--color-*` variables.
- **Flex-based proportional layout.** The time grid fills 100% of the viewport height. Each hour slot takes an equal `flex: 1` share — no fixed pixel heights. Multi-hour entry blocks use percentage-based `top` and `height`.

---

## Project Structure

```
TimeCardTracker/
├── index.html                      # Root HTML — sets html/body/root to height: 100%
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx                    # ReactDOM.createRoot mount
    ├── App.tsx                     # Root component — hooks wiring, migrateIfNeeded()
    ├── App.css                     # Global CSS: theme variables, reset, scrollbars
    │
    ├── models/
    │   └── types.ts                # TimeEntry, Project, CategoryDef, TodoItem,
    │                               #   AppSettings, Theme, TimeRange, ViewMode
    │
    ├── services/
    │   └── storageService.ts       # localStorage helpers + schema migration
    │
    ├── hooks/
    │   ├── useTimeEntries.ts       # entries state + addEntry / updateEntry / deleteEntry
    │   ├── useProjects.ts          # projects state + addProject / deleteProject
    │   ├── useCategories.ts        # categories state + addCategory / deleteCategory
    │   ├── useSettings.ts          # settings state + setTheme / setTimeRange
    │   └── useTodos.ts             # todos state + addTodo / updateTodo / deleteTodo
    │                               #   / duplicateTodo / clearAllTodos
    │
    ├── utils/
    │   ├── dateUtils.ts            # SLOT_HEIGHT_PX, HOUR_SLOTS, getHourSlots(),
    │   │                           #   toDateString(), fromDateString(), addDays(),
    │   │                           #   getMonday(), getWeekDays(), formatDateRange(),
    │   │                           #   formatHour(), formatDayHeader(), isWeekend()
    │   ├── colorUtils.ts           # getCategoryColor(), deriveBlockColor()
    │   └── idUtils.ts              # generateId() → crypto.randomUUID()
    │
    └── components/
        ├── Calendar/
        │   ├── CalendarShell.tsx   # Main orchestrator: view state, modal state,
        │   │                       #   drag-drop handlers, renders Toolbar +
        │   │                       #   CalendarSubHeader + TodoSidebar + views
        │   └── CalendarShell.css
        │
        ├── CalendarSubHeader/
        │   ├── CalendarSubHeader.tsx  # 3-column bar inside calendar area:
        │   │                          #   time range select | view toggle | Export btn
        │   └── CalendarSubHeader.css
        │
        ├── Toolbar/
        │   ├── Toolbar.tsx         # Top nav: Today, ‹ ›, date label, + Task, + Projects
        │   └── Toolbar.css
        │
        ├── TimeGrid/
        │   ├── TimeGrid.tsx        # Core grid: header row + day columns + hour slots
        │   │                       #   SlotStrip (single-hour entries as flex rows)
        │   │                       #   assignColumnLayout() for overlapping multi-hour
        │   └── TimeGrid.css
        │
        ├── TimeEntryBlock/
        │   ├── TimeEntryBlock.tsx  # Absolutely-positioned block for multi-hour entries
        │   │                       #   Uses % top/height relative to day column
        │   └── TimeEntryBlock.css
        │
        ├── TodoSidebar/
        │   ├── TodoSidebar.tsx     # To-Do panel: add/edit/delete/duplicate/drag tasks
        │   │                       #   + bottom section: Analytics btn + Settings popup
        │   │                       #   Collapse → icons-only mode
        │   └── TodoSidebar.css
        │
        ├── EntryModal/
        │   ├── EntryModal.tsx      # Add / Edit time entry modal (React Portal)
        │   │                       #   Hour selector only (1 hour per task)
        │   └── EntryModal.css
        │
        ├── ConfirmDropModal/
        │   ├── ConfirmDropModal.tsx  # Confirms todo→calendar drop; sets hour, project
        │   └── ConfirmDropModal.css
        │
        ├── ProjectModal/
        │   ├── ProjectModal.tsx    # Manage categories and projects
        │   └── ProjectModal.css
        │
        ├── ExportModal/
        │   ├── ExportModal.tsx     # Date range picker → downloads .xlsx
        │   └── ExportModal.css
        │
        ├── WeekView/
        │   └── WeekView.tsx        # Wrapper: passes week days array to TimeGrid
        │
        ├── DailyView/
        │   └── DailyView.tsx       # Wrapper: passes single day to TimeGrid
        │
        └── Analytics/
            ├── AnalyticsPanel.tsx  # Shell: date range filter, tab switcher
            ├── BarChart.tsx        # Stacked bars: hours per project per day
            ├── Timeline.tsx        # Heat-map grid: project × day with hour counts
            └── AnalyticsPanel.css
```

---

## Data Model

All types are defined in `src/models/types.ts`.

### TimeEntry

```typescript
interface TimeEntry {
  id: string;           // crypto.randomUUID()
  date: string;         // 'YYYY-MM-DD'
  startHour: number;    // 0–23 integer
  endHour: number;      // startHour + 1 (always 1 hour per entry)
  description: string;
  projectIds: string[]; // can be empty (unassigned) or multiple
}
```

### Project

```typescript
interface Project {
  id: string;
  name: string;
  categoryId: string;
}
```

### CategoryDef

```typescript
interface CategoryDef {
  id: string;
  name: string;
  color: string;  // hex color, e.g. '#4285F4'
}
```

### TodoItem

```typescript
interface TodoItem {
  id: string;
  title: string;
  note?: string;
  createdAt: string;  // ISO date string
}
```

### AppSettings

```typescript
interface AppSettings {
  theme: 'light' | 'dark';
  timeRange: 'work' | 'extended' | 'full';
}
```

### ViewMode

```typescript
type ViewMode = 'week-with-weekends' | 'week-without-weekends' | 'daily';
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
git clone <repo-url>
cd TimeCardTracker
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. The `--host` flag is set in `package.json`, so the app is also reachable from other devices on your local network via `http://<your-ip>:5173`.

> **Note:** Each browser origin (hostname + port) has its own localStorage namespace. Data logged at `localhost:5173` is not visible when accessing from a network IP, and vice versa.

### Production Build

```bash
npm run build       # outputs to dist/
npm run preview     # serves the built dist/ locally
```

---

## How to Use

### Step 1 — Set Up Categories and Projects

Before logging time, define your **categories** and **projects**:

1. Click **+ Projects** in the top toolbar.
2. Create a **Category** — give it a name and pick a color (e.g., "Client Work" → blue).
3. Add a **Project** under that category (e.g., "Website Redesign").

Categories provide the color identity; projects inherit their category's color on the calendar.

> Default seed data includes categories: **Quattro**, **RAM/IbexIQ**, **Multi-company**, **Personal**

---

### Step 2 — Log Time

Each calendar entry represents **exactly one hour** of work.

**Two ways to create an entry:**

| Method | How |
|---|---|
| Click a slot | Click any hour cell in the calendar grid |
| + Task button | Click **+ Task** in the top toolbar (defaults to current hour, today) |

The **New Entry** form asks for:
- **Hour** — which hour you worked (e.g., 9 AM = 9:00–10:00)
- **Description** — what you worked on
- **Projects** — optional checkbox list to assign the entry to one or more projects

Entries appear as color-coded strips inside their hour slot. Multiple entries in the same slot stack vertically as equal-height rows.

---

### Step 3 — Edit, Duplicate, or Delete Entries

Click any entry on the calendar to open the **Edit Entry** form:

- Modify the hour, description, or project assignments → **Save**
- **Duplicate** — creates an identical copy (useful for repeated work)
- **Delete** — permanently removes the entry

---

### Step 4 — Move Entries by Dragging

Drag any calendar entry to a different slot:

1. Grab the entry block and drop it on a new hour slot (same day or different day)
2. A confirmation dialog appears: _"Move X to [date] at [hour]:00?"_
3. Confirm to move — duration is always preserved as 1 hour

---

### Step 5 — Use the To-Do Sidebar

The **To-Do panel** (left side) is a holding area for tasks you plan to schedule.

**Adding tasks:**
- Type a title in the input field → press **Enter** or click **+**
- Click **≡** to add an optional note

**Managing tasks:**

| Button | Action |
|---|---|
| ✏️ | Edit title/note inline |
| ⧉ | Duplicate the task |
| ✕ | Delete the task |
| Clear all | Wipe entire list (with confirmation) |

**Scheduling a task:**
1. Drag a task by its handle (**⠿**) and drop it onto any calendar hour slot
2. A **Schedule Task** dialog appears — confirm or adjust the hour and project
3. Click **Add to Calendar** — the task is removed from To-Do and appears on the calendar

**Collapsing the sidebar:**
Click **‹** to collapse the panel to a narrow 48px strip. When collapsed:
- Task count badge is hidden
- Analytics and Settings collapse to icon-only buttons
- Click **›** to expand back

---

### Step 6 — Navigate the Calendar

**Top toolbar** (always visible):

| Control | Action |
|---|---|
| **Today** | Jump to current date |
| **‹ / ›** | Move backward / forward by day or week |
| Date label | Shows current date range |

**Calendar sub-header** (inside the calendar area):

| Section | Controls |
|---|---|
| Left | Time range dropdown |
| Center | Week / Work Week / Day view buttons |
| Right | Export to Excel button |

---

### Step 7 — Analytics

Click **📊 Analytics** at the bottom of the To-Do sidebar.

The analytics panel shows **hours worked per project per day** for a selected date range (default: last 7 days).

**Two views:**

| View | Description |
|---|---|
| **Timeline** (default) | Heat-map grid — rows = projects, columns = days. Each cell shows the hour count (e.g. `2h`) with color intensity proportional to hours. |
| **Bar Chart** | Stacked vertical bars — one bar per day, each segment = one project. |

Use the **From / To** date inputs to adjust the analysis window.

---

### Step 8 — Export to Excel

Click the green **Export** button in the calendar sub-header:

1. Select a **start date** and **end date**
2. Review the entry count shown
3. Click **Export** — a `.xlsx` file downloads automatically

**Columns in the Excel file:**

| Column | Content |
|---|---|
| Date | YYYY-MM-DD |
| Start Time | e.g. 9:00 AM |
| End Time | e.g. 10:00 AM |
| Duration | e.g. 1h |
| Description | Task description |
| Projects | Comma-separated project names |
| Category | Category name |

Filename: `timecard-YYYY-MM-DD-to-YYYY-MM-DD.xlsx`

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  TOOLBAR: [Today] [‹] [›] [Date Label]        [+ Task] [+ Proj] │
├────────────────┬────────────────────────────────────────────────┤
│                │  SUBHEADER: [Time Range ▾] [Week|WorkWk|Day] [Export] │
│  TO-DO         ├────────────────────────────────────────────────┤
│  SIDEBAR       │                                                │
│                │  CALENDAR GRID                                 │
│  [task list]   │  Mon  Tue  Wed  Thu  Fri                       │
│                │  ─────────────────────────────                 │
│  ─────────     │  8am  [entry]  [entry]                         │
│  📊 Analytics  │  9am  [entry]                                  │
│  ⚙️ Settings   │  10am                                          │
│                │  ...  (fills full viewport height)             │
└────────────────┴────────────────────────────────────────────────┘
```

The calendar grid fills **100% of the remaining viewport height**. Each hour slot takes an equal share of that height (`flex: 1`) — no scrolling, no gap at the bottom.

---

## Calendar Views

| View | Days Shown | Default |
|---|---|---|
| **Work Week** | Monday – Friday | Yes |
| **Week** | Monday – Sunday | No |
| **Day** | Single selected day | No |

Switch views using the center buttons in the calendar sub-header. Weekends are visually distinguished with a light background.

---

## Time Slot Range

Control how many hours are visible in the grid:

| Option | Hours | Slots |
|---|---|---|
| Work Hours (9–5) | 9 am – 5 pm | 8 |
| **Extended (8–6)** ← default | 8 am – 6 pm | 10 |
| Full Day (6am–10pm) | 6 am – 10 pm | 16 |

Setting is persisted in localStorage and restored on next visit.

---

## Appearance & Settings

Access via the **⚙️ Settings** button at the bottom of the To-Do sidebar.

### Light / Dark Mode

Toggle between light and dark themes. The selection is saved automatically.

- **Light mode** — white surfaces, dark text, blue accent
- **Dark mode** — dark grey surfaces, light text, lighter blue accent

Theming is implemented via CSS custom properties on `[data-theme="dark"]` applied to `<html>`. All colors reference `var(--color-*)` variables — no hardcoded colors in component CSS.

---

## Analytics

The analytics panel is accessed via **📊 Analytics** in the sidebar bottom section.

### Timeline View (default)

A heat-map grid where:
- **Rows** = active projects in the date range
- **Columns** = each day in the range
- **Cells** = hours logged (shown as `Nh`), colored by project category with opacity scaled to intensity

### Bar Chart View

Stacked vertical bars where:
- **Each bar** = one day
- **Each segment** = one project
- **Height** = hours logged that day for that project
- **Legend** shows all active projects

### Date Range

Default: last 7 days. Adjustable with From / To date inputs.

---

## Export to Excel

Uses **SheetJS (`xlsx`)** to generate the spreadsheet entirely in the browser — no server call. The file is assembled from filtered `TimeEntry` records, joined with project and category names, and downloaded as a `.xlsx` binary.

---

## Data Storage

All data lives in the browser's `localStorage` under five keys:

| Key | Type | Contents |
|---|---|---|
| `tct_entries` | `TimeEntry[]` | All time log entries |
| `tct_projects` | `Project[]` | Project definitions |
| `tct_categories` | `CategoryDef[]` | Category definitions with colors |
| `tct_todos` | `TodoItem[]` | To-Do task list |
| `tct_settings` | `AppSettings` | Theme + time range preference |

All values are JSON-serialized. Reads occur on mount; writes occur on every mutation.

**Backup:** Use the Excel export regularly. Clearing browser site data will permanently erase everything.

**Migration:** `storageService.ts` includes a `migrateIfNeeded()` function called on app startup to handle schema changes between versions (e.g., adding new fields with default values).

---

## Key Concepts & Glossary

| Term | Definition |
|---|---|
| **Category** | A named grouping with a hex color (e.g., "Client Work" → blue). The top-level organizational unit. |
| **Project** | Belongs to one category. Inherits the category's color. An entry can belong to multiple projects. |
| **Time Entry** | One logged hour: a date, a start hour, a description, and optional project assignment(s). Always exactly 1 hour in duration. |
| **Slot** | One hour cell in the calendar grid. Multiple entries in the same slot stack vertically. |
| **To-Do** | A pending task in the sidebar. Can be dragged to a calendar slot to schedule it. Scheduling converts it to a Time Entry and removes it from the To-Do list. |
| **View Mode** | The current calendar layout — Work Week, Week, or Day. |
| **Time Range** | Which hours are rendered in the grid — Work (9–5), Extended (8–6), or Full Day (6am–10pm). |
| **Theme** | Light or dark color mode, toggled from the Settings popup in the sidebar. |

---

## Component Reference

### `App.tsx`

Root component. Calls `migrateIfNeeded()` on startup, instantiates all five hooks, handles project deletion (scrubs deleted project IDs from entries), and renders `CalendarShell` with all props wired.

---

### `CalendarShell`

The primary orchestrator. Owns:

- `appView` — `'calendar'` or `'analytics'`
- `viewMode` — current calendar view
- `anchorDate` — the reference date for week/day navigation
- `entryModalState` — controls the add/edit entry modal
- `dropPending` — holds a pending todo drop until the ConfirmDropModal resolves
- `projectModalOpen`, `exportModalOpen` — modal visibility flags

Renders: `Toolbar`, `CalendarSubHeader`, `TodoSidebar`, `WeekView`/`DailyView`/`AnalyticsPanel`, and all modals.

---

### `CalendarSubHeader`

Three-column bar rendered inside the calendar area, above the grid:

- **Left:** Time range `<select>` dropdown
- **Center:** Week / Work Week / Day toggle buttons
- **Right:** Export to Excel button (green, with XLS icon)

Only visible when `appView === 'calendar'`.

---

### `Toolbar`

Top navigation bar. Contains: Today, ‹ (prev), › (next), date range label, **+ Task**, **+ Projects**. Simplified to navigation and quick-add only — all other controls live in the subheader or sidebar.

---

### `TimeGrid`

The core grid component. Receives `days[]` and `hourSlots[]` and renders:

- A sticky **header row** with day name + date number for each day
- A **body** with one day column per day, each containing:
  - **Slot rows** (one per hour) — each is `flex: 1` to fill available height proportionally
  - **SlotStrip** components for single-hour entries, stacked vertically in each slot
  - **TimeEntryBlock** components absolutely positioned for multi-hour entries (legacy)

**`assignColumnLayout()`** — greedy algorithm that assigns a column index to each multi-hour entry to avoid visual overlap. Entries are sorted by start hour; each gets the leftmost available column whose previous entry has already ended.

---

### `TimeEntryBlock`

Absolutely positioned block for multi-hour entries. Position is percentage-based relative to the day column:

```
top    = (startHour - firstHour) / totalSlots * 100%
height = (endHour - startHour)   / totalSlots * 100%
```

Supports drag-and-drop. Tiled side-by-side when entries overlap via `column` / `totalColumns` props.

---

### `TodoSidebar`

Left panel with three sections:

1. **Header** — title, task count badge (hidden when collapsed), Clear all, collapse toggle
2. **Add form + task list** — hidden when collapsed
3. **Bottom section** — Analytics button + Settings popup (theme toggle); icon-only when collapsed

---

### `EntryModal`

Add/edit form rendered as a React Portal into `document.body`. Fields: Hour (single select), Description, Projects (checkboxes). Always saves with `endHour = startHour + 1`. Edit mode adds Duplicate and Delete actions.

---

### `ConfirmDropModal`

Appears when a To-Do task is dropped onto a calendar slot. Pre-fills description from the task title. Lets the user adjust the hour and assign projects before confirming. On confirm: creates the entry, deletes the todo.

---

### `AnalyticsPanel`

Hosts date range controls and tab switcher. Filters entries to the selected range, then passes them to either `BarChart` or `Timeline`.

**`Timeline`** — table-like grid. Rows = projects with activity, columns = each day in range. Active cells show hour count and color intensity.

**`BarChart`** — vertically scrollable chart with one stacked bar per day, segmented by project.

---

## State & Data Flow

```
App.tsx
  │
  ├── useTimeEntries()  → entries[], addEntry, updateEntry, deleteEntry
  ├── useProjects()     → projects[], addProject, deleteProject
  ├── useCategories()   → categories[], addCategory, deleteCategory
  ├── useSettings()     → settings, setTheme, setTimeRange
  └── useTodos()        → todos[], addTodo, updateTodo, deleteTodo, ...
  │
  └── <CalendarShell ...all props>
        │
        ├── <Toolbar />                  ← navigation only, no local state
        ├── <CalendarSubHeader />        ← view + time range controls
        ├── <TodoSidebar />              ← local state: collapsed, editing, settingsOpen
        │
        └── <WeekView /> / <DailyView />
              └── <TimeGrid />
                    ├── <SlotStrip />    ← local drag state only
                    └── <TimeEntryBlock />
```

Data flows **top-down** as props. Mutations flow **up** as callbacks. No context or global store is used.

---

## Styling System

All CSS is co-located with its component (`ComponentName.css` next to `ComponentName.tsx`).

Global variables are defined in `App.css` under `:root` (light) and `[data-theme="dark"]`:

```css
:root {
  --color-accent:          #4285F4;
  --color-accent-hover:    #2b6fd4;
  --color-bg:              #ffffff;
  --color-surface:         #f8f9fa;
  --color-hover:           #f1f3f4;
  --color-border:          #e0e0e0;
  --color-border-light:    #f0f0f0;
  --color-text-primary:    #202124;
  --color-text-secondary:  #5f6368;
  --color-danger:          #d32f2f;
  --color-drag-over:       rgba(66, 133, 244, 0.12);
  --color-sidebar-bg:      #f8f9fa;
  --color-todo-bg:         #ffffff;
  --color-todo-hover:      #f1f3f4;
  --color-weekend-bg:      #fafafa;
}
```

Dark mode overrides all of the above via `[data-theme="dark"]` on `<html>`. Applied in `useSettings.ts` via `document.documentElement.setAttribute('data-theme', theme)`.

---

## Notes & Limitations

| Limitation | Detail |
|---|---|
| **No sync** | Data lives only in the browser that created it. No cloud, no server. |
| **No multi-user** | Single-user, single-browser. |
| **1-hour granularity** | Entries are tracked in whole hours. No half-hours or minutes. |
| **No offline PWA** | No service worker — requires a live dev server or static hosting. |
| **Network IP isolation** | `localhost:5173` and `192.168.x.x:5173` are different origins → separate localStorage. Data does not cross between them. |
| **Browser storage limits** | `localStorage` is typically capped at 5–10 MB per origin. Unlikely to be reached for time tracking data. |
| **No undo** | Deletions are permanent. Export regularly as backup. |

---

## Security

- **No secrets in the codebase.** No API keys, tokens, or credentials are stored anywhere in the source.
- **`.claude/` is gitignored.** Local Claude Code tool configuration is excluded from version control.
- **`.env` files are gitignored.** Any local environment variables are excluded by default.
- **No external network calls.** The app makes zero HTTP requests at runtime. All data stays in the browser.
- **No user authentication.** This is a single-user local tool — no login, no session tokens, no passwords.
- **XSS surface is minimal.** All user input is rendered via React's default escaping. No `dangerouslySetInnerHTML` is used anywhere.

---

## License

Private / Internal use. Not published.
