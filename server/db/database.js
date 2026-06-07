const Database = require("better-sqlite3");
const path = require("path");

// Create/connect to the database file
const db = new Database(path.join(__dirname, "habits.db"));

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables if they don't exist yet
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
`);

// Add times_per_day column if it doesn't exist yet
try {
  db.exec("ALTER TABLE habits ADD COLUMN times_per_day INTEGER NOT NULL DEFAULT 1");
} catch (e) {
  // Column already exists, ignore
}

module.exports = db;