/**
 * User Routes
 * GET /api/user/profile
 */

const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { getProfile } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized – token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – not a USER role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile", authenticateToken, authorizeRoles("USER"), getProfile);

module.exports = router;
