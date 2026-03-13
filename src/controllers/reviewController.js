/**
 * Review Controller
 * Handles review creation and listing.
 */

const asyncHandler = require("../utils/asyncHandler");
const reviewService = require("../services/reviewService");

// ── POST /api/reviews ──
const createReview = asyncHandler(async (req, res) => {
  const { restaurantId, rating, comment } = req.body;
  const review = await reviewService.createReview(req.user.userId, {
    restaurantId,
    rating,
    comment,
  });
  res.status(201).json({ success: true, message: "Review submitted.", data: review });
});

// ── GET /api/restaurants/:id/reviews ──
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByRestaurant(req.params.id);
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

module.exports = { createReview, getReviews };
