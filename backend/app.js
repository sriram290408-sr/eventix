import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import crypto from "crypto";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { generalLimiter } from "./middlewares/rateLimitMiddleware.js";

const app = express();

app.set("trust proxy", 1);
// SECURITY
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://eventix-mu.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// BODY PARSER
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// COOKIES
app.use(cookieParser());

// SANITIZE
app.use(mongoSanitize());

// COMPRESSION
app.use(compression());

// REQUEST ID
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
});

// LOGGER
if (process.env.NODE_ENV !== "production") {
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]")
  );
}

// RATE LIMIT 
app.use(generalLimiter);

// HEALTH CHECK 
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventAxis API running",
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfuly",
  });
});

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

export default app;