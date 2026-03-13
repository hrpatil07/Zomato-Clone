/**
 * Custom API Error class.
 * Allows throwing errors with an HTTP status code that the
 * centralized error handler can pick up.
 */

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
