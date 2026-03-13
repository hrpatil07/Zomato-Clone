/**
 * Cart Controller
 * Manages the user's shopping cart.
 */

const asyncHandler = require("../utils/asyncHandler");
const cartService = require("../services/cartService");

// ── GET /api/cart ──
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.userId);
  res.status(200).json({ success: true, data: cart });
});

// ── POST /api/cart/add ──
const addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.userId, { menuItemId, quantity });
  res.status(200).json({ success: true, message: "Item added to cart.", data: cart });
});

// ── PUT /api/cart/update ──
const updateCartItem = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user.userId, { menuItemId, quantity });
  res.status(200).json({ success: true, message: "Cart updated.", data: cart });
});

// ── DELETE /api/cart/remove/:menuItemId ──
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(req.user.userId, req.params.menuItemId);
  res.status(200).json({ success: true, message: "Item removed from cart.", data: cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
