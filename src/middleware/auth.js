/**
 * Authentication & Authorization Middleware
 *
 * authenticateToken – verifies JWT from the Authorization header.
 * authorizeRoles   – factory that returns middleware restricting
 *                    access to one or more roles.
 */

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

/**
 * Extract and verify the Bearer token.
 * On success, attaches `req.user` with { userId, role }.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

/**
 * Role-based authorization.
 * Usage: authorizeRoles("ADMIN") or authorizeRoles("USER", "ADMIN")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to access this resource.",
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
