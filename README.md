# TimeCardTracker

A lightweight, browser-based time tracking application for logging work hours across multiple projects and categories. No backend, no account required — everything lives in your browser.

---

## What Is This?

TimeCardTracker is a personal time tracking tool built with React and TypeScript. It lets you:

- Log work hours on a visual calendar grid (daily or weekly views)
- Organize time entries by **project** and **category**, each with a custom color
- Analyze your time with built-in charts and timelines
- Export your time log to **Excel (.xlsx)** for reporting or invoicing

All data is stored in **browser localStorage** — nothing is sent to any server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Persistence | Browser localStorage |
| Export | XLSX (Excel files) |
| Styling | CSS with custom properties |

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

1. Click the **Projects** button in the toolbar.
2. Add a **Category** (e.g., "Client Work", "Internal") and pick a color.
3. Add a **Project** under that category (e.g., "Website Redesign").

Categories are color-coded — their color carries through to all entries in that project.

> **Default seed categories**: Quattro, RAM/IbexIQ, Multi-company, Personal

---

### 2. Log Time

**Click any hour slot** on the calendar to open the entry form:

- Select the **date**, **start time**, and **end time** (7am–7pm range)
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

### 5. Analytics

Click the **Analytics** button to open the analytics panel:

- **Bar Chart** — hours breakdown by project or category
- **Timeline** — visual timeline of activity
- Filter by a custom **date range** (default: last 4 weeks)

---

### 6. Export to Excel

Click the **Export** button:

1. Choose a **start date** and **end date**
2. Review the entry count shown
3. Click **Export** — downloads a `.xlsx` file

The Excel file includes: Date, Start Time, End Time, Duration, Description, Projects, Category.

Filename format: `timecard-YYYY-MM-DD-to-YYYY-MM-DD.xlsx`

---

## Calendar Views

| View | Description |
|---|---|
| **Work Week** (default) | Monday through Friday |
| **Full Week** | Monday through Sunday |
| **Daily** | Single day, full focus |

Time grid shows hours from **8am to 6pm**.

---

## Data Storage

All data is stored in `localStorage` under these keys:

| Key | Contents |
|---|---|
| `tct_entries` | All time entries |
| `tct_projects` | All projects |
| `tct_categories` | All categories |

**Clearing browser data will erase all entries.** Export to Excel regularly if you need a backup.

---

## Project Structure

```
src/
├── models/           # TypeScript types (TimeEntry, Project, CategoryDef)
├── services/         # localStorage read/write + data migration
├── hooks/            # useTimeEntries, useProjects, useCategories
├── utils/            # Date helpers, color utilities, UUID generation
└── components/
    ├── Calendar/     # Main shell and state orchestration
    ├── TimeGrid/     # Visual hour grid
    ├── Toolbar/      # Navigation and view controls
    ├── EntryModal/   # Add/edit time entry
    ├── ProjectModal/ # Manage projects and categories
    ├── ExportModal/  # Excel export with date range picker
    └── Analytics/    # Bar chart and timeline views
```

---

## Key Concepts

- **Category** — A grouping with a name and color (e.g., "Client Work" in blue)
- **Project** — Belongs to a category (e.g., "Website Redesign" under "Client Work")
- **Time Entry** — A logged block of time: date + start/end hour + description + project(s)
- **Multi-project entries** — An entry can belong to multiple projects; it displays in a mixed/neutral color

---

## Notes & Limitations

- **No sync** — data lives only in your browser. Use export for backups.
- **Single user** — no multi-user or sharing support.
- **Hour granularity** — entries are tracked in whole hours (no minute-level precision).
- **Time range** — the grid displays 8am–6pm; entries can be entered from 7am–7pm.

---

## License

Private / Internal use. Not published.
