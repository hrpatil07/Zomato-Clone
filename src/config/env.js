/**
 * Centralized environment variable loader.
 * All env vars are read here so the rest of the app
 * imports from a single source of truth.
 */

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/zomato_lite",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Used by Swagger/OpenAPI server URL and can be overridden via .env
  // Example: BASE_URL=https://my-app.example.com
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
};
