/**
 * Swagger / OpenAPI 3.0 Configuration
 * Generates the spec from JSDoc annotations in route files.
 */

const swaggerJsdoc = require("swagger-jsdoc");
const { PORT, BASE_URL } = require("./env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zomato Lite API",
      version: "1.0.0",
      description:
        "A small-scale Zomato-like food ordering backend built with Node.js, Express, MongoDB, and JWT authentication. Supports customer ordering flow and admin management.",
      contact: {
        name: "Zomato Lite Support",
      },
    },
    servers: [
      {
        url: BASE_URL,
        description: "Development server",
      },
    ],
    // ── Reusable security scheme ──
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from login/register",
        },
      },
      // ── Reusable schemas ──
      schemas: {
        // ─── Request bodies ───
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", minLength: 6, example: "password123" },
            phone: { type: "string", example: "9876543210" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        AdminLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@zomatolite.com" },
            password: { type: "string", example: "admin123" },
          },
        },
        CartAddRequest: {
          type: "object",
          required: ["menuItemId"],
          properties: {
            menuItemId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            quantity: { type: "integer", minimum: 1, default: 1, example: 2 },
          },
        },
        CartUpdateRequest: {
          type: "object",
          required: ["menuItemId", "quantity"],
          properties: {
            menuItemId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            quantity: { type: "integer", minimum: 0, example: 3 },
          },
        },
        ReviewRequest: {
          type: "object",
          required: ["restaurantId", "rating"],
          properties: {
            restaurantId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            comment: { type: "string", example: "Great food and fast delivery!" },
          },
        },
        CreateRestaurantRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "The Spice Kitchen" },
            description: { type: "string", example: "Authentic Indian cuisine" },
            isOpen: { type: "boolean", default: true },
          },
        },
        UpdateRestaurantRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "The Spice Kitchen (Updated)" },
            description: { type: "string", example: "Updated description" },
            isOpen: { type: "boolean" },
          },
        },
        CreateMenuItemRequest: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string", example: "Chicken Biryani" },
            description: { type: "string", example: "Fragrant basmati rice with chicken" },
            price: { type: "number", minimum: 0, example: 299 },
            category: { type: "string", example: "Main Course" },
            isAvailable: { type: "boolean", default: true },
          },
        },
        UpdateMenuItemRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Chicken Biryani (Large)" },
            description: { type: "string" },
            price: { type: "number", minimum: 0, example: 349 },
            category: { type: "string" },
            isAvailable: { type: "boolean" },
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["PLACED", "ACCEPTED", "PREPARING", "DELIVERED"],
              example: "PREPARING",
            },
          },
        },

        // ─── Response models ───
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["USER"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Restaurant: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            isOpen: { type: "boolean" },
            avgRating: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            restaurantId: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            isAvailable: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            menuItemId: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            quantity: { type: "integer" },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            restaurantId: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            totalAmount: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            restaurantId: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            totalAmount: { type: "number" },
            status: {
              type: "string",
              enum: ["PLACED", "ACCEPTED", "PREPARING", "DELIVERED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            restaurantId: { type: "string" },
            rating: { type: "integer" },
            comment: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Standard response wrappers ───
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    // ── Tag grouping ──
    tags: [
      { name: "Auth", description: "User registration and login" },
      { name: "User", description: "User profile management" },
      { name: "Restaurants", description: "Browse restaurants and menus" },
      { name: "Cart", description: "Shopping cart operations" },
      { name: "Orders", description: "Order placement and tracking" },
      { name: "Reviews", description: "Restaurant reviews" },
      { name: "Admin - Auth", description: "Admin authentication" },
      { name: "Admin - Restaurants", description: "Admin restaurant management" },
      { name: "Admin - Menu", description: "Admin menu management" },
      { name: "Admin - Orders", description: "Admin order management" },
      { name: "Admin - Users", description: "Admin user management" },
    ],
  },
  // ── Path to route files containing JSDoc annotations ──
  apis: ["./src/routes/*.js"],
};

const createSwaggerSpec = (baseUrl = BASE_URL) => {
  const servers = [
    { url: baseUrl, description: "Server" },
    ...(options.definition.servers?.slice(1) || []),
  ];

  const specOptions = {
    ...options,
    definition: {
      ...options.definition,
      servers,
    },
  };

  return swaggerJsdoc(specOptions);
};

const swaggerSpec = createSwaggerSpec();

module.exports = {
  swaggerSpec,
  getSwaggerSpec: createSwaggerSpec,
};
