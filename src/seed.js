/**
 * Database Seeder
 * Populates the database with sample data:
 *   - 1 Admin account
 *   - 2 Restaurants
 *   - Menu items for each restaurant
 *
 * Run:  npm run seed
 */

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Restaurant = require("./models/Restaurant");
const MenuItem = require("./models/MenuItem");

const seed = async () => {
  await connectDB();

  // ── Clear existing seed data ──
  await Admin.deleteMany({});
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  console.log("🗑️  Cleared existing data.");

  // ── Seed Admin ──
  const admin = await Admin.create({
    email: "admin@zomatolite.com",
    passwordHash: "admin123", // pre-save hook will hash it
  });
  console.log(`👤 Admin created: ${admin.email} / password: admin123`);

  // ── Seed Restaurants ──
  const [restaurant1, restaurant2] = await Restaurant.create([
    {
      name: "The Spice Kitchen",
      description: "Authentic Indian cuisine with a modern twist. Known for biryanis and tandoori specials.",
      isOpen: true,
      avgRating: 4.5,
    },
    {
      name: "Pizza Paradise",
      description: "Handcrafted artisan pizzas with fresh ingredients. Wood-fired oven baked to perfection.",
      isOpen: true,
      avgRating: 4.2,
    },
  ]);
  console.log(`🏪 Restaurants created: ${restaurant1.name}, ${restaurant2.name}`);

  // ── Seed Menu Items ──
  const menuItems = await MenuItem.create([
    // The Spice Kitchen items
    {
      restaurantId: restaurant1._id,
      name: "Chicken Biryani",
      description: "Fragrant basmati rice layered with tender chicken and aromatic spices",
      price: 299,
      category: "Main Course",
      isAvailable: true,
    },
    {
      restaurantId: restaurant1._id,
      name: "Paneer Butter Masala",
      description: "Soft paneer cubes in a rich, creamy tomato-based gravy",
      price: 249,
      category: "Main Course",
      isAvailable: true,
    },
    {
      restaurantId: restaurant1._id,
      name: "Garlic Naan",
      description: "Freshly baked naan bread with garlic and butter",
      price: 59,
      category: "Bread",
      isAvailable: true,
    },
    {
      restaurantId: restaurant1._id,
      name: "Mango Lassi",
      description: "Chilled yogurt drink blended with fresh mango pulp",
      price: 99,
      category: "Beverages",
      isAvailable: true,
    },
    {
      restaurantId: restaurant1._id,
      name: "Gulab Jamun",
      description: "Deep-fried milk dumplings soaked in rose-flavored sugar syrup",
      price: 129,
      category: "Desserts",
      isAvailable: true,
    },

    // Pizza Paradise items
    {
      restaurantId: restaurant2._id,
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
      price: 349,
      category: "Pizza",
      isAvailable: true,
    },
    {
      restaurantId: restaurant2._id,
      name: "Pepperoni Supreme",
      description: "Loaded with double pepperoni, mozzarella, and our signature sauce",
      price: 449,
      category: "Pizza",
      isAvailable: true,
    },
    {
      restaurantId: restaurant2._id,
      name: "Garlic Breadsticks",
      description: "Crispy breadsticks with garlic butter and parmesan",
      price: 149,
      category: "Sides",
      isAvailable: true,
    },
    {
      restaurantId: restaurant2._id,
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan with classic Caesar dressing",
      price: 199,
      category: "Salads",
      isAvailable: true,
    },
    {
      restaurantId: restaurant2._id,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
      price: 179,
      category: "Desserts",
      isAvailable: false, // Intentionally unavailable for testing
    },
  ]);

  console.log(`🍽️  ${menuItems.length} menu items created.`);
  console.log("\n✅ Seed completed successfully!\n");
  console.log("── Login Credentials ──");
  console.log("Admin  : admin@zomatolite.com / admin123");
  console.log("────────────────────────\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
