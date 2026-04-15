import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import logger from "./utils/logger.js";
import app from "./app.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Eventix API Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
  }
};

if (process.env.VERCEL !== "1") {
  startServer();
}