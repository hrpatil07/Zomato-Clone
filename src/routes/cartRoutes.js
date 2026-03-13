/**
 * Cart Routes (USER only)
 * GET    /api/cart
 * POST   /api/cart/add
 * PUT    /api/cart/update
 * DELETE /api/cart/remove/:menuItemId
 */

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const router = express.Router();

// All cart routes require authenticated USER
router.use(authenticateToken, authorizeRoles("USER"));

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current cart contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds a menu item to the user's cart. If the cart has items from a different restaurant, it will be replaced.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartAddRequest'
 *     responses:
 *       200:
 *         description: Item added to cart
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
 *                   example: Item added to cart.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error or item unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/add",
  [
    body("menuItemId").notEmpty().withMessage("menuItemId is required."),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1."),
  ],
  validate,
  addToCart
);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update quantity of an item in the cart
 *     description: Set quantity to 0 to remove the item. If all items are removed, the cart is deleted.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartUpdateRequest'
 *     responses:
 *       200:
 *         description: Cart updated
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
 *                   example: Cart updated.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/update",
  [
    body("menuItemId").notEmpty().withMessage("menuItemId is required."),
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer."),
  ],
  validate,
  updateCartItem
);

/**
 * @swagger
 * /api/cart/remove/{menuItemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the menu item to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
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
 *                   example: Item removed from cart.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/remove/:menuItemId", removeCartItem);

module.exports = router;
