const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const DB_URI = process.env.MONGO_URI;
console.log("Connecting to MongoDB...");
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ------------------- MIDDLEWARE -------------------

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:8080",
      "http://localhost:8080",
    ],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Session with MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_very_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

// ------------------- ROUTES -------------------

// Route files
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/events", require("./routes/events"));
app.use("/api/proof", require("./routes/proofs"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/achievements", require("./routes/achievements"));
app.use("/api/involvement", require("./routes/involvement"));
app.use("/api/sponsors", require("./routes/sponsors"));
app.use("/api/admin", require("./routes/admin")); // Removed duplicate line

// ------------------- SPA HTML SERVING -------------------

// Serve main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/events.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/profile.html"));
});

app.get("/get-involved", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/get-involved.html"));
});

app.get("/sponsor", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/sponsor.html"));
});
