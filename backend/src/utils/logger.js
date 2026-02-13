import winston from "winston";
import path from "path";
import chalk from "chalk";
import { conf } from "../configs/env.js";

// Define log format
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  },
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  ),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the `console` with the simple format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let metaStr = "";

          // Only show meta if it has keys and is not empty
          if (Object.keys(meta).length > 0) {
            // Pretty print objects on new lines
            metaStr = JSON.stringify(meta, null, 2);
            // Colorize JSON if possible or keep clean
          }

          // Special handling for HTTP requests logged via Morgan/stream
          if (typeof message === "string" && message.includes("HTTP/")) {
            return `${chalk.gray(timestamp)} ${message}`;
          }

          return `${chalk.gray(timestamp)} ${level}: ${message} ${
            metaStr ? "\n" + chalk.gray(metaStr) : ""
          }`;
        }),
      ),
    }),
  );
}

// Create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
