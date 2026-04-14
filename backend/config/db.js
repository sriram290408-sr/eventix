import mongoose from "mongoose";

import "../models/User.js";
import "../models/Event.js";
import "../models/Participation.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("MongoDB URI missing. Set MONGODB_URI or MONGO_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;