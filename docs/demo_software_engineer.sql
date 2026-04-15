-- ============================================================
-- TimeCardTracker — Demo Data: Full-Stack Software Engineer
-- ============================================================
-- Scenario:
--   A full-stack software engineer working across 5 active
--   software projects. Categories represent phases of the
--   Software Development Lifecycle (SDLC).
--
-- Usage:
--   Run database.sql first, then run this file:
--   mysql -u root -p timecardtracker < docs/demo_software_engineer.sql
--
-- Week covered: 2026-04-07 (Mon) – 2026-04-11 (Fri)
-- ============================================================

USE timecardtracker;

-- ─── Clear previous demo data (safe re-run) ──────────────────
DELETE FROM entry_projects WHERE entry_id LIKE 'swe-%';
DELETE FROM time_entries    WHERE id       LIKE 'swe-%';
DELETE FROM todo_projects   WHERE todo_id  LIKE 'swe-todo-%';
DELETE FROM todos           WHERE id       LIKE 'swe-todo-%';
DELETE FROM projects        WHERE id       LIKE 'swe-%';
DELETE FROM categories      WHERE id       LIKE 'swe-%';

-- ─── Categories — SDLC Phases ────────────────────────────────
INSERT INTO categories (id, name, color, weekly_hours) VALUES
  ('swe-cat-plan',   'Planning & Architecture', '#6366F1', 10.00),
  ('swe-cat-dev',    'Development',             '#10B981', 20.00),
  ('swe-cat-devops', 'DevOps & Infrastructure', '#F59E0B', 10.00),
  ('swe-cat-qa',     'QA & Testing',            '#3B82F6',  5.00),
  ('swe-cat-admin',  'Meetings & Admin',        '#64748B',  5.00);

-- ─── Projects — 5 Active Software Projects ───────────────────
INSERT INTO projects (id, name, color, category_id) VALUES
  -- E-Commerce Platform Rebuild (main product)
  ('swe-proj-ecom',    'E-Commerce Platform',    NULL, 'swe-cat-dev'),
  -- REST API for a customer-facing portal
  ('swe-proj-api',     'Customer Portal API',    NULL, 'swe-cat-dev'),
  -- CI/CD pipeline and cloud infrastructure
  ('swe-proj-cicd',    'CI/CD & Cloud Infra',    NULL, 'swe-cat-devops'),
  -- Native mobile app MVP
  ('swe-proj-mobile',  'Mobile App MVP',         NULL, 'swe-cat-dev'),
  -- Internal analytics dashboard
  ('swe-proj-dash',    'Analytics Dashboard',    NULL, 'swe-cat-dev');

-- ─── Todos ───────────────────────────────────────────────────
INSERT INTO todos (id, text, done, sort_order) VALUES
  ('swe-todo-01', 'Write unit tests for auth module',          FALSE, 1),
  ('swe-todo-02', 'Set up staging environment on AWS',         FALSE, 2),
  ('swe-todo-03', 'Code review — mobile onboarding PR',        FALSE, 3),
  ('swe-todo-04', 'Update API documentation (Swagger)',        FALSE, 4),
  ('swe-todo-05', 'Refactor cart state management',            FALSE, 5),
  ('swe-todo-06', 'Fix dashboard chart rendering on Safari',   FALSE, 6);

INSERT INTO todo_projects (todo_id, project_id) VALUES
  ('swe-todo-01', 'swe-proj-api'),
  ('swe-todo-02', 'swe-proj-cicd'),
  ('swe-todo-03', 'swe-proj-mobile'),
  ('swe-todo-04', 'swe-proj-api'),
  ('swe-todo-05', 'swe-proj-ecom'),
  ('swe-todo-06', 'swe-proj-dash');

-- ─── Time Entries — Monday 2026-04-07 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('swe-e-0407-01', '2026-04-07',  8,  9, 'Sprint planning — story point estimation'),
  ('swe-e-0407-02', '2026-04-07',  9, 10, 'E-Commerce: product listing page — React components'),
  ('swe-e-0407-03', '2026-04-07', 10, 11, 'E-Commerce: product listing page — filter logic'),
  ('swe-e-0407-04', '2026-04-07', 11, 12, 'Customer Portal API: JWT auth endpoint'),
  ('swe-e-0407-05', '2026-04-07', 12, 13, 'Lunch'),
  ('swe-e-0407-06', '2026-04-07', 13, 14, 'Customer Portal API: role-based middleware'),
  ('swe-e-0407-07', '2026-04-07', 14, 15, 'CI/CD: GitHub Actions workflow for staging'),
  ('swe-e-0407-08', '2026-04-07', 15, 16, 'Team standup + PR reviews');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('swe-e-0407-01', 'swe-proj-ecom'),
  ('swe-e-0407-02', 'swe-proj-ecom'),
  ('swe-e-0407-03', 'swe-proj-ecom'),
  ('swe-e-0407-04', 'swe-proj-api'),
  ('swe-e-0407-06', 'swe-proj-api'),
  ('swe-e-0407-07', 'swe-proj-cicd'),
  ('swe-e-0407-08', 'swe-proj-ecom'),
  ('swe-e-0407-08', 'swe-proj-api');

-- ─── Time Entries — Tuesday 2026-04-08 ───────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('swe-e-0408-01', '2026-04-08',  8,  9, 'Architecture review: mobile app data sync strategy'),
  ('swe-e-0408-02', '2026-04-08',  9, 10, 'Mobile App: onboarding flow — screen 1 & 2'),
  ('swe-e-0408-03', '2026-04-08', 10, 11, 'Mobile App: local SQLite schema design'),
  ('swe-e-0408-04', '2026-04-08', 11, 12, 'E-Commerce: shopping cart — add/remove items'),
  ('swe-e-0408-05', '2026-04-08', 12, 13, 'Lunch'),
  ('swe-e-0408-06', '2026-04-08', 13, 14, 'E-Commerce: cart persistence with Redux'),
  ('swe-e-0408-07', '2026-04-08', 14, 15, 'Analytics Dashboard: KPI tile components'),
  ('swe-e-0408-08', '2026-04-08', 15, 16, 'QA: write integration tests for cart API'),
  ('swe-e-0408-09', '2026-04-08', 16, 17, 'CI/CD: Docker image build optimization');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('swe-e-0408-01', 'swe-proj-mobile'),
  ('swe-e-0408-02', 'swe-proj-mobile'),
  ('swe-e-0408-03', 'swe-proj-mobile'),
  ('swe-e-0408-04', 'swe-proj-ecom'),
  ('swe-e-0408-06', 'swe-proj-ecom'),
  ('swe-e-0408-07', 'swe-proj-dash'),
  ('swe-e-0408-08', 'swe-proj-ecom'),
  ('swe-e-0408-09', 'swe-proj-cicd');

-- ─── Time Entries — Wednesday 2026-04-09 ─────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('swe-e-0409-01', '2026-04-09',  8,  9, 'Daily standup + email triage'),
  ('swe-e-0409-02', '2026-04-09',  9, 10, 'Customer Portal API: Swagger docs update'),
  ('swe-e-0409-03', '2026-04-09', 10, 11, 'Customer Portal API: rate limiting middleware'),
  ('swe-e-0409-04', '2026-04-09', 11, 12, 'Analytics Dashboard: bar chart with D3.js'),
  ('swe-e-0409-05', '2026-04-09', 12, 13, 'Lunch'),
  ('swe-e-0409-06', '2026-04-09', 13, 14, 'Analytics Dashboard: date range filter'),
  ('swe-e-0409-07', '2026-04-09', 14, 15, 'Mobile App: push notification integration'),
  ('swe-e-0409-08', '2026-04-09', 15, 16, 'E-Commerce: checkout flow — step 1 UI'),
  ('swe-e-0409-09', '2026-04-09', 16, 17, 'Code review: team PRs');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('swe-e-0409-01', 'swe-proj-ecom'),
  ('swe-e-0409-02', 'swe-proj-api'),
  ('swe-e-0409-03', 'swe-proj-api'),
  ('swe-e-0409-04', 'swe-proj-dash'),
  ('swe-e-0409-06', 'swe-proj-dash'),
  ('swe-e-0409-07', 'swe-proj-mobile'),
  ('swe-e-0409-08', 'swe-proj-ecom'),
  ('swe-e-0409-09', 'swe-proj-ecom'),
  ('swe-e-0409-09', 'swe-proj-api'),
  ('swe-e-0409-09', 'swe-proj-mobile');

-- ─── Time Entries — Thursday 2026-04-10 ──────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('swe-e-0410-01', '2026-04-10',  8,  9, 'System design session: dashboard caching layer'),
  ('swe-e-0410-02', '2026-04-10',  9, 10, 'CI/CD: Terraform scripts for prod environment'),
  ('swe-e-0410-03', '2026-04-10', 10, 11, 'CI/CD: RDS instance provisioning'),
  ('swe-e-0410-04', '2026-04-10', 11, 12, 'E-Commerce: checkout step 2 — payment form'),
  ('swe-e-0410-05', '2026-04-10', 12, 13, 'Lunch'),
  ('swe-e-0410-06', '2026-04-10', 13, 14, 'QA: end-to-end tests for checkout flow'),
  ('swe-e-0410-07', '2026-04-10', 14, 15, 'Analytics Dashboard: export to CSV feature'),
  ('swe-e-0410-08', '2026-04-10', 15, 16, 'Mobile App: offline mode — sync queue'),
  ('swe-e-0410-09', '2026-04-10', 16, 17, 'Bug fixes: Customer Portal — token expiry edge case');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('swe-e-0410-01', 'swe-proj-dash'),
  ('swe-e-0410-02', 'swe-proj-cicd'),
  ('swe-e-0410-03', 'swe-proj-cicd'),
  ('swe-e-0410-04', 'swe-proj-ecom'),
  ('swe-e-0410-06', 'swe-proj-ecom'),
  ('swe-e-0410-07', 'swe-proj-dash'),
  ('swe-e-0410-08', 'swe-proj-mobile'),
  ('swe-e-0410-09', 'swe-proj-api');

-- ─── Time Entries — Friday 2026-04-11 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('swe-e-0411-01', '2026-04-11',  8,  9, 'Sprint retrospective and velocity review'),
  ('swe-e-0411-02', '2026-04-11',  9, 10, 'E-Commerce: order confirmation email template'),
  ('swe-e-0411-03', '2026-04-11', 10, 11, 'Mobile App: app icon and splash screen assets'),
  ('swe-e-0411-04', '2026-04-11', 11, 12, 'QA: regression tests on mobile build'),
  ('swe-e-0411-05', '2026-04-11', 12, 13, 'Lunch'),
  ('swe-e-0411-06', '2026-04-11', 13, 14, 'Customer Portal API: deploy to staging'),
  ('swe-e-0411-07', '2026-04-11', 14, 15, 'Analytics Dashboard: user feedback review and backlog'),
  ('swe-e-0411-08', '2026-04-11', 15, 16, 'Documentation: update onboarding README for new devs');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('swe-e-0411-01', 'swe-proj-ecom'),
  ('swe-e-0411-02', 'swe-proj-ecom'),
  ('swe-e-0411-03', 'swe-proj-mobile'),
  ('swe-e-0411-04', 'swe-proj-mobile'),
  ('swe-e-0411-06', 'swe-proj-api'),
  ('swe-e-0411-07', 'swe-proj-dash'),
  ('swe-e-0411-08', 'swe-proj-ecom'),
  ('swe-e-0411-08', 'swe-proj-api'),
  ('swe-e-0411-08', 'swe-proj-mobile');
