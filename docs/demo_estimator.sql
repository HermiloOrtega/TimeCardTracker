-- ============================================================
-- TimeCardTracker — Demo Data: Construction Estimator
-- ============================================================
-- Scenario:
--   A civil construction estimator tracking time across 5 active
--   bids / projects. Categories represent the phases of a
--   construction bid lifecycle, from solicitation to award.
--
-- Usage:
--   Run database.sql first, then run this file:
--   mysql -u root -p timecardtracker < docs/demo_estimator.sql
--
-- Week covered: 2026-04-07 (Mon) – 2026-04-11 (Fri)
-- ============================================================

USE timecardtracker;

-- ─── Clear previous demo data (safe re-run) ──────────────────
DELETE FROM entry_projects WHERE entry_id LIKE 'est-%';
DELETE FROM time_entries    WHERE id       LIKE 'est-%';
DELETE FROM todo_projects   WHERE todo_id  LIKE 'est-todo-%';
DELETE FROM todos           WHERE id       LIKE 'est-todo-%';
DELETE FROM projects        WHERE id       LIKE 'est-%';
DELETE FROM categories      WHERE id       LIKE 'est-%';

-- ─── Categories — Civil Construction Bid Lifecycle ───────────
INSERT INTO categories (id, name, color, weekly_hours) VALUES
  ('est-cat-sol',   'Bid Solicitation & Review',  '#EF4444', 5.00),
  ('est-cat-site',  'Site Assessment & Takeoffs',  '#F97316', 10.00),
  ('est-cat-sub',   'Subcontractor Coordination',  '#EAB308', 8.00),
  ('est-cat-prep',  'Estimate Preparation',        '#22C55E', 12.00),
  ('est-cat-sub2',  'Bid Submission & Review',     '#3B82F6', 5.00),
  ('est-cat-post',  'Post-Bid & Negotiation',      '#8B5CF6', 5.00),
  ('est-cat-adm',   'Admin & Coordination',        '#64748B', 5.00);

-- ─── Projects — 5 Active Bids / Projects ─────────────────────
INSERT INTO projects (id, name, color, category_id) VALUES
  -- Commercial building complex — active bid
  ('est-proj-riverside', 'Riverside Commercial Complex Ph.2', NULL, 'est-cat-prep'),
  -- Infrastructure rehabilitation
  ('est-proj-hwy45',     'Hwy 45 Bridge Rehabilitation',     NULL, 'est-cat-site'),
  -- Municipal public works
  ('est-proj-wtp',       'Municipal Water Treatment Plant',  NULL, 'est-cat-sub'),
  -- Mixed-use urban development
  ('est-proj-downtown',  'Downtown Mixed-Use Development',   NULL, 'est-cat-prep'),
  -- Industrial construction
  ('est-proj-warehouse', 'Industrial Warehouse Facility',    NULL, 'est-cat-sub2');

-- ─── Todos ───────────────────────────────────────────────────
INSERT INTO todos (id, text, done, sort_order) VALUES
  ('est-todo-01', 'Riverside: finalize structural steel takeoff',             FALSE, 1),
  ('est-todo-02', 'Hwy 45: request geotech report from owner',               FALSE, 2),
  ('est-todo-03', 'WTP: follow up with mechanical subcontractor quotes',      FALSE, 3),
  ('est-todo-04', 'Downtown: review city zoning change impact on estimate',   FALSE, 4),
  ('est-todo-05', 'Warehouse: submit final bid by Friday 5 PM',              FALSE, 5),
  ('est-todo-06', 'Riverside: clarification RFI to architect',               FALSE, 6);

INSERT INTO todo_projects (todo_id, project_id) VALUES
  ('est-todo-01', 'est-proj-riverside'),
  ('est-todo-02', 'est-proj-hwy45'),
  ('est-todo-03', 'est-proj-wtp'),
  ('est-todo-04', 'est-proj-downtown'),
  ('est-todo-05', 'est-proj-warehouse'),
  ('est-todo-06', 'est-proj-riverside');

-- ─── Time Entries — Monday 2026-04-07 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('est-e-0407-01', '2026-04-07',  7,  8, 'Review new bid solicitations — morning'),
  ('est-e-0407-02', '2026-04-07',  8,  9, 'Riverside: review updated architectural drawings'),
  ('est-e-0407-03', '2026-04-07',  9, 10, 'Riverside: concrete quantity takeoff — foundations'),
  ('est-e-0407-04', '2026-04-07', 10, 11, 'Riverside: concrete quantity takeoff — superstructure'),
  ('est-e-0407-05', '2026-04-07', 11, 12, 'Hwy 45: site visit — bridge condition assessment'),
  ('est-e-0407-06', '2026-04-07', 12, 13, 'Lunch'),
  ('est-e-0407-07', '2026-04-07', 13, 14, 'Hwy 45: review existing bridge drawings and specs'),
  ('est-e-0407-08', '2026-04-07', 14, 15, 'WTP: scope review — pre-bid meeting notes'),
  ('est-e-0407-09', '2026-04-07', 15, 16, 'Admin: update bid log and active project tracker');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('est-e-0407-01', 'est-proj-riverside'),
  ('est-e-0407-01', 'est-proj-hwy45'),
  ('est-e-0407-02', 'est-proj-riverside'),
  ('est-e-0407-03', 'est-proj-riverside'),
  ('est-e-0407-04', 'est-proj-riverside'),
  ('est-e-0407-05', 'est-proj-hwy45'),
  ('est-e-0407-07', 'est-proj-hwy45'),
  ('est-e-0407-08', 'est-proj-wtp'),
  ('est-e-0407-09', 'est-proj-riverside'),
  ('est-e-0407-09', 'est-proj-hwy45'),
  ('est-e-0407-09', 'est-proj-wtp');

-- ─── Time Entries — Tuesday 2026-04-08 ───────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('est-e-0408-01', '2026-04-08',  7,  8, 'Downtown: review RFP documents and addenda'),
  ('est-e-0408-02', '2026-04-08',  8,  9, 'Downtown: site visit — existing demolition scope'),
  ('est-e-0408-03', '2026-04-08',  9, 10, 'Riverside: masonry and envelope takeoff'),
  ('est-e-0408-04', '2026-04-08', 10, 11, 'Riverside: MEP scope coordination with subs'),
  ('est-e-0408-05', '2026-04-08', 11, 12, 'Riverside: call — electrical subcontractor quote review'),
  ('est-e-0408-06', '2026-04-08', 12, 13, 'Lunch'),
  ('est-e-0408-07', '2026-04-08', 13, 14, 'WTP: mechanical equipment pricing research'),
  ('est-e-0408-08', '2026-04-08', 14, 15, 'WTP: process piping quantity takeoff'),
  ('est-e-0408-09', '2026-04-08', 15, 16, 'Warehouse: review IFB documents and division of work'),
  ('est-e-0408-10', '2026-04-08', 16, 17, 'Warehouse: earthwork and grading quantity takeoff');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('est-e-0408-01', 'est-proj-downtown'),
  ('est-e-0408-02', 'est-proj-downtown'),
  ('est-e-0408-03', 'est-proj-riverside'),
  ('est-e-0408-04', 'est-proj-riverside'),
  ('est-e-0408-05', 'est-proj-riverside'),
  ('est-e-0408-07', 'est-proj-wtp'),
  ('est-e-0408-08', 'est-proj-wtp'),
  ('est-e-0408-09', 'est-proj-warehouse'),
  ('est-e-0408-10', 'est-proj-warehouse');

-- ─── Time Entries — Wednesday 2026-04-09 ─────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('est-e-0409-01', '2026-04-09',  7,  8, 'Email: RFI responses and addenda review'),
  ('est-e-0409-02', '2026-04-09',  8,  9, 'Hwy 45: deck removal and demolition takeoff'),
  ('est-e-0409-03', '2026-04-09',  9, 10, 'Hwy 45: structural steel replacement quantities'),
  ('est-e-0409-04', '2026-04-09', 10, 11, 'WTP: subcontractor outreach — civil and sitework subs'),
  ('est-e-0409-05', '2026-04-09', 11, 12, 'WTP: plumbing and HVAC sub quote coordination'),
  ('est-e-0409-06', '2026-04-09', 12, 13, 'Lunch'),
  ('est-e-0409-07', '2026-04-09', 13, 14, 'Warehouse: concrete slab on grade takeoff'),
  ('est-e-0409-08', '2026-04-09', 14, 15, 'Warehouse: structural steel framing takeoff'),
  ('est-e-0409-09', '2026-04-09', 15, 16, 'Downtown: zoning change — scope impact analysis'),
  ('est-e-0409-10', '2026-04-09', 16, 17, 'Riverside: compile subcontractor quote summary');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('est-e-0409-01', 'est-proj-hwy45'),
  ('est-e-0409-01', 'est-proj-wtp'),
  ('est-e-0409-02', 'est-proj-hwy45'),
  ('est-e-0409-03', 'est-proj-hwy45'),
  ('est-e-0409-04', 'est-proj-wtp'),
  ('est-e-0409-05', 'est-proj-wtp'),
  ('est-e-0409-07', 'est-proj-warehouse'),
  ('est-e-0409-08', 'est-proj-warehouse'),
  ('est-e-0409-09', 'est-proj-downtown'),
  ('est-e-0409-10', 'est-proj-riverside');

-- ─── Time Entries — Thursday 2026-04-10 ──────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('est-e-0410-01', '2026-04-10',  7,  8, 'Warehouse: finalize GC markup and contingency'),
  ('est-e-0410-02', '2026-04-10',  8,  9, 'Warehouse: prepare bid form and cover letter'),
  ('est-e-0410-03', '2026-04-10',  9, 10, 'Warehouse: internal bid review with PM'),
  ('est-e-0410-04', '2026-04-10', 10, 11, 'Riverside: build cost estimate in spreadsheet'),
  ('est-e-0410-05', '2026-04-10', 11, 12, 'Riverside: review estimate with senior estimator'),
  ('est-e-0410-06', '2026-04-10', 12, 13, 'Lunch'),
  ('est-e-0410-07', '2026-04-10', 13, 14, 'Hwy 45: traffic control and MOT plan review'),
  ('est-e-0410-08', '2026-04-10', 14, 15, 'Hwy 45: build cost estimate spreadsheet'),
  ('est-e-0410-09', '2026-04-10', 15, 16, 'Downtown: earthwork and utility relocation takeoff'),
  ('est-e-0410-10', '2026-04-10', 16, 17, 'WTP: electrical and instrumentation scope review');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('est-e-0410-01', 'est-proj-warehouse'),
  ('est-e-0410-02', 'est-proj-warehouse'),
  ('est-e-0410-03', 'est-proj-warehouse'),
  ('est-e-0410-04', 'est-proj-riverside'),
  ('est-e-0410-05', 'est-proj-riverside'),
  ('est-e-0410-07', 'est-proj-hwy45'),
  ('est-e-0410-08', 'est-proj-hwy45'),
  ('est-e-0410-09', 'est-proj-downtown'),
  ('est-e-0410-10', 'est-proj-wtp');

-- ─── Time Entries — Friday 2026-04-11 ────────────────────────
INSERT INTO time_entries (id, date, start_hour, end_hour, description) VALUES
  ('est-e-0411-01', '2026-04-11',  7,  8, 'Warehouse: final bid review and sign-off'),
  ('est-e-0411-02', '2026-04-11',  8,  9, 'Warehouse: submit bid online — owner portal'),
  ('est-e-0411-03', '2026-04-11',  9, 10, 'Riverside: submit RFI to architect on structural details'),
  ('est-e-0411-04', '2026-04-11', 10, 11, 'WTP: attend pre-bid site walk — municipal facility'),
  ('est-e-0411-05', '2026-04-11', 11, 12, 'WTP: site walk notes and scope clarifications'),
  ('est-e-0411-06', '2026-04-11', 12, 13, 'Lunch'),
  ('est-e-0411-07', '2026-04-11', 13, 14, 'Downtown: post-bid debrief — lost Elm Street bid'),
  ('est-e-0411-08', '2026-04-11', 14, 15, 'Downtown: assess strategy for revised Downtown proposal'),
  ('est-e-0411-09', '2026-04-11', 15, 16, 'Admin: update bid calendar and win/loss tracker'),
  ('est-e-0411-10', '2026-04-11', 16, 17, 'Hwy 45: follow up with owner on bid timeline extension');

INSERT INTO entry_projects (entry_id, project_id) VALUES
  ('est-e-0411-01', 'est-proj-warehouse'),
  ('est-e-0411-02', 'est-proj-warehouse'),
  ('est-e-0411-03', 'est-proj-riverside'),
  ('est-e-0411-04', 'est-proj-wtp'),
  ('est-e-0411-05', 'est-proj-wtp'),
  ('est-e-0411-07', 'est-proj-downtown'),
  ('est-e-0411-08', 'est-proj-downtown'),
  ('est-e-0411-09', 'est-proj-riverside'),
  ('est-e-0411-09', 'est-proj-hwy45'),
  ('est-e-0411-09', 'est-proj-wtp'),
  ('est-e-0411-09', 'est-proj-downtown'),
  ('est-e-0411-09', 'est-proj-warehouse'),
  ('est-e-0411-10', 'est-proj-hwy45');
