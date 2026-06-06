const express = require("express");
const cors = require("cors");
const habitsRouter = require("./routes/habits");

const app = express();
const PORT = 3001;

// Allow comunication between frontend and backend
app.use(cors());
app.use(express.json());

// Route for all habit-related API endpoints
app.use("/api/habits", habitsRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Habit Tracker API is running!");
});

// Start the server on port 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});