import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://eventix-h8bzpx079-srirams-projects-4110cee6.vercel.app/",
].filter(Boolean);

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.startsWith("http://localhost")) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      if (origin.endsWith(".vercel.app")) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Backend Running Successfully");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error Handler 
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;