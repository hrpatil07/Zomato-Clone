/**
 * Order Controller
 * Handles order placement, retrieval, and admin status updates.
 */

const asyncHandler = require("../utils/asyncHandler");
const orderService = require("../services/orderService");

// ════════════════ Customer APIs ════════════════

// ── POST /api/orders ──
const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user.userId);
  res.status(201).json({ success: true, message: "Order placed successfully.", data: order });
});

// ── GET /api/orders/my ──
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.userId);
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// ── GET /api/orders/:orderId ──
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, req.user.userId);
  res.status(200).json({ success: true, data: order });
});

// ════════════════ Admin APIs ════════════════

// ── GET /api/admin/orders ──
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders(req.query);
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// ── PUT /api/admin/orders/:orderId/status ──
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.orderId, status);
  res.status(200).json({ success: true, message: "Order status updated.", data: order });
});

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
