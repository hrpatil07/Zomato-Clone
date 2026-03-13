/**
 * Admin Service
 * Handles admin seeding operations.
 */

const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");

/**
 * Seed a super admin (only if no admin exists).
 * Ensures only one admin exists in the system.
 */
const seedSuperAdmin = async ({ email, password }) => {
  // Check if any admin already exists
  const existingAdmin = await Admin.findOne();
  if (existingAdmin) {
    throw new ApiError(409, "Super admin already exists. Only one admin is allowed.");
  }

  // Create the super admin
  const admin = await Admin.create({
    email,
    passwordHash: password, // pre-save hook will hash it
  });

  return admin;
};

module.exports = { seedSuperAdmin };
