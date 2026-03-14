/**
 * Express Application Setup
 * Mounts all middleware, Swagger docs, and route modules.
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const { getSwaggerSpec } = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

// ── Route imports ──
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Enable correct protocol detection behind proxies (e.g. Render)
app.set("trust proxy", true);

// ── Global Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Swagger API Docs ──
// Serve the UI and load the JSON spec via /api-docs.json so we can dynamically
// set the server URL based on the incoming request (host + protocol).
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Zomato Lite API Docs",
    swaggerOptions: {
      url: "/api-docs.json",
    },
  })
);

// ── Swagger JSON spec endpoint ──
app.get("/api-docs.json", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const spec = getSwaggerSpec(baseUrl);

  res.setHeader("Content-Type", "application/json");
  res.send(spec);
});

// ── Health check ──
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🍕 Zomato Lite API is running!",
    docs: "/api-docs",
  });
});

// ── API Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Centralized error handler (must be last) ──
app.use(errorHandler);

module.exports = app;
