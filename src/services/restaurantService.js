/**
 * Restaurant Service
 * Business logic for restaurants and their menus.
 */

const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const ApiError = require("../utils/ApiError");

// ──────────────── Customer-facing ────────────────

const getAllRestaurants = async () => {
  return Restaurant.find().sort({ createdAt: -1 });
};

const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");
  return restaurant;
};

const getMenuByRestaurant = async (restaurantId) => {
  await getRestaurantById(restaurantId); // ensure it exists
  return MenuItem.find({ restaurantId, isAvailable: true }).sort({ category: 1, name: 1 });
};

// ──────────────── Admin ────────────────

const createRestaurant = async (data) => {
  return Restaurant.create(data);
};

const updateRestaurant = async (id, data) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");
  return restaurant;
};

const addMenuItem = async (restaurantId, data) => {
  await getRestaurantById(restaurantId); // ensure restaurant exists
  return MenuItem.create({ ...data, restaurantId });
};

const updateMenuItem = async (itemId, data) => {
  const item = await MenuItem.findByIdAndUpdate(itemId, data, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, "Menu item not found.");
  return item;
};

const deleteMenuItem = async (itemId) => {
  const item = await MenuItem.findByIdAndDelete(itemId);
  if (!item) throw new ApiError(404, "Menu item not found.");
  return item;
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getMenuByRestaurant,
  createRestaurant,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
