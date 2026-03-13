/**
 * Admin Routes (ADMIN role only)
 *
 * Auth:
 *   POST /api/admin/login
 *
 * Restaurant management:
 *   POST /api/admin/restaurants
 *   PUT  /api/admin/restaurants/:id
 *
 * Menu management:
 *   POST   /api/admin/restaurants/:id/menu
 *   PUT    /api/admin/menu/:itemId
 *   DELETE /api/admin/menu/:itemId
 *
 * Order management:
 *   GET /api/admin/orders
 *   PUT /api/admin/orders/:orderId/status
 *
 * User management:
 *   GET /api/admin/users
 */

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { adminLogin } = require("../controllers/authController");
const {
  create,
  update,
  addMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/restaurantController");
const { getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { getAllUsers } = require("../controllers/userController");
const { seedSuperAdmin } = require("../controllers/adminController");

const router = express.Router();

// ══════════════════════════════════════════════
// PUBLIC (no auth)
// ══════════════════════════════════════════════

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin - Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  adminLogin
);

/**
 * @swagger
 * /api/admin/seed-admin:
 *   post:
 *     summary: Create super admin (one-time setup)
 *     description: Creates the first and only super admin. Fails if an admin already exists.
 *     tags: [Admin - Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@zomatolite.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: admin123
 *     responses:
 *       201:
 *         description: Super admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Super admin created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Super admin already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/seed-admin",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validate,
  seedSuperAdmin
);

// ══════════════════════════════════════════════
// PROTECTED (ADMIN only) — all routes below
// ══════════════════════════════════════════════
router.use(authenticateToken, authorizeRoles("ADMIN"));

// ─────────── Restaurant Management ───────────

/**
 * @swagger
 * /api/admin/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Admin - Restaurants]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRestaurantRequest'
 *     responses:
 *       201:
 *         description: Restaurant created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – not an ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/restaurants",
  [
    body("name").trim().notEmpty().withMessage("Restaurant name is required."),
    body("description").optional().trim(),
    body("isOpen").optional().isBoolean(),
  ],
  validate,
  create
);

/**
 * @swagger
 * /api/admin/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     tags: [Admin - Restaurants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurantRequest'
 *     responses:
 *       200:
 *         description: Restaurant updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/restaurants/:id", update);

// ─────────── Menu Management ───────────

/**
 * @swagger
 * /api/admin/restaurants/{id}/menu:
 *   post:
 *     summary: Add a new menu item to a restaurant
 *     tags: [Admin - Menu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuItemRequest'
 *     responses:
 *       201:
 *         description: Menu item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/restaurants/:id/menu",
  [
    body("name").trim().notEmpty().withMessage("Item name is required."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("description").optional().trim(),
    body("category").optional().trim(),
    body("isAvailable").optional().isBoolean(),
  ],
  validate,
  addMenu
);

/**
 * @swagger
 * /api/admin/menu/{itemId}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Admin - Menu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuItemRequest'
 *     responses:
 *       200:
 *         description: Menu item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/menu/:itemId", updateMenu);

/**
 * @swagger
 * /api/admin/menu/{itemId}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Admin - Menu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu item deleted.
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/menu/:itemId", deleteMenu);

// ─────────── Order Management ───────────

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (with optional status filter)
 *     tags: [Admin - Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLACED, ACCEPTED, PREPARING, DELIVERED]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get("/orders", getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{orderId}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Admin - Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order status updated.
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/orders/:orderId/status",
  [
    body("status")
      .notEmpty()
      .withMessage("Status is required.")
      .isIn(["PLACED", "ACCEPTED", "PREPARING", "DELIVERED"])
      .withMessage("Invalid status."),
  ],
  validate,
  updateOrderStatus
);

// ─────────── User Management ───────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin - Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get("/users", getAllUsers);

module.exports = router;
