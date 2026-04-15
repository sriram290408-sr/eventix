import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error("MONGODB_URI is missing in .env file");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;