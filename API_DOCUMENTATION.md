# Zomato Lite API Documentation

## Overview

Zomato Lite is a food ordering backend API built with Node.js, Express, MongoDB, and JWT authentication. This documentation provides comprehensive guidance for frontend integration, including all endpoints, request/response formats, authentication flows, and error handling.

## Base URL

**Development:**
```
http://localhost:{PORT}/api
```

**Production:**
```
https://zomato-clone-soi0.onrender.com/api
```

Where `{PORT}` is your configured port number (default: 5000). The port is set via the `PORT` environment variable.

**Examples:**
- Development: `http://localhost:5000/api` or `http://localhost:10000/api`
- Production: `https://zomato-clone-soi0.onrender.com/api`

*Note: The Swagger UI will automatically show the correct server URL based on your environment.*

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **USER**: Regular customers
- **ADMIN**: Restaurant administrators

## API Response Format

All responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required."
    }
  ]
}
```

## End-to-End User Flow

### 1. User Registration
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "USER",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "USER",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get User Profile
**Endpoint:** `GET /user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "USER",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## Restaurant Operations

### Browse All Restaurants
**Endpoint:** `GET /restaurants`

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "The Spice Kitchen",
      "description": "Authentic Indian cuisine",
      "isOpen": true,
      "avgRating": 4.2,
      "createdAt": "2024-01-01T09:00:00.000Z",
      "updatedAt": "2024-01-01T09:00:00.000Z"
    }
  ]
}
```

### Get Restaurant Details
**Endpoint:** `GET /restaurants/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "The Spice Kitchen",
    "description": "Authentic Indian cuisine",
    "isOpen": true,
    "avgRating": 4.2,
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:00:00.000Z"
  }
}
```

### Get Restaurant Menu
**Endpoint:** `GET /restaurants/{id}/menu`

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Chicken Biryani",
      "description": "Fragrant basmati rice with chicken",
      "price": 299,
      "category": "Main Course",
      "isAvailable": true,
      "createdAt": "2024-01-01T09:00:00.000Z",
      "updatedAt": "2024-01-01T09:00:00.000Z"
    }
  ]
}
```

### Get Restaurant Reviews
**Endpoint:** `GET /restaurants/{id}/reviews`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "rating": 4,
      "comment": "Great food and fast delivery!",
      "createdAt": "2024-01-01T11:00:00.000Z",
      "updatedAt": "2024-01-01T11:00:00.000Z"
    }
  ]
}
```

## Cart Operations

### Get Current Cart
**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalAmount": 598,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Add Item to Cart
**Endpoint:** `POST /cart/add`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalAmount": 598,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update Cart Item
**Endpoint:** `PUT /cart/update`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 3
      }
    ],
    "totalAmount": 897,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:05:00.000Z"
  }
}
```

### Remove Item from Cart
**Endpoint:** `DELETE /cart/remove/{menuItemId}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [],
    "totalAmount": 0,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:10:00.000Z"
  }
}
```

## Order Operations

### Place Order
**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalAmount": 598,
    "status": "PLACED",
    "createdAt": "2024-01-01T12:15:00.000Z",
    "updatedAt": "2024-01-01T12:15:00.000Z"
  }
}
```

### Get My Orders
**Endpoint:** `GET /orders/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "items": [
        {
          "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
          "name": "Chicken Biryani",
          "price": 299,
          "quantity": 2
        }
      ],
      "totalAmount": 598,
      "status": "PLACED",
      "createdAt": "2024-01-01T12:15:00.000Z",
      "updatedAt": "2024-01-01T12:15:00.000Z"
    }
  ]
}
```

### Get Order Details
**Endpoint:** `GET /orders/{orderId}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalAmount": 598,
    "status": "PLACED",
    "createdAt": "2024-01-01T12:15:00.000Z",
    "updatedAt": "2024-01-01T12:15:00.000Z"
  }
}
```

## Review Operations

### Submit Review
**Endpoint:** `POST /reviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "rating": 4,
  "comment": "Great food and fast delivery!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review submitted.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "rating": 4,
    "comment": "Great food and fast delivery!",
    "createdAt": "2024-01-01T13:00:00.000Z",
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

## Admin Operations

### Admin Login
**Endpoint:** `POST /admin/login`

**Request:**
```json
{
  "email": "admin@zomatolite.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful.",
  "data": {
    "admin": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
      "email": "admin@zomatolite.com",
      "role": "ADMIN",
      "createdAt": "2024-01-01T08:00:00.000Z",
      "updatedAt": "2024-01-01T08:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Super Admin (One-time Setup)
**Endpoint:** `POST /admin/seed-admin`

**Request:**
```json
{
  "email": "admin@zomatolite.com",
  "password": "admin123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Super admin created successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "email": "admin@zomatolite.com",
    "role": "ADMIN",
    "createdAt": "2024-01-01T08:00:00.000Z",
    "updatedAt": "2024-01-01T08:00:00.000Z"
  }
}
```

### Create Restaurant
**Endpoint:** `POST /admin/restaurants`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "The Spice Kitchen",
  "description": "Authentic Indian cuisine",
  "isOpen": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "The Spice Kitchen",
    "description": "Authentic Indian cuisine",
    "isOpen": true,
    "avgRating": 0,
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:00:00.000Z"
  }
}
```

### Update Restaurant
**Endpoint:** `PUT /admin/restaurants/{id}`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "The Spice Kitchen (Updated)",
  "isOpen": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "The Spice Kitchen (Updated)",
    "description": "Authentic Indian cuisine",
    "isOpen": false,
    "avgRating": 4.2,
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:30:00.000Z"
  }
}
```

### Add Menu Item
**Endpoint:** `POST /admin/restaurants/{id}/menu`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "Chicken Biryani",
  "description": "Fragrant basmati rice with chicken",
  "price": 299,
  "category": "Main Course",
  "isAvailable": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Chicken Biryani",
    "description": "Fragrant basmati rice with chicken",
    "price": 299,
    "category": "Main Course",
    "isAvailable": true,
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:00:00.000Z"
  }
}
```

### Update Menu Item
**Endpoint:** `PUT /admin/menu/{itemId}`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "price": 349,
  "isAvailable": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Chicken Biryani",
    "description": "Fragrant basmati rice with chicken",
    "price": 349,
    "category": "Main Course",
    "isAvailable": false,
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:15:00.000Z"
  }
}
```

### Delete Menu Item
**Endpoint:** `DELETE /admin/menu/{itemId}`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Menu item deleted."
}
```

### Get All Orders (Admin)
**Endpoint:** `GET /admin/orders?status=PLACED`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "items": [
        {
          "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
          "name": "Chicken Biryani",
          "price": 299,
          "quantity": 2
        }
      ],
      "totalAmount": 598,
      "status": "PLACED",
      "createdAt": "2024-01-01T12:15:00.000Z",
      "updatedAt": "2024-01-01T12:15:00.000Z"
    }
  ]
}
```

### Update Order Status
**Endpoint:** `PUT /admin/orders/{orderId}/status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "status": "PREPARING"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "restaurantId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Chicken Biryani",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalAmount": 598,
    "status": "PREPARING",
    "createdAt": "2024-01-01T12:15:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  }
}
```

### Get All Users (Admin)
**Endpoint:** `GET /admin/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "USER",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

## Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (e.g., email already exists)
- **500**: Internal Server Error

### Frontend Error Handling Tips
1. Always check the `success` field first
2. For validation errors, display the `errors` array to users
3. Handle network errors gracefully
4. Implement token refresh logic for expired tokens
5. Show user-friendly error messages

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required."
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters."
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access token is required"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

## Frontend Integration Checklist

- [ ] Set up API base URL configuration
- [ ] Implement JWT token storage (localStorage/sessionStorage)
- [ ] Create authentication service for login/register
- [ ] Add request interceptors for Authorization headers
- [ ] Implement response interceptors for error handling
- [ ] Create services for each API group (restaurants, cart, orders, etc.)
- [ ] Handle loading states for all API calls
- [ ] Implement proper error messages display
- [ ] Add retry logic for failed requests
- [ ] Set up environment-specific configurations

## Rate Limiting

The API may implement rate limiting. If you receive 429 (Too Many Requests) errors, implement exponential backoff in your frontend.

## Data Models

### User
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER';
  createdAt: string;
  updatedAt: string;
}
```

### Restaurant
```typescript
interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  isOpen: boolean;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
}
```

### MenuItem
```typescript
interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Cart
```typescript
interface Cart {
  _id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}
```

### Order
```typescript
interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'DELIVERED';
  createdAt: string;
  updatedAt: string;
}
```

### Review
```typescript
interface Review {
  _id: string;
  userId: string;
  restaurantId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Support

For additional support or questions about the API, please refer to the Swagger documentation:
- **Development:** `http://localhost:{PORT}/api-docs`
- **Production:** `https://zomato-clone-soi0.onrender.com/api-docs`

The Swagger UI will automatically show the appropriate server URL based on your environment.