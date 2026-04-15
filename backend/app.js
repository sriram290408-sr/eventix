import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ✅ Vercel needs this
app.set("trust proxy", 1);

// ✅ Middleware
app.use(express.json());

// ✅ CORS (Allow frontend + vercel preview URLs)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.startsWith("http://localhost")) return callback(null, true);

      if (origin.endsWith(".vercel.app")) return callback(null, true);

      return callback(null, true);
    },
    credentials: true,
  })
);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Eventix Backend is Running 🚀");
});

// ✅ Health route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API Working" });
});

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// ✅ Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;