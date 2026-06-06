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
  const { name, description, frequency } = req.body;
  if (!name || !frequency) {
    return res.status(400).json({ error: "Name and frequency are required" });
  }
  const result = db
    .prepare("INSERT INTO habits (name, description, frequency) VALUES (?, ?, ?)")
    .run(name, description, frequency);
  res.status(201).json({ id: result.lastInsertRowid, name, description, frequency });
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

// GET today's completions
router.get("/completions/today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const completions = db
    .prepare(
      `SELECT * FROM completions 
       WHERE date(completed_at) = ?`
    )
    .all(today);
  res.json(completions);
});

module.exports = router;