import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { httpLogger } from "./utils/logger.js";
import { conf } from "./configs/env.js";

const app = express();

// --- Logger (dev only) ---
if (process.env.NODE_ENV !== "production") {
  app.use(httpLogger);
}

// --- Standard Middleware ---
app.use(
  cors({
    // Use conf.corsOrigin instead of process.env directly
    origin: conf.corsOrigin === "*" ? false : conf.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --- Health Check ---
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

// --- Routes ---
import developerRouter from "./routes/developer.routes.js";
import authRouter from "./routes/auth.routes.js";

// Mount the routes
app.use("/api/v1/developers", developerRouter);
app.use("/auth", authRouter);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("\n", err.statusCode ? "✖" : "❌", err.message);

  if (process.env.NODE_ENV === "development" && err.stack) {
    console.error(err.stack.split("\n")[1]);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };
