import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

// Load Environment Variables
dotenv.config();

// PORT
const PORT = process.env.PORT || 5000;

// Start Backend
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();