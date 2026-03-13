/**
 * Order Service
 * Handles order placement, retrieval, and status updates.
 *
 * Business rules:
 * - Order items are snapshot-copied from the cart (immutable).
 * - Cart is cleared after successful order placement.
 * - Only the owning user can view their orders.
 * - Only admins can update order status.
 */

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const cartService = require("./cartService");
const ApiError = require("../utils/ApiError");
const { ORDER_STATUSES } = require("../models/Order");

/**
 * Place a new order from the user's current cart.
 */
const placeOrder = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty. Add items before placing an order.");
  }

  // Verify restaurant is open
  const restaurant = await Restaurant.findById(cart.restaurantId);
  if (!restaurant || !restaurant.isOpen) {
    throw new ApiError(400, "The restaurant is currently closed.");
  }

  // Create order with snapshot of cart items
  const order = await Order.create({
    userId,
    restaurantId: cart.restaurantId,
    items: cart.items.map((item) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: cart.totalAmount,
    status: "PLACED",
  });

  // Clear the cart after successful order
  await cartService.clearCart(userId);

  return order;
};

/**
 * Get all orders for a specific user.
 */
const getUserOrders = async (userId) => {
  return Order.find({ userId })
    .populate("restaurantId", "name")
    .sort({ createdAt: -1 });
};

/**
 * Get a single order by ID (only if it belongs to the user).
 */
const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId).populate("restaurantId", "name");
  if (!order) throw new ApiError(404, "Order not found.");
  if (order.userId.toString() !== userId) {
    throw new ApiError(403, "You can only view your own orders.");
  }
  return order;
};

// ──────────────── Admin ────────────────

/**
 * Get all orders (admin view).
 */
const getAllOrders = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;

  return Order.find(filter)
    .populate("userId", "name email")
    .populate("restaurantId", "name")
    .sort({ createdAt: -1 });
};

/**
 * Update order status (admin only).
 */
const updateOrderStatus = async (orderId, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`);
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  ).populate("userId", "name email").populate("restaurantId", "name");

  if (!order) throw new ApiError(404, "Order not found.");
  return order;
};

module.exports = { placeOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };
