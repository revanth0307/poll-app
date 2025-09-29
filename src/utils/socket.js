import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://poll-app-jpuq.onrender.com"  // Render backend URL
    : "http://localhost:4000";              // Local dev

export const socket = io(URL);
