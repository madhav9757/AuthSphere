import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { httpLogger } from "./utils/logger.js";
import { conf } from "./configs/env.js";
import routes from "./routes/index.js"; // centralized routes
import homeHandler from "./home.js";

const app = express();

// --- Logger (dev only) ---
if (process.env.NODE_ENV !== "production") {
  app.use(httpLogger);
}

// --- Standard Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = conf.corsOrigin.split(",");

      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*") || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --- Home & Health Check ---
app.get("/", homeHandler);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

// --- Mount all API routes from centralized router ---
app.use(routes);

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

export default app;
