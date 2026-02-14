import mongoose from "mongoose";
import { conf } from "../configs/env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      logger.info("Connecting to MongoDB Atlas...");
      const conn = await mongoose.connect(conf.mongodbUri);

      logger.info(`MongoDB connected to host: ${conn.connection.host}`);
      logger.info(`Database: ${conn.connection.name}`);
    }
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    throw error;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  logger.info("MongoDB connection closed");
};

export default connectDB;
