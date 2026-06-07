const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const habitsRouter = require("./routes/habits");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve illustration images as static files
app.use("/illustrations", express.static(path.join(__dirname, "illustrations")));

// List all available illustrations
app.get("/api/illustrations", (req, res) => {
  const fs = require("fs");
  const illustrationsDir = path.join(__dirname, "illustrations");
  const files = fs.readdirSync(illustrationsDir).filter((f) =>
    [".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(path.extname(f).toLowerCase())
  );
  res.json(files.map((f) => ({ name: f, url: `/illustrations/${f}` })));
});

// Handle illustration uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "illustrations")),
  filename: (req, file, cb) => cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

app.post("/api/illustrations/upload", upload.single("illustration"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ name: req.file.filename, url: `/illustrations/${req.file.filename}` });
});

// Routes
app.use("/api/habits", habitsRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Habit Tracker API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});