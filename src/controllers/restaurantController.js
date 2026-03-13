/**
 * Restaurant Controller
 * Handles both customer-facing and admin restaurant/menu endpoints.
 */

const asyncHandler = require("../utils/asyncHandler");
const restaurantService = require("../services/restaurantService");

// ════════════════ Customer APIs ════════════════

// ── GET /api/restaurants ──
const getAll = asyncHandler(async (req, res) => {
  const restaurants = await restaurantService.getAllRestaurants();
  res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
});

// ── GET /api/restaurants/:id ──
const getById = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);
  res.status(200).json({ success: true, data: restaurant });
});

// ── GET /api/restaurants/:id/menu ──
const getMenu = asyncHandler(async (req, res) => {
  const menu = await restaurantService.getMenuByRestaurant(req.params.id);
  res.status(200).json({ success: true, count: menu.length, data: menu });
});

// ════════════════ Admin APIs ════════════════

// ── POST /api/admin/restaurants ──
const create = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.createRestaurant(req.body);
  res.status(201).json({ success: true, data: restaurant });
});

// ── PUT /api/admin/restaurants/:id ──
const update = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
  res.status(200).json({ success: true, data: restaurant });
});

// ── POST /api/admin/restaurants/:id/menu ──
const addMenu = asyncHandler(async (req, res) => {
  const item = await restaurantService.addMenuItem(req.params.id, req.body);
  res.status(201).json({ success: true, data: item });
});

// ── PUT /api/admin/menu/:itemId ──
const updateMenu = asyncHandler(async (req, res) => {
  const item = await restaurantService.updateMenuItem(req.params.itemId, req.body);
  res.status(200).json({ success: true, data: item });
});

// ── DELETE /api/admin/menu/:itemId ──
const deleteMenu = asyncHandler(async (req, res) => {
  await restaurantService.deleteMenuItem(req.params.itemId);
  res.status(200).json({ success: true, message: "Menu item deleted." });
});

module.exports = { getAll, getById, getMenu, create, update, addMenu, updateMenu, deleteMenu };
