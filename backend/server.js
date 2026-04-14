const path = require("path");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

// Force load backend/.env always
dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(`✦ Eventix API Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(
        `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
      );
      logger.info(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);

    setTimeout(() => {
      logger.warn("Retrying DB connection...");
      startServer();
    }, 5000);
  }
};

// ====================== GRACEFUL SHUTDOWN ======================
const shutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      logger.info("HTTP server closed successfully");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown due to timeout");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// ====================== PROCESS HANDLERS ======================
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  shutdown("UNCAUGHT_EXCEPTION");
});

// ====================== START SERVER ======================
startServer();