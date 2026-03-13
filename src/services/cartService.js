/**
 * Cart Service
 * Manages the user's single active cart.
 *
 * Business rules:
 * - A user can have only ONE active cart.
 * - All items in a cart must belong to the SAME restaurant.
 *   Adding an item from a different restaurant replaces the cart.
 * - Cart items are embedded (snapshot of name & price at add-time).
 */

const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");
const ApiError = require("../utils/ApiError");

/**
 * Get the current cart for a user.
 */
const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("restaurantId", "name");
  if (!cart) {
    return { items: [], totalAmount: 0, restaurantId: null };
  }
  return cart;
};

/**
 * Add an item to the cart.
 * If the user already has a cart for a DIFFERENT restaurant, it is replaced.
 */
const addToCart = async (userId, { menuItemId, quantity = 1 }) => {
  // 1. Validate menu item
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) throw new ApiError(404, "Menu item not found.");
  if (!menuItem.isAvailable) throw new ApiError(400, "Menu item is currently unavailable.");

  // 2. Find or create cart
  let cart = await Cart.findOne({ userId });

  // If cart is for a different restaurant, clear it
  if (cart && cart.restaurantId.toString() !== menuItem.restaurantId.toString()) {
    cart.items = [];
    cart.restaurantId = menuItem.restaurantId;
  }

  if (!cart) {
    cart = new Cart({
      userId,
      restaurantId: menuItem.restaurantId,
      items: [],
    });
  }

  // 3. Upsert item in cart
  const existingItem = cart.items.find(
    (i) => i.menuItemId.toString() === menuItemId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    });
  }

  await cart.save(); // pre-save recalculates totalAmount
  return cart;
};

/**
 * Update quantity of a specific item in the cart.
 */
const updateCartItem = async (userId, { menuItemId, quantity }) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found.");

  const item = cart.items.find(
    (i) => i.menuItemId.toString() === menuItemId
  );
  if (!item) throw new ApiError(404, "Item not found in cart.");

  if (quantity <= 0) {
    // Remove the item if quantity drops to 0
    cart.items = cart.items.filter(
      (i) => i.menuItemId.toString() !== menuItemId
    );
  } else {
    item.quantity = quantity;
  }

  // If cart is now empty, delete it
  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return { items: [], totalAmount: 0, restaurantId: null };
  }

  await cart.save();
  return cart;
};

/**
 * Remove an item from the cart entirely.
 */
const removeCartItem = async (userId, menuItemId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found.");

  const itemIndex = cart.items.findIndex(
    (i) => i.menuItemId.toString() === menuItemId
  );
  if (itemIndex === -1) throw new ApiError(404, "Item not found in cart.");

  cart.items.splice(itemIndex, 1);

  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return { items: [], totalAmount: 0, restaurantId: null };
  }

  await cart.save();
  return cart;
};

/**
 * Clear the entire cart (used after order placement).
 */
const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ userId });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
