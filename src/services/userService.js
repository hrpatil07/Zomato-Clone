/**
 * User Service
 * User profile retrieval and admin user management.
 */

const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * Get user profile by ID.
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");
  return user;
};

/**
 * Get all users (admin).
 */
const getAllUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

module.exports = { getUserProfile, getAllUsers };
