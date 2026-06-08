const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Get all habits
router.get("/", (req, res) => {
  const habits = db.prepare("SELECT * FROM habits").all();
  res.json(habits);
});

// Get a single habit by id
router.get("/:id", (req, res) => {
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  res.json(habit);
});

// Post a new habit
router.post("/", (req, res) => {
  const { name, description, frequency, times_per_day, color, illustration } = req.body;
  if (!name || !frequency) {
    return res.status(400).json({ error: "Name and frequency are required" });
  }
  const result = db
    .prepare("INSERT INTO habits (name, description, frequency, times_per_day, color, illustration) VALUES (?, ?, ?, ?, ?, ?)")
    .run(name, description, frequency, times_per_day || 1, color || "#a8d5a2", illustration || null);
  res.status(201).json({ 
    id: result.lastInsertRowid, 
    name, 
    description, 
    frequency, 
    times_per_day: times_per_day || 1,
    color: color || "#a8d5a2",
    illustration: illustration || null
  });
});

// Delete a habit
router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM habits WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Habit not found" });
  res.json({ message: "Habit deleted" });
});

// Post a completion (checking off a habit)
router.post("/:id/complete", (req, res) => {
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  const result = db
    .prepare("INSERT INTO completions (habit_id) VALUES (?)")
    .run(req.params.id);
  res.status(201).json({ id: result.lastInsertRowid, habit_id: req.params.id });
});

// Get all completions for a habit
router.get("/:id/completions", (req, res) => {
  const completions = db
    .prepare("SELECT * FROM completions WHERE habit_id = ?")
    .all(req.params.id);
  res.json(completions);
});

// Get today's completions
router.get("/completions/today", (req, res) => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Copenhagen" });
  const completions = db
    .prepare(
      `SELECT habit_id, COUNT(*) as count 
       FROM completions 
       WHERE date(completed_at, 'localtime') = ?
       GROUP BY habit_id`
    )
    .all(today);
  res.json(completions);
});

// Post skip a habit for today
router.post("/:id/skip", (req, res) => {
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  const result = db
    .prepare("INSERT INTO skips (habit_id) VALUES (?)")
    .run(req.params.id);
  res.status(201).json({ id: result.lastInsertRowid, habit_id: req.params.id });
});

// Get today's skips
router.get("/skips/today", (req, res) => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Copenhagen" });
  const skips = db
    .prepare(
      `SELECT * FROM skips 
       WHERE date(skipped_at, 'localtime') = ?`
    )
    .all(today);
  res.json(skips);
});

// Get all skips for a habit
router.get("/:id/skips", (req, res) => {
  const skips = db
    .prepare("SELECT * FROM skips WHERE habit_id = ?")
    .all(req.params.id);
  res.json(skips);
});

// Post shift all future instances by 1 day
router.post("/:id/shift", (req, res) => {
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  db.prepare("UPDATE habits SET shift_days = shift_days + 1 WHERE id = ?")
    .run(req.params.id);
  // Also skip today since we're shifting
  db.prepare("INSERT INTO skips (habit_id) VALUES (?)").run(req.params.id);
  res.json({ message: "Habit shifted by 1 day" });
});

// Put update a habit
router.put("/:id", (req, res) => {
  const { name, description, frequency, times_per_day, color, illustration } = req.body;
  if (!name || !frequency) {
    return res.status(400).json({ error: "Name and frequency are required" });
  }
  const result = db
    .prepare(
      `UPDATE habits 
       SET name = ?, description = ?, frequency = ?, times_per_day = ?, color = ?, illustration = ?
       WHERE id = ?`
    )
    .run(name, description, frequency, times_per_day || 1, color, illustration, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Habit not found" });
  res.json({ id: req.params.id, name, description, frequency, times_per_day, color, illustration });
});

module.exports = router;