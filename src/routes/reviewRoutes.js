/**
 * Review Routes
 * POST /api/reviews  (USER only)
 */

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { createReview } = require("../controllers/reviewController");

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a review for a restaurant
 *     description: One review per user per restaurant. If a review already exists, it will be updated (upsert). Automatically recalculates the restaurant's average rating.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewRequest'
 *     responses:
 *       201:
 *         description: Review submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review submitted.
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("USER"),
  [
    body("restaurantId").notEmpty().withMessage("restaurantId is required."),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
    body("comment").optional().trim(),
  ],
  validate,
  createReview
);

module.exports = router;
