const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Allowed origins for CORS
const ALLOWED = (process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Default allow localhost for dev
const defaultAllowed = ["http://localhost:3000"];

app.use(
  cors({
    origin: ALLOWED.length ? ALLOWED : defaultAllowed,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ALLOWED.length ? ALLOWED : defaultAllowed,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// --- In-memory state ---
let currentQuestion = null;
let results = {};
let participants = [];
let pollTimeout = null;

app.get("/", (_req, res) => res.send("Poll backend is running ✅"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing participants immediately
  socket.emit("participants", participants);

  // --- User joins ---
  socket.on("join", (name) => {
    const role = name === "Teacher" ? "teacher" : "student";

    const exists = participants.find((p) => p.name === name);

    if (!exists) {
      participants.push({ id: socket.id, name, role });
    } else {
      participants = participants.map((p) =>
        p.name === name ? { id: socket.id, name, role } : p
      );
    }

    io.emit("participants", participants);

    if (currentQuestion) {
      socket.emit("newPoll", currentQuestion);
      if (Object.keys(results).length > 0) {
        socket.emit("results", results);
      }
    }
  });

  // --- Teacher creates poll ---
  socket.on("createPoll", (poll) => {
    currentQuestion = poll;   // poll = { question, options, duration }
    results = {};

    io.emit("newPoll", currentQuestion);

    // Clear old timeout if any
    if (pollTimeout) clearTimeout(pollTimeout);

    if (poll.duration) {
      pollTimeout = setTimeout(() => {
        io.emit("finalResults", results);
        currentQuestion = null;
        results = {};
      }, poll.duration * 1000);
    }
  });

  // --- Student submits answer ---
  socket.on("submitAnswer", (data) => {
    results[data.option] = (results[data.option] || 0) + 1;
    io.emit("results", results);
  });

  // --- Chat ---
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

  // --- Teacher ends poll manually ---
  socket.on("endPoll", () => {
    io.emit("finalResults", results);
    currentQuestion = null;
    results = {};
    if (pollTimeout) clearTimeout(pollTimeout);
  });

  // --- Kick student ---
  socket.on("kick", (id) => {
    participants = participants.filter((p) => p.id !== id);
    io.to(id).emit("kicked");
    io.emit("participants", participants);
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    participants = participants.filter((p) => p.id !== socket.id);
    io.emit("participants", participants);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);
