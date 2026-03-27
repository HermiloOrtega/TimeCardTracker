# TimeCardTracker

A lightweight, browser-based time tracking application for logging work hours across multiple projects and categories. No backend, no account required — everything lives in your browser.

---

## What Is This?

TimeCardTracker is a personal time tracking tool built with React and TypeScript. It lets you:

- Log work hours on a visual calendar grid (daily or weekly views)
- Organize time entries by **project** and **category**, each with a custom color
- Plan upcoming work with a **To-Do sidebar** and drag tasks directly onto the calendar
- Analyze your time with built-in charts and timelines
- Export your time log to **Excel (.xlsx)** for reporting or invoicing
- Switch between **light and dark mode**, saved automatically
- Choose the **time slot range** that fits your day (Work Hours, Extended, or Full Day)

All data is stored in **browser localStorage** — nothing is sent to any server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Persistence | Browser localStorage |
| Export | XLSX (Excel files) |
| Styling | CSS with custom properties (light + dark themes) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd TimeCardTracker

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

> The app is also accessible from other devices on your local network via your machine's IP address (e.g., `http://192.168.x.x:5173`).

### Building for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Preview the build with:

```bash
npm run preview
```

---

## How to Use

### 1. Set Up Categories and Projects

Before logging time, create your **categories** and **projects**:

1. Click the **+ Projects** button in the toolbar.
2. Add a **Category** (e.g., "Client Work", "Internal") and pick a color.
3. Add a **Project** under that category (e.g., "Website Redesign").

Categories are color-coded — their color carries through to all entries in that project.

> **Default seed categories**: Quattro, RAM/IbexIQ, Multi-company, Personal

---

### 2. Log Time

**Click any hour slot** on the calendar to open the entry form:

- Select the **date**, **start time**, and **end time**
- Add a **description** of the work
- Assign one or more **projects**
- Save

Entries appear as color-coded blocks on the grid. Multi-hour entries span across rows.

---

### 3. Edit or Delete Entries

- **Click an existing entry block** to open the edit modal
- Change any field and save, or click **Delete** to remove it

---

### 4. Navigate the Calendar

Use the toolbar controls:

| Control | Action |
|---|---|
| **Today** | Jump to the current date |
| **< / >** | Move backward/forward by day or week |
| **View selector** | Switch between Work Week (Mon–Fri), Full Week (Mon–Sun), or Daily view |

The current day is highlighted. Weekends are visually distinguished in week views.

---

### 5. To-Do Sidebar

The **To-Do panel** on the left side of the screen is a bucket list for tasks you plan to work on.

**Adding tasks:**
- Type a task title in the input field and press **Enter** or click **+**
- Click **≡** to expand an optional note field before adding

**Managing tasks:**
- Click **✏️** to edit a task's title or note inline
- Click **🗑** to delete a single task
- Click **Clear all** (appears in the header when tasks exist) to wipe the entire list — confirms before deleting

---

### 6. Drag Tasks from To-Do to Calendar

Tasks in the To-Do sidebar can be **dragged and dropped** directly onto any calendar time slot.

1. Grab a task by its drag handle (**⠿**) or anywhere on the card
2. Drop it onto the target hour slot on the calendar
3. A **confirmation dialog** appears — review or adjust:
   - Description (pre-filled from the task title)
   - Start and end time
   - Optional project assignment
4. Click **Add to Calendar** to create the time entry

> The task is automatically **removed from the To-Do list** once confirmed.
> Clicking **Cancel** leaves both the task and the calendar slot unchanged.

You can still **click any slot directly** to add entries without using the To-Do list.

---

### 7. Analytics

Click the **Analytics** button to open the analytics panel:

- **Bar Chart** — hours breakdown by project or category
- **Timeline** — visual timeline of activity
- Filter by a custom **date range** (default: last 4 weeks)

---

### 8. Export to Excel

Click the **Export** button:

1. Choose a **start date** and **end date**
2. Review the entry count shown
3. Click **Export** — downloads a `.xlsx` file

The Excel file includes: Date, Start Time, End Time, Duration, Description, Projects, Category.

Filename format: `timecard-YYYY-MM-DD-to-YYYY-MM-DD.xlsx`

---

## Appearance & Display Settings

All preferences are saved automatically and restored on your next visit.

### Light / Dark Mode

Click the **🌙 / ☀️** button in the toolbar (top right) to toggle between light and dark mode.

### Time Slot Range

Use the **dropdown in the toolbar** to control which hours are shown in the calendar grid:

| Option | Hours Displayed |
|---|---|
| Work Hours (9–5) | 9 am to 5 pm |
| **Extended (8–6)** ← default | 8 am to 6 pm |
| Full Day (6am–10pm) | 6 am to 10 pm |

---

## Calendar Views

| View | Description |
|---|---|
| **Work Week** (default) | Monday through Friday |
| **Full Week** | Monday through Sunday |
| **Daily** | Single day, full focus |

---

## Data Storage

All data is stored in `localStorage` under these keys:

| Key | Contents |
|---|---|
| `tct_entries` | All time entries |
| `tct_projects` | All projects |
| `tct_categories` | All categories |
| `tct_todos` | To-Do task list |
| `tct_settings` | Theme and time range preferences |

**Clearing browser data will erase everything.** Export to Excel regularly if you need a backup.

---

## Project Structure

```
src/
├── models/              # TypeScript types (TimeEntry, Project, CategoryDef, TodoItem, AppSettings)
├── services/            # localStorage read/write + data migration
├── hooks/               # useTimeEntries, useProjects, useCategories, useSettings, useTodos
├── utils/               # Date helpers, color utilities, UUID generation
└── components/
    ├── Calendar/         # Main shell — layout, state, drag-drop orchestration
    ├── TimeGrid/         # Visual hour grid with drag-over support
    ├── Toolbar/          # Navigation, view controls, theme toggle, time range selector
    ├── TodoSidebar/      # To-Do panel with add, edit, delete, clear all, drag
    ├── ConfirmDropModal/ # Confirmation dialog when dropping a task onto the calendar
    ├── EntryModal/       # Add/edit time entry
    ├── ProjectModal/     # Manage projects and categories
    ├── ExportModal/      # Excel export with date range picker
    ├── TimeEntryBlock/   # Absolutely-positioned multi-hour entry blocks
    ├── WeekView/         # Week view wrapper
    ├── DailyView/        # Daily view wrapper
    └── Analytics/        # Bar chart and timeline views
```

---

## Key Concepts

- **Category** — A grouping with a name and color (e.g., "Client Work" in blue)
- **Project** — Belongs to a category (e.g., "Website Redesign" under "Client Work")
- **Time Entry** — A logged block of time: date + start/end hour + description + project(s)
- **Multi-project entries** — An entry can belong to multiple projects; it displays in a mixed/neutral color
- **To-Do** — A task list used for planning; tasks can be dragged to the calendar to schedule them

---

## Notes & Limitations

- **No sync** — data lives only in your browser. Use export for backups.
- **Single user** — no multi-user or sharing support.
- **Hour granularity** — entries are tracked in whole hours (no minute-level precision).
- **Network IP access** — opening the app via a local network IP works, but each browser origin stores its own localStorage; data entered on one device is not visible on another.

---

## License

Private / Internal use. Not published.
