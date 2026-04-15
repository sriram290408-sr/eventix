import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load Environment Variables
dotenv.config();

// Creating App
const app = express();

// Parsing the data
app.use(express.json());

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      return callback(error);
    },
    credentials: true,
  })
);

// Root Route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// 404 handler (NOT FOUND)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 500 handler (INTERNAL SERVER ERROR)
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;