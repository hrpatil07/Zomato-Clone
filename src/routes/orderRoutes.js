/**
 * Order Routes (USER)
 * POST /api/orders
 * GET  /api/orders/my
 * GET  /api/orders/:orderId
 */

const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

// All order routes require authenticated USER
router.use(authenticateToken, authorizeRoles("USER"));

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order from the current cart
 *     description: Creates an order by snapshot-copying cart items. Cart is cleared after placement. The restaurant must be open.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
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
 *                   example: Order placed successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty or restaurant is closed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", placeOrder);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/my", getMyOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Users can only view their own orders.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       403:
 *         description: Cannot view another user's order
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
router.get("/:orderId", getOrderById);

module.exports = router;
