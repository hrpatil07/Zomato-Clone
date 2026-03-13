/**
 * Auth Controller
 * Handles HTTP layer for user registration, user login, and admin login.
 */

const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

// ── POST /api/auth/register ──
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password, phone });

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: { user, token },
  });
});

// ── POST /api/auth/login ──
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: { user, token },
  });
});

// ── POST /api/admin/login ──
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { admin, token } = await authService.loginAdmin({ email, password });

  res.status(200).json({
    success: true,
    message: "Admin login successful.",
    data: { admin, token },
  });
});

module.exports = { register, login, adminLogin };
