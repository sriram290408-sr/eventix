const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      // Keep it simple: fail fast if missing.
      console.error("MongoDB URI missing. Set MONGODB_URI or MONGO_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      tls: true,
      // Keep this for local/dev environments where SSL chain can fail.
      tlsAllowInvalidCertificates: true,
    });
    console.log("MongoDB Connected successfully");

    // Ensure schemas are registered (beginner-friendly explicit requires)
    require("../models/User");
    require("../models/Event");
    require("../models/Participation");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;