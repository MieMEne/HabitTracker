const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "habits.db"));

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL,
    times_per_day INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    completed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS skips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    skipped_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );
`);

// Migrations
try {
  db.exec("ALTER TABLE habits ADD COLUMN times_per_day INTEGER NOT NULL DEFAULT 1");
} catch (e) {}

try {
  db.exec("ALTER TABLE habits ADD COLUMN shift_days INTEGER NOT NULL DEFAULT 0");
} catch (e) {}

module.exports = db;