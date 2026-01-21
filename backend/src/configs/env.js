import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET"
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
  // Do not call process.exit(1) in serverless; let the application handle missing vars or throw an error later.
}

const _conf = {
  port: String(process.env.PORT || 8000),
  mongodbUri: String(process.env.MONGODB_URI),
  corsOrigin: String(process.env.CORS_ORIGIN || "*"),
  accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET),
  accessTokenExpiry: String(process.env.ACCESS_TOKEN_EXPIRY || "1d"),
  refreshTokenSecret: String(process.env.REFRESH_TOKEN_SECRET),
  refreshTokenExpiry: String(process.env.REFRESH_TOKEN_EXPIRY || "10d"),
  // URLs
  frontendUrl: String(process.env.FRONTEND_URL || "http://localhost:5173"),
  cliUrl: String(process.env.CLI_URL || "http://localhost:5001"),

  // Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

  // GitHub
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,

  // Discord
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
};

export const conf = Object.freeze(_conf);
