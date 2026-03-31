-- ============================================================
-- TimeCardTracker — MySQL Schema
-- Run this script once to initialize the database.
-- Compatible with MySQL 5.7+ and MariaDB 10.3+
-- ============================================================

CREATE DATABASE IF NOT EXISTS timecardtracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE timecardtracker;

-- ------------------------------------------------------------
-- Categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id    VARCHAR(36)  NOT NULL,
  name  VARCHAR(255) NOT NULL,
  color VARCHAR(20)  NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Projects
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          VARCHAR(36)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  color       VARCHAR(20)  NULL,
  category_id VARCHAR(36)  NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_project_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Time Entries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS time_entries (
  id          VARCHAR(36)  NOT NULL,
  date        DATE         NOT NULL,
  start_hour  TINYINT      NOT NULL COMMENT '0–23',
  end_hour    TINYINT      NOT NULL COMMENT '1–24, always start_hour + 1',
  description VARCHAR(500) NULL,
  PRIMARY KEY (id),
  INDEX idx_entry_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Entry ↔ Project  (many-to-many)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entry_projects (
  entry_id   VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (entry_id, project_id),
  CONSTRAINT fk_ep_entry
    FOREIGN KEY (entry_id)   REFERENCES time_entries (id) ON DELETE CASCADE,
  CONSTRAINT fk_ep_project
    FOREIGN KEY (project_id) REFERENCES projects (id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Todos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS todos (
  id         VARCHAR(36)  NOT NULL,
  text       VARCHAR(500) NOT NULL,
  done       BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Todo ↔ Project  (many-to-many)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS todo_projects (
  todo_id    VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (todo_id, project_id),
  CONSTRAINT fk_tp_todo
    FOREIGN KEY (todo_id)    REFERENCES todos    (id) ON DELETE CASCADE,
  CONSTRAINT fk_tp_project
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Settings  (single row, id always = 1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id         INT         NOT NULL DEFAULT 1,
  theme      VARCHAR(10) NOT NULL DEFAULT 'light',
  time_range VARCHAR(20) NOT NULL DEFAULT 'work',
  view_mode  VARCHAR(20) NOT NULL DEFAULT 'week',
  PRIMARY KEY (id),
  CONSTRAINT chk_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default settings row
INSERT IGNORE INTO settings (id) VALUES (1);
