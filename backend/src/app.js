import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import crypto from "crypto";
import hpp from "hpp";
import morgan from "morgan";

import logger, { stream } from "./utils/logger.js";
import { handleError } from "./utils/AppError.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { conf } from "./configs/env.js";
import { swaggerDocs } from "./configs/swagger.js";
import routes from "./routes/index.js"; // centralized routes
import homeHandler from "./home.js";

const app = express();

// --- Performance & Traceability ---
app.use(compression());
app.use((req, res, next) => {
  try {
    req.id = crypto.randomUUID?.() || Date.now().toString();
    next();
  } catch (err) {
    next();
  }
});

// Attach logger to request object (as early as possible)
app.use((req, res, next) => {
  try {
    req.logger =
      typeof logger?.child === "function"
        ? logger.child({ requestId: req.id })
        : logger;
    next();
  } catch (err) {
    req.logger = logger;
    next();
  }
});

// Use Morgan with Winston stream
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat, { stream }));

// --- Standard Middleware (Parser) ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

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
// app.use(mongoSanitize()); // Now after body parsers
app.use(hpp());

// --- Global Rate Limiting ---
app.use("/api", globalLimiter);

// --- Swagger Documentation ---
swaggerDocs(app);

// --- Standard Response Middleware (CORS) ---
app.use(
  cors({
    origin: (origin, callback) => {
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

// --- Home & Health Check ---
app.get("/", homeHandler);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

// --- Mount all API routes ---
app.use(routes);

// --- Global Error Handler ---
app.use(handleError);

export default app;
