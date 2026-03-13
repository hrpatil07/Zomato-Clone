/**
 * Centralized Error-Handling Middleware
 *
 * Catches all errors thrown / passed via next(err) and returns
 * a consistent JSON response. In development mode the stack
 * trace is included for easier debugging.
 */

const { NODE_ENV } = require("../config/env");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  console.error("❌ Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({
      success: false,
      message: `Duplicate value for: ${field}`,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  // Default fallback
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
