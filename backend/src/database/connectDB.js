import mongoose from "mongoose";
import { conf } from "../configs/env.js";
import chalk from "chalk";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    console.log(chalk.gray("➜"), chalk.blue("Connecting to MongoDB Atlas..."));

    const conn = await mongoose.connect(conf.mongodbUri);

    console.log(chalk.green.bold("✔ MongoDB connected"));
    console.log(
      chalk.gray("➜"),
      chalk.cyan("Host:"),
      chalk.white(conn.connection.host)
    );
    console.log(
      chalk.gray("➜"),
      chalk.cyan("Database:"),
      chalk.white(conn.connection.name)
    );
    console.log();

  } catch (error) {
    console.error(chalk.red.bold("\n✖ MongoDB connection failed"));
    console.error(chalk.red(error.message));
    console.log();
    // Do not call process.exit(1) in serverless
    throw error;
  }
};

export default connectDB;
