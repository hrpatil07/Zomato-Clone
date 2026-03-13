/**
 * Review Service
 * Handles review creation and retrieval.
 * Automatically recalculates the restaurant's average rating after each review.
 */

const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");
const ApiError = require("../utils/ApiError");

/**
 * Create or update a review for a restaurant.
 * (One review per user per restaurant – upsert behaviour.)
 */
const createReview = async (userId, { restaurantId, rating, comment }) => {
  // Verify restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");

  // Upsert review
  const review = await Review.findOneAndUpdate(
    { userId, restaurantId },
    { rating, comment },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  // Recalculate average rating for the restaurant
  const stats = await Review.aggregate([
    { $match: { restaurantId: restaurant._id } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  restaurant.avgRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  await restaurant.save();

  return review;
};

/**
 * Get all reviews for a restaurant.
 */
const getReviewsByRestaurant = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");

  return Review.find({ restaurantId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};

module.exports = { createReview, getReviewsByRestaurant };
