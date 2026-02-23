import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// Use process.env.PORT for Render, default to 5001 for local
const PORT = process.env.PORT || 5001; 
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    // In production, you'll want to allow your Render URL. 
    // For now, this allows local testing.
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // FIX: Added parentheses around the wildcard to satisfy path-to-regexp
  app.get("(.*)", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});