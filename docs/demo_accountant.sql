-- ============================================================
-- TimeCardTracker — Demo Data: Accountant / Bookkeeper
-- ============================================================
-- Scenario:
--   An independent accountant managing billable hours across
--   3 clients. Categories represent the main service types
--   offered. Projects map to individual client engagements.
--
-- Usage:
--   Run database.sql first, then run this file:
--   mysql -u root -p timecardtracker < docs/demo_accountant.sql
--
-- Week covered: 2026-04-07 (Mon) – 2026-04-11 (Fri)
-- ============================================================

USE timecardtracker;

-- ─── Clear previous demo data (safe re-run) ──────────────────
DELETE FROM entry_projects WHERE entry_id LIKE 'acct-%';
DELETE FROM time_entries    WHERE id       LIKE 'acct-%';
DELETE FROM todo_projects   WHERE todo_id  LIKE 'acct-todo-%';
DELETE FROM todos           WHERE id       LIKE 'acct-todo-%';
DELETE FROM projects        WHERE id       LIKE 'acct-%';
DELETE FROM categories      WHERE id       LIKE 'acct-%';

-- ─── Categories — Accounting Service Types ───────────────────
INSERT INTO categories (id, name, color, weekly_hours) VALUES
  ('acct-cat-bk',   'Bookkeeping',       '#10B981', 15.00),
  ('acct-cat-tax',  'Tax Preparation',   '#3B82F6', 10.00),
  ('acct-cat-rep',  'Financial Reports', '#F59E0B',  8.00),
  ('acct-cat-meet', 'Client Meetings',   '#8B5CF6',  5.00),
  ('acct-cat-adm',  'Administration',    '#64748B',  2.00);

-- ─── Projects — 3 Client Engagements ─────────────────────────
INSERT INTO projects (id, name, color, category_id) VALUES
  -- Small business retail client
  ('acct-proj-maple',   'Maple Grove Bakery',        NULL, 'acct-cat-bk'),
  -- Mid-size real estate company
  ('acct-proj-sunrise', 'Sunrise Real Estate Group', NULL, 'acct-cat-bk'),
  -- Early-stage tech startup
  ('acct-proj-techflow','TechFlow Startup Inc.',      NULL, 'acct-cat-bk');

-- ─── Todos ───────────────────────────────────────────────────
INSERT INTO todos (id, text, done, sort_order) VALUES
  ('acct-todo-01', 'Maple Grove: reconcile March bank statements',       FALSE, 1),
  ('acct-todo-02', 'Sunrise RE: Q1 depreciation schedule',               FALSE, 2),
  ('acct-todo-03', 'TechFlow: set up payroll integration',               FALSE, 3),
  ('acct-todo-04', 'File quarterly estimated tax — all clients',         FALSE, 4),
  ('acct-todo-05', 'Sunrise RE: prepare investor summary report',        FALSE, 5),
  ('acct-todo-06', 'TechFlow: review Series A expenses for due diligence',FALSE, 6);

INSERT INTO todo_projects (todo_id, project_id) VALUES
  ('acct-todo-01', 'acct-proj-maple'),
  ('acct-todo-02', 'acct-proj-sunrise'),
  ('acct-todo-03', 'acct-proj-techflow'),
  ('acct-todo-04', 'acct-proj-maple'),
  ('acct-todo-04', 'acct-proj-sunrise'),
  ('acct-todo-04', 'acct-proj-techflow'),
  ('acct-todo-05', 'acct-proj-sunrise'),
  ('acct-todo-06', 'acct-proj-techflow');

-- ─── Time Entries — Monday 2026-04-07 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('acct-e-0407-01', '2026-04-07',  8,  9, 'Weekly schedule and deadline review'),
  ('acct-e-0407-02', '2026-04-07',  9, 10, 'Maple Grove: enter March invoices into QuickBooks'),
  ('acct-e-0407-03', '2026-04-07', 10, 11, 'Maple Grove: categorize March expenses'),
  ('acct-e-0407-04', '2026-04-07', 11, 12, 'Sunrise RE: bank reconciliation — March'),
  ('acct-e-0407-05', '2026-04-07', 12, 13, 'Lunch'),
  ('acct-e-0407-06', '2026-04-07', 13, 14, 'Sunrise RE: rental income journal entries'),
  ('acct-e-0407-07', '2026-04-07', 14, 15, 'TechFlow: set up chart of accounts'),
  ('acct-e-0407-08', '2026-04-07', 15, 16, 'TechFlow: import February bank transactions');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('acct-e-0407-01', 'acct-proj-maple'),
  ('acct-e-0407-01', 'acct-proj-sunrise'),
  ('acct-e-0407-01', 'acct-proj-techflow'),
  ('acct-e-0407-02', 'acct-proj-maple'),
  ('acct-e-0407-03', 'acct-proj-maple'),
  ('acct-e-0407-04', 'acct-proj-sunrise'),
  ('acct-e-0407-06', 'acct-proj-sunrise'),
  ('acct-e-0407-07', 'acct-proj-techflow'),
  ('acct-e-0407-08', 'acct-proj-techflow');

-- ─── Time Entries — Tuesday 2026-04-08 ───────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('acct-e-0408-01', '2026-04-08',  9, 10, 'TechFlow: Q1 tax review — deductible expenses'),
  ('acct-e-0408-02', '2026-04-08', 10, 11, 'TechFlow: R&D credit eligibility analysis'),
  ('acct-e-0408-03', '2026-04-08', 11, 12, 'Maple Grove: prepare profit & loss — Q1'),
  ('acct-e-0408-04', '2026-04-08', 12, 13, 'Lunch'),
  ('acct-e-0408-05', '2026-04-08', 13, 14, 'Maple Grove: review with owner — Q1 P&L call'),
  ('acct-e-0408-06', '2026-04-08', 14, 15, 'Sunrise RE: depreciation schedule update'),
  ('acct-e-0408-07', '2026-04-08', 15, 16, 'Sunrise RE: property management fee accruals'),
  ('acct-e-0408-08', '2026-04-08', 16, 17, 'Admin: update client billing tracker');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('acct-e-0408-01', 'acct-proj-techflow'),
  ('acct-e-0408-02', 'acct-proj-techflow'),
  ('acct-e-0408-03', 'acct-proj-maple'),
  ('acct-e-0408-05', 'acct-proj-maple'),
  ('acct-e-0408-06', 'acct-proj-sunrise'),
  ('acct-e-0408-07', 'acct-proj-sunrise'),
  ('acct-e-0408-08', 'acct-proj-maple'),
  ('acct-e-0408-08', 'acct-proj-sunrise'),
  ('acct-e-0408-08', 'acct-proj-techflow');

-- ─── Time Entries — Wednesday 2026-04-09 ─────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('acct-e-0409-01', '2026-04-09',  8,  9, 'Email responses and deadline check'),
  ('acct-e-0409-02', '2026-04-09',  9, 10, 'Maple Grove: payroll run — bi-weekly'),
  ('acct-e-0409-03', '2026-04-09', 10, 11, 'Maple Grove: sales tax filing — March'),
  ('acct-e-0409-04', '2026-04-09', 11, 12, 'Sunrise RE: investor report — income summary'),
  ('acct-e-0409-05', '2026-04-09', 12, 13, 'Lunch'),
  ('acct-e-0409-06', '2026-04-09', 13, 14, 'Sunrise RE: investor report — cash flow analysis'),
  ('acct-e-0409-07', '2026-04-09', 14, 15, 'TechFlow: catch-up bookkeeping — March'),
  ('acct-e-0409-08', '2026-04-09', 15, 16, 'TechFlow: payroll review — March headcount');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('acct-e-0409-01', 'acct-proj-maple'),
  ('acct-e-0409-02', 'acct-proj-maple'),
  ('acct-e-0409-03', 'acct-proj-maple'),
  ('acct-e-0409-04', 'acct-proj-sunrise'),
  ('acct-e-0409-06', 'acct-proj-sunrise'),
  ('acct-e-0409-07', 'acct-proj-techflow'),
  ('acct-e-0409-08', 'acct-proj-techflow');

-- ─── Time Entries — Thursday 2026-04-10 ──────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('acct-e-0410-01', '2026-04-10',  8,  9, 'Sunrise RE: quarterly meeting prep'),
  ('acct-e-0410-02', '2026-04-10',  9, 10, 'Sunrise RE: quarterly review meeting with CFO'),
  ('acct-e-0410-03', '2026-04-10', 10, 11, 'TechFlow: due diligence — Series A expense review'),
  ('acct-e-0410-04', '2026-04-10', 11, 12, 'TechFlow: due diligence — cap table reconciliation'),
  ('acct-e-0410-05', '2026-04-10', 12, 13, 'Lunch'),
  ('acct-e-0410-06', '2026-04-10', 13, 14, 'Maple Grove: vendor payment schedule'),
  ('acct-e-0410-07', '2026-04-10', 14, 15, 'Maple Grove: annual insurance premium accrual'),
  ('acct-e-0410-08', '2026-04-10', 15, 16, 'Admin: file Q1 estimated taxes — all clients');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('acct-e-0410-01', 'acct-proj-sunrise'),
  ('acct-e-0410-02', 'acct-proj-sunrise'),
  ('acct-e-0410-03', 'acct-proj-techflow'),
  ('acct-e-0410-04', 'acct-proj-techflow'),
  ('acct-e-0410-06', 'acct-proj-maple'),
  ('acct-e-0410-07', 'acct-proj-maple'),
  ('acct-e-0410-08', 'acct-proj-maple'),
  ('acct-e-0410-08', 'acct-proj-sunrise'),
  ('acct-e-0410-08', 'acct-proj-techflow');

-- ─── Time Entries — Friday 2026-04-11 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('acct-e-0411-01', '2026-04-11',  9, 10, 'TechFlow: onboarding call — new CFO intro'),
  ('acct-e-0411-02', '2026-04-11', 10, 11, 'TechFlow: chart of accounts walkthrough'),
  ('acct-e-0411-03', '2026-04-11', 11, 12, 'Maple Grove: year-to-date review notes'),
  ('acct-e-0411-04', '2026-04-11', 12, 13, 'Lunch'),
  ('acct-e-0411-05', '2026-04-11', 13, 14, 'Sunrise RE: finalize Q1 investor report'),
  ('acct-e-0411-06', '2026-04-11', 14, 15, 'Admin: update engagement letters for all clients'),
  ('acct-e-0411-07', '2026-04-11', 15, 16, 'Admin: send April invoices');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('acct-e-0411-01', 'acct-proj-techflow'),
  ('acct-e-0411-02', 'acct-proj-techflow'),
  ('acct-e-0411-03', 'acct-proj-maple'),
  ('acct-e-0411-05', 'acct-proj-sunrise'),
  ('acct-e-0411-06', 'acct-proj-maple'),
  ('acct-e-0411-06', 'acct-proj-sunrise'),
  ('acct-e-0411-06', 'acct-proj-techflow'),
  ('acct-e-0411-07', 'acct-proj-maple'),
  ('acct-e-0411-07', 'acct-proj-sunrise'),
  ('acct-e-0411-07', 'acct-proj-techflow');
