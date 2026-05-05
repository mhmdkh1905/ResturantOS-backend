# 🍽️ RestaurantOS — Backend

A RESTful API for the RestaurantOS restaurant management system, built with **Node.js**, **Express**, and **MongoDB**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication](#-authentication)
- [API Reference](#-api-reference)
  - [Auth](#auth)
  - [Dashboard](#dashboard)
  - [Orders](#orders)
  - [Menu](#menu)
  - [Tables](#tables)
  - [Inventory](#inventory)
  - [Employees](#employees)
- [Models](#-models)
- [Response Format](#-response-format)
- [Role Permissions](#-role-permissions)

---

## 🛠 Tech Stack

| Tool                                             | Purpose             |
| ------------------------------------------------ | ------------------- |
| [Node.js](https://nodejs.org)                    | Runtime             |
| [Express](https://expressjs.com)                 | Web framework       |
| [MongoDB](https://mongodb.com)                   | Database            |
| [Mongoose](https://mongoosejs.com)               | ODM                 |
| [JSON Web Tokens](https://jwt.io)                | Authentication      |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing    |
| [Morgan](https://github.com/expressjs/morgan)    | HTTP request logger |

---

## 📁 Project Structure

```
backend/
├── controllers/
│   ├── authController.js          # Register & login
│   ├── dashboardController.js     # Stats & overview data
│   ├── employeesController.js     # Employee CRUD + salary/hours
│   ├── inventoryController.js     # Inventory CRUD
│   ├── menuController.js          # Menu item CRUD
│   ├── orderController.js         # Order CRUD + status updates
│   └── tablesController.js        # Table CRUD + status updates
├── middleware/
│   ├── auth.js                    # JWT verification + role guards
│   └── logger.js                  # Morgan HTTP logger
├── models/
│   ├── counterModel.js            # Auto-increment order numbers
│   ├── employeesModel.js          # Employee schema
│   ├── inventoryModel.js          # Inventory/ingredient schema
│   ├── menuModel.js               # Menu item schema
│   ├── orderModel.js              # Order schema
│   ├── tablesModel.js             # Table schema
│   └── userModel.js               # User schema (auth)
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── employeesRoutes.js
│   ├── inventoryRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── tablesRoutes.js
├── utils/
│   └── response.js                # Unified success/error response helpers
├── .env
└── server.js
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/restaurantos-backend.git
cd restaurantos-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values — see [Environment Variables](#-environment-variables).

### 4. Start the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The server runs at **http://localhost:3000** by default.

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resturantOS
```

| Variable      | Description                       |
| ------------- | --------------------------------- |
| `PORT`        | Port the server listens on        |
| `JWT_SECRET`  | Secret key for signing JWT tokens |
| `MONGODB_URI` | MongoDB connection string         |

---

## 🔐 Authentication

The API uses **JWT Bearer tokens**.

Include the token in every protected request:

```
Authorization: Bearer <your_token>
```

Tokens are obtained from `POST /api/auth/login`.

### Middleware

| Middleware                      | Description                       |
| ------------------------------- | --------------------------------- |
| `authinticateUser`              | Verifies JWT, attaches `req.user` |
| `requireAdmin(role)`            | Allows only one specific role     |
| `requireTwoRoles(role1, role2)` | Allows either of two roles        |

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

All protected routes require `Authorization: Bearer <token>`.

---

### Auth

| Method | Endpoint            | Auth     | Description                |
| ------ | ------------------- | -------- | -------------------------- |
| `POST` | `/auth/register`    | ❌       | Register a new user        |
| `POST` | `/auth/login`       | ❌       | Login and receive JWT      |
| `POST` | `/auth/create-user` | ✅ Admin | Create a user (admin only) |

#### POST `/auth/register`

```json
{
  "name": "Ahmad Hassan",
  "email": "ahmad@restaurant.com",
  "password": "secret123",
  "role": "admin"
}
```

#### POST `/auth/login`

```json
{
  "email": "ahmad@restaurant.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": { "id": "...", "name": "Ahmad Hassan", "role": "admin" }
}
```

---

### Dashboard

| Method | Endpoint     | Auth | Description        |
| ------ | ------------ | ---- | ------------------ |
| `GET`  | `/dashboard` | ❌   | Get overview stats |

**Response `data`:**

```json
{
  "totalOrders": 42,
  "todayIncome": 389.5,
  "activeOrders": 3,
  "lowStock": 1,
  "weeklyRevenue": [
    { "day": "Mon", "revenue": 120 },
    { "day": "Tue", "revenue": 95 }
  ],
  "recentOrders": [
    { "id": "#12", "table": 3, "status": "Ready", "total": 28.98 }
  ]
}
```

---

### Orders

| Method | Endpoint             | Auth | Roles         | Description         |
| ------ | -------------------- | ---- | ------------- | ------------------- |
| `GET`  | `/orders`            | ✅   | All           | Get all orders      |
| `POST` | `/orders`            | ✅   | Admin, Waiter | Create new order    |
| `PUT`  | `/orders/:id/status` | ✅   | All           | Update order status |

#### POST `/orders`

```json
{
  "tableId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "items": [
    { "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d2", "quantity": 2 },
    { "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3", "quantity": 1 }
  ],
  "note": "No onions please"
}
```

> Creating an order automatically deducts ingredients from inventory using a MongoDB transaction.

#### PUT `/orders/:id/status`

```json
{
  "status": "Preparing"
}
```

Valid statuses: `Pending` → `Preparing` → `Ready` → `Served`

---

### Menu

| Method   | Endpoint    | Auth | Roles         | Description        |
| -------- | ----------- | ---- | ------------- | ------------------ |
| `GET`    | `/menu`     | ❌   | —             | Get all menu items |
| `GET`    | `/menu/:id` | ✅   | Admin, Waiter | Get item by ID     |
| `POST`   | `/menu`     | ✅   | Admin         | Create menu item   |
| `PUT`    | `/menu/:id` | ✅   | Admin         | Update menu item   |
| `DELETE` | `/menu/:id` | ✅   | Admin         | Delete menu item   |

#### POST `/menu`

```json
{
  "name": "Margherita Pizza",
  "price": 12.99,
  "category": "Main Course",
  "image": "https://example.com/pizza.jpg",
  "recipe": "Classic Italian pizza with tomato and mozzarella",
  "isAvailable": true,
  "ingredients": [{ "ingredientId": "64f1a2b3...", "quantity": 0.2 }]
}
```

---

### Tables

| Method   | Endpoint             | Auth | Roles         | Description         |
| -------- | -------------------- | ---- | ------------- | ------------------- |
| `GET`    | `/tables`            | ✅   | Admin, Waiter | Get all tables      |
| `GET`    | `/tables/:id`        | ✅   | Admin, Waiter | Get table by ID     |
| `POST`   | `/tables`            | ✅   | Admin         | Create table        |
| `PUT`    | `/tables/:id`        | ✅   | Admin, Waiter | Update table        |
| `PATCH`  | `/tables/:id/status` | ✅   | Admin, Waiter | Update table status |
| `DELETE` | `/tables/:id`        | ✅   | Admin         | Delete table        |

#### POST `/tables`

```json
{
  "number": 5,
  "capacity": 4
}
```

#### PATCH `/tables/:id/status`

```json
{
  "status": "Occupied"
}
```

Valid statuses: `Free` | `Occupied` | `Reserved`

---

### Inventory

| Method   | Endpoint                | Auth | Roles       | Description      |
| -------- | ----------------------- | ---- | ----------- | ---------------- |
| `GET`    | `/inventory`            | ✅   | Admin, Chef | Get all items    |
| `GET`    | `/inventory/:id`        | ✅   | Admin, Chef | Get item by ID   |
| `GET`    | `/inventory/name/:name` | ✅   | Admin, Chef | Get item by name |
| `POST`   | `/inventory`            | ✅   | Admin, Chef | Create item      |
| `PUT`    | `/inventory/:id`        | ✅   | Admin, Chef | Update item      |
| `DELETE` | `/inventory/:id`        | ✅   | Admin, Chef | Delete item      |

#### POST `/inventory`

```json
{
  "ingredientName": "Mozzarella",
  "quantity": 10,
  "unit": "kg",
  "minThreshold": 2,
  "costPerUnit": 8.5,
  "supplier": "Dairy Direct"
}
```

Valid units: `kg` | `g` | `liter` | `ml` | `piece`

> An item is considered **low stock** when `quantity ≤ minThreshold`. This is exposed as a virtual `isLowStock` field.

---

### Employees

| Method   | Endpoint                            | Auth | Roles | Description                    |
| -------- | ----------------------------------- | ---- | ----- | ------------------------------ |
| `GET`    | `/employees`                        | ✅   | Admin | Get all employees              |
| `GET`    | `/employees/:id`                    | ✅   | Admin | Get employee by ID             |
| `GET`    | `/employees/name/:name`             | ✅   | Admin | Get employee by name           |
| `GET`    | `/employees/:id/total-salary`       | ✅   | Admin | Get total salary               |
| `POST`   | `/employees`                        | ✅   | Admin | Create employee + user account |
| `PUT`    | `/employees/:id`                    | ✅   | Admin | Update employee                |
| `PATCH`  | `/employees/:id/worked-hours`       | ✅   | Admin | Add worked hours               |
| `PATCH`  | `/employees/:id/salary`             | ✅   | Admin | Update salary per hour         |
| `PATCH`  | `/employees/reset-worked-hours/:id` | ✅   | Admin | Reset one employee's hours     |
| `PATCH`  | `/employees/reset-worked-hours`     | ✅   | Admin | Reset all employees' hours     |
| `DELETE` | `/employees/:id`                    | ✅   | Admin | Delete employee                |

#### POST `/employees`

```json
{
  "name": "Maria Garcia",
  "email": "maria@restaurant.com",
  "password": "secret123",
  "role": "chef",
  "phoneNumber": "+1-555-0102",
  "workedHours": 0,
  "salaryPerHour": 25
}
```

> Creating an employee also creates a linked **User** account in a single MongoDB transaction. If either fails, both are rolled back.

#### PATCH `/employees/:id/worked-hours`

```json
{
  "workedHours": 8
}
```

Valid roles: `admin` | `chef` | `waiter`

---

## 🗃 Models

### User

| Field      | Type   | Notes                         |
| ---------- | ------ | ----------------------------- |
| `name`     | String | 2–30 chars                    |
| `email`    | String | Unique                        |
| `password` | String | Hashed with bcrypt (salt 12)  |
| `role`     | String | `admin` \| `waiter` \| `chef` |

### Employee

| Field           | Type    | Notes                         |
| --------------- | ------- | ----------------------------- |
| `name`          | String  | 2–100 chars                   |
| `role`          | String  | `admin` \| `chef` \| `waiter` |
| `phoneNumber`   | String  | International format          |
| `email`         | String  | Unique                        |
| `salaryPerHour` | Number  | ≥ 0                           |
| `workedHours`   | Number  | Default 0                     |
| `totalSalary`   | Virtual | `salaryPerHour × workedHours` |

### Order

| Field         | Type     | Notes                                           |
| ------------- | -------- | ----------------------------------------------- |
| `orderNumber` | Number   | Auto-incremented via Counter                    |
| `tableId`     | ObjectId | Ref → Table                                     |
| `items`       | Array    | `[{ menuItemId, quantity }]`                    |
| `note`        | String   | Max 500 chars                                   |
| `status`      | String   | `Pending` \| `Preparing` \| `Ready` \| `Served` |
| `totalPrice`  | Number   | Calculated on creation                          |

### MenuItem

| Field         | Type    | Notes                          |
| ------------- | ------- | ------------------------------ |
| `name`        | String  | Unique                         |
| `price`       | Number  | ≥ 0                            |
| `category`    | String  | Required                       |
| `image`       | String  | URL                            |
| `recipe`      | String  | Description                    |
| `isAvailable` | Boolean | Default true                   |
| `ingredients` | Array   | `[{ ingredientId, quantity }]` |

### Inventory

| Field            | Type    | Notes                                     |
| ---------------- | ------- | ----------------------------------------- |
| `ingredientName` | String  | Unique                                    |
| `quantity`       | Number  | ≥ 0                                       |
| `unit`           | String  | `kg` \| `g` \| `liter` \| `ml` \| `piece` |
| `minThreshold`   | Number  | Low stock trigger                         |
| `costPerUnit`    | Number  | ≥ 0                                       |
| `supplier`       | String  | Default "Unknown"                         |
| `isLowStock`     | Virtual | `quantity ≤ minThreshold`                 |

### Table

| Field      | Type   | Notes                              |
| ---------- | ------ | ---------------------------------- |
| `number`   | Number | Unique, ≥ 1                        |
| `capacity` | Number | ≥ 1                                |
| `status`   | String | `Free` \| `Occupied` \| `Reserved` |

---

## 📦 Response Format

All endpoints use a unified response shape from `utils/response.js`:

### Success

```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": [ ... ],
  "error": null
}
```

### Error

```json
{
  "success": false,
  "message": "Employee not found",
  "data": null,
  "error": {
    "code": 404,
    "details": null
  }
}
```

---

## 👥 Role Permissions

| Resource                  | Admin | Chef | Waiter |
| ------------------------- | ----- | ---- | ------ |
| Dashboard                 | ✅    | ✅   | ✅     |
| Orders — view             | ✅    | ✅   | ✅     |
| Orders — create           | ✅    | ❌   | ✅     |
| Orders — update status    | ✅    | ✅   | ✅     |
| Menu — view               | ✅    | ✅   | ✅     |
| Menu — create/edit/delete | ✅    | ❌   | ❌     |
| Tables — view/update      | ✅    | ❌   | ✅     |
| Tables — create/delete    | ✅    | ❌   | ❌     |
| Inventory — all           | ✅    | ✅   | ❌     |
| Employees — all           | ✅    | ❌   | ❌     |

---

## 📦 Available Scripts

| Script        | Description                     |
| ------------- | ------------------------------- |
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start`   | Start in production mode        |
