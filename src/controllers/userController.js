/**
 * User Controller
 * Handles user profile and admin user-list endpoints.
 */

const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

// ── GET /api/user/profile ──
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ── GET /api/admin/users ──
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = { getProfile, getAllUsers };
