/**
 * Auth Service
 * Handles registration, login for Users and Admins.
 */

const User = require("../models/User");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

/**
 * Register a new user.
 */
const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password, // pre-save hook will hash it
    phone,
  });

  const token = generateToken(user._id, user.role);
  return { user, token };
};

/**
 * Login an existing user.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user._id, user.role);
  return { user, token };
};

/**
 * Login an admin.
 */
const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(admin._id, admin.role);
  return { admin, token };
};

module.exports = { registerUser, loginUser, loginAdmin };
