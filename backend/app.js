const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const crypto = require("crypto");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const { generalLimiter } = require("./middlewares/rateLimitMiddleware");

const app = express();

// ====================== SECURITY ======================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ====================== CORS ======================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / Server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ====================== BODY PARSER ======================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ====================== COOKIES ======================
app.use(cookieParser());

// ====================== SANITIZE ======================
app.use(mongoSanitize());

// ====================== COMPRESSION ======================
app.use(compression());

// ====================== REQUEST ID ======================
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
});

// ====================== LOGGER ======================
if (process.env.NODE_ENV !== "production") {
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]")
  );
}

// ====================== RATE LIMIT ======================
app.use(generalLimiter);

// ====================== HEALTH CHECK ======================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventAxis API running",
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// ====================== ROUTES ======================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

// ====================== ERROR HANDLING ======================
app.use(notFound);
app.use(errorHandler);

module.exports = app;