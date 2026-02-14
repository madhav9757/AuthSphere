import logger from "./logger.js";

export function logStartup(port) {
  logger.info("Server started successfully", {
    mode: process.env.NODE_ENV || "development",
    port: port,
  });
}
