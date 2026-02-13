import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import logger, { stream } from "./utils/logger.js";
import { handleError } from "./utils/AppError.js";
import { conf } from "./configs/env.js";
import { swaggerDocs } from "./configs/swagger.js";
import routes from "./routes/index.js"; // centralized routes
import homeHandler from "./home.js";

const app = express();

// Use Morgan with Winston stream
app.use(morgan("combined", { stream }));

// Attach logger to request object
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

swaggerDocs(app);

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:"],
      },
    },
  }),
);

// --- Standard Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = conf.corsOrigin.split(",");

      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
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
app.use(handleError);

export default app;
