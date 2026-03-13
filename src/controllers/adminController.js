/**
 * Admin Controller
 * Handles admin seeding operations.
 */

const asyncHandler = require("../utils/asyncHandler");
const adminService = require("../services/adminService");

/**
 * Seed super admin endpoint.
 */
const seedSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminService.seedSuperAdmin({ email, password });

  res.status(201).json({
    success: true,
    message: "Super admin created successfully.",
    data: admin,
  });
});

module.exports = { seedSuperAdmin };
