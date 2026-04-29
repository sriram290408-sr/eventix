import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://eventix-4yuz.vercel.app",
    ].filter(Boolean),
    credentials: true,
  })
);

// Root
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;