/**
 * Review Model
 * One review per user per restaurant (enforced via compound unique index).
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// ── One review per user per restaurant ──
reviewSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
