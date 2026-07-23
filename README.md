# 🍽️ RestaurantOS — Backend

A RESTful API for the RestaurantOS restaurant management platform, built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

The backend handles authentication, role-based authorization, orders, menu items, inventory, employees, tables, dashboard statistics, and communication with the RestaurantOS frontend.

[![Frontend Demo](https://img.shields.io/badge/Frontend%20Demo-22c55e?style=for-the-badge)](https://resturant-os-frontend-mu.vercel.app/)

[![Frontend Repository](https://img.shields.io/badge/Frontend%20Repository-181717?style=for-the-badge\&logo=github)](https://github.com/mhmdkh1905/ResturantOS-frontend)

---

## Overview

RestaurantOS is a full-stack restaurant management system designed to support daily restaurant operations through one centralized platform.

The backend exposes REST API endpoints for:

* User registration and login
* JWT-based authentication
* Role-based authorization
* Order creation and status management
* Automatic inventory deduction
* Menu management
* Table management
* Employee and salary tracking
* Inventory and low-stock monitoring
* Dashboard statistics
* Standardized API responses

The API supports multiple restaurant roles, including administrators, chefs, and waiters.

---

## Table of Contents

* [Overview](#overview)
* [Main Features](#main-features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [My Contribution](#my-contribution)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Authentication](#authentication)
* [Role Permissions](#role-permissions)
* [API Reference](#api-reference)

  * [Authentication](#authentication-endpoints)
  * [Dashboard](#dashboard)
  * [Orders](#orders)
  * [Menu](#menu)
  * [Tables](#tables)
  * [Inventory](#inventory)
  * [Employees](#employees)
* [Data Models](#data-models)
* [Response Format](#response-format)
* [Available Scripts](#available-scripts)
* [Security Notes](#security-notes)
* [Future Improvements](#future-improvements)
* [Related Repository](#related-repository)
* [Author](#author)

---

## Main Features

### Authentication and Authorization

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected API endpoints
* Role-based access control
* Administrative user creation

### Order Management

* Create restaurant orders
* Retrieve all orders
* Update order statuses
* Generate automatic order numbers
* Calculate order totals
* Associate orders with restaurant tables
* Deduct recipe ingredients from inventory
* Use MongoDB transactions for order-related operations

### Menu Management

* Create menu items
* Update existing menu items
* Delete menu items
* Retrieve menu items
* Store categories, prices, recipes, images, and availability
* Connect menu items to inventory ingredients

### Inventory Management

* Create and update inventory records
* Search inventory by name
* Track quantities and units
* Define low-stock thresholds
* Store supplier and cost information
* Automatically identify low-stock items

### Table Management

* Create restaurant tables
* Update table capacity
* Change table status
* Delete tables
* Track free, occupied, and reserved tables

### Employee Management

* Create employee records
* Create linked user accounts
* Update employee information
* Track worked hours
* Store salary per hour
* Calculate total salary
* Reset employee worked hours
* Restrict employee management to administrators

### Dashboard

* Total order count
* Daily income
* Active order count
* Low-stock count
* Weekly revenue
* Recent orders

---

## Technology Stack

| Technology      | Purpose                      |
| --------------- | ---------------------------- |
| Node.js         | JavaScript runtime           |
| Express.js      | Backend web framework        |
| MongoDB         | NoSQL database               |
| Mongoose        | MongoDB object data modeling |
| JSON Web Tokens | Authentication               |
| bcryptjs        | Password hashing             |
| Morgan          | HTTP request logging         |
| Nodemon         | Development server reload    |

---

## Project Structure

```text
backend/
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── employeesController.js
│   ├── inventoryController.js
│   ├── menuController.js
│   ├── orderController.js
│   └── tablesController.js
├── middleware/
│   ├── auth.js
│   └── logger.js
├── models/
│   ├── counterModel.js
│   ├── employeesModel.js
│   ├── inventoryModel.js
│   ├── menuModel.js
│   ├── orderModel.js
│   ├── tablesModel.js
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── employeesRoutes.js
│   ├── inventoryRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── tablesRoutes.js
├── utils/
│   └── response.js
├── .env
├── package.json
└── server.js
```

---

## My Contribution

RestaurantOS was developed as a team project. My backend contributions included:

* Building REST API endpoints using Node.js and Express.js
* Creating MongoDB schemas and Mongoose models
* Implementing JWT authentication
* Adding role-based authorization middleware
* Developing order, menu, inventory, employee, and table workflows
* Implementing automatic inventory deduction when orders are created
* Using MongoDB transactions for related database operations
* Creating unified success and error response helpers
* Connecting backend functionality with the frontend application
* Debugging API, authentication, and database integration issues

> Keep only the items that accurately describe your personal contribution.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18 or newer
* npm
* MongoDB or MongoDB Atlas

### Clone the Repository

```bash
git clone https://github.com/mhmdkh1905/ResturantOS-backend.git
cd ResturantOS-backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root.

```bash
cp .env.example .env
```

Add the required environment variables:

```env
PORT=3000
JWT_SECRET=replace_with_a_secure_secret
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resturantOS
```

### Start the Development Server

```bash
npm run dev
```

### Start the Production Server

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

The base API URL is:

```text
http://localhost:3000/api
```

---

## Environment Variables

| Variable      | Required | Description                                 |
| ------------- | -------: | ------------------------------------------- |
| `PORT`        |       No | Port used by the server. Defaults to `3000` |
| `JWT_SECRET`  |      Yes | Secret key used to sign JWT tokens          |
| `MONGODB_URI` |      Yes | MongoDB connection string                   |

Example:

```env
PORT=3000
JWT_SECRET=replace_with_a_long_random_secret
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resturantOS
```

> Never commit your `.env` file, database credentials, JWT secret, or production tokens.

---

## Authentication

The API uses JWT Bearer tokens.

After login, include the token in the `Authorization` header of protected requests:

```text
Authorization: Bearer <jwt_token>
```

Tokens are returned by:

```text
POST /api/auth/login
```

### Authentication Middleware

| Middleware                      | Description                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| `authenticateUser`              | Verifies the JWT and attaches the authenticated user to `req.user` |
| `requireAdmin(role)`            | Allows access to one specific role                                 |
| `requireTwoRoles(role1, role2)` | Allows access to either of two roles                               |

> Confirm that the actual middleware function is named `authenticateUser`. If the code still uses `authinticateUser`, update the README to match the code or correct the spelling in the implementation.

---

## Role Permissions

| Resource                           | Admin | Chef | Waiter |
| ---------------------------------- | ----: | ---: | -----: |
| Dashboard                          |     ✅ |    ✅ |      ✅ |
| View orders                        |     ✅ |    ✅ |      ✅ |
| Create orders                      |     ✅ |    ❌ |      ✅ |
| Update order status                |     ✅ |    ✅ |      ✅ |
| View menu                          |     ✅ |    ✅ |      ✅ |
| Create, edit, or delete menu items |     ✅ |    ❌ |      ❌ |
| View or update tables              |     ✅ |    ❌ |      ✅ |
| Create or delete tables            |     ✅ |    ❌ |      ❌ |
| Manage inventory                   |     ✅ |    ✅ |      ❌ |
| Manage employees                   |     ✅ |    ❌ |      ❌ |

---

# API Reference

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

Authentication required: No

Example request:

```json
{
  "name": "Ahmad Hassan",
  "email": "ahmad@restaurant.com",
  "password": "ExamplePassword123!",
  "role": "admin"
}
```

### Login

```http
POST /api/auth/login
```

Authentication required: No

Example request:

```json
{
  "email": "ahmad@restaurant.com",
  "password": "ExamplePassword123!"
}
```

Example response:

```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "name": "Ahmad Hassan",
    "role": "admin"
  }
}
```

### Create User

```http
POST /api/auth/create-user
```

Authentication required: Yes

Required role: Admin

---

## Dashboard

### Get Dashboard Statistics

```http
GET /api/dashboard
```

Example response data:

```json
{
  "totalOrders": 42,
  "todayIncome": 389.5,
  "activeOrders": 3,
  "lowStock": 1,
  "weeklyRevenue": [
    {
      "day": "Mon",
      "revenue": 120
    },
    {
      "day": "Tue",
      "revenue": 95
    }
  ],
  "recentOrders": [
    {
      "id": "#12",
      "table": 3,
      "status": "Ready",
      "total": 28.98
    }
  ]
}
```

> The original documentation marked this endpoint as public. Confirm the backend implementation. Restaurant dashboard statistics should normally require authentication.

---

## Orders

| Method | Endpoint                 | Roles                   | Description         |
| ------ | ------------------------ | ----------------------- | ------------------- |
| `GET`  | `/api/orders`            | All authenticated users | Get all orders      |
| `POST` | `/api/orders`            | Admin, Waiter           | Create a new order  |
| `PUT`  | `/api/orders/:id/status` | All authenticated users | Update order status |

### Create Order

```http
POST /api/orders
```

Example request:

```json
{
  "tableId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "items": [
    {
      "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "quantity": 2
    },
    {
      "menuItemId": "64f1a2b3c4d5e6f7a8b9c0d3",
      "quantity": 1
    }
  ],
  "note": "No onions please"
}
```

Creating an order automatically deducts recipe ingredients from inventory using a MongoDB transaction.

### Update Order Status

```http
PUT /api/orders/:id/status
```

Example request:

```json
{
  "status": "Preparing"
}
```

Valid statuses:

```text
Pending → Preparing → Ready → Served
```

---

## Menu

| Method   | Endpoint        | Roles         | Description        |
| -------- | --------------- | ------------- | ------------------ |
| `GET`    | `/api/menu`     | Public        | Get all menu items |
| `GET`    | `/api/menu/:id` | Admin, Waiter | Get one menu item  |
| `POST`   | `/api/menu`     | Admin         | Create a menu item |
| `PUT`    | `/api/menu/:id` | Admin         | Update a menu item |
| `DELETE` | `/api/menu/:id` | Admin         | Delete a menu item |

### Create Menu Item

```http
POST /api/menu
```

Example request:

```json
{
  "name": "Margherita Pizza",
  "price": 12.99,
  "category": "Main Course",
  "image": "https://example.com/pizza.jpg",
  "recipe": "Classic Italian pizza with tomato and mozzarella",
  "isAvailable": true,
  "ingredients": [
    {
      "ingredientId": "64f1a2b3c4d5e6f7a8b9c0d4",
      "quantity": 0.2
    }
  ]
}
```

---

## Tables

| Method   | Endpoint                 | Roles         | Description         |
| -------- | ------------------------ | ------------- | ------------------- |
| `GET`    | `/api/tables`            | Admin, Waiter | Get all tables      |
| `GET`    | `/api/tables/:id`        | Admin, Waiter | Get one table       |
| `POST`   | `/api/tables`            | Admin         | Create a table      |
| `PUT`    | `/api/tables/:id`        | Admin, Waiter | Update a table      |
| `PATCH`  | `/api/tables/:id/status` | Admin, Waiter | Update table status |
| `DELETE` | `/api/tables/:id`        | Admin         | Delete a table      |

### Create Table

```http
POST /api/tables
```

Example request:

```json
{
  "number": 5,
  "capacity": 4
}
```

### Update Table Status

```http
PATCH /api/tables/:id/status
```

Example request:

```json
{
  "status": "Occupied"
}
```

Valid statuses:

```text
Free | Occupied | Reserved
```

---

## Inventory

| Method   | Endpoint                    | Roles       | Description              |
| -------- | --------------------------- | ----------- | ------------------------ |
| `GET`    | `/api/inventory`            | Admin, Chef | Get all inventory items  |
| `GET`    | `/api/inventory/:id`        | Admin, Chef | Get one inventory item   |
| `GET`    | `/api/inventory/name/:name` | Admin, Chef | Search inventory by name |
| `POST`   | `/api/inventory`            | Admin, Chef | Create an inventory item |
| `PUT`    | `/api/inventory/:id`        | Admin, Chef | Update an inventory item |
| `DELETE` | `/api/inventory/:id`        | Admin, Chef | Delete an inventory item |

### Create Inventory Item

```http
POST /api/inventory
```

Example request:

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

Valid units:

```text
kg | g | liter | ml | piece
```

An inventory item is considered low stock when:

```text
quantity ≤ minThreshold
```

The model exposes this result through the virtual `isLowStock` field.

---

## Employees

| Method   | Endpoint                                | Role  | Description                      |
| -------- | --------------------------------------- | ----- | -------------------------------- |
| `GET`    | `/api/employees`                        | Admin | Get all employees                |
| `GET`    | `/api/employees/:id`                    | Admin | Get one employee                 |
| `GET`    | `/api/employees/name/:name`             | Admin | Search employees by name         |
| `GET`    | `/api/employees/:id/total-salary`       | Admin | Calculate total salary           |
| `POST`   | `/api/employees`                        | Admin | Create employee and user account |
| `PUT`    | `/api/employees/:id`                    | Admin | Update employee                  |
| `PATCH`  | `/api/employees/:id/worked-hours`       | Admin | Add worked hours                 |
| `PATCH`  | `/api/employees/:id/salary`             | Admin | Update salary per hour           |
| `PATCH`  | `/api/employees/reset-worked-hours/:id` | Admin | Reset one employee's hours       |
| `PATCH`  | `/api/employees/reset-worked-hours`     | Admin | Reset all employee hours         |
| `DELETE` | `/api/employees/:id`                    | Admin | Delete employee                  |

### Create Employee

```http
POST /api/employees
```

Example request:

```json
{
  "name": "Maria Garcia",
  "email": "maria@restaurant.com",
  "password": "ExamplePassword123!",
  "role": "chef",
  "phoneNumber": "+1-555-0102",
  "workedHours": 0,
  "salaryPerHour": 25
}
```

Creating an employee also creates a linked user account in one MongoDB transaction. If one operation fails, both operations are rolled back.

### Add Worked Hours

```http
PATCH /api/employees/:id/worked-hours
```

Example request:

```json
{
  "workedHours": 8
}
```

Valid roles:

```text
admin | chef | waiter
```

---

## Data Models

### User

| Field      | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `name`     | String | Between 2 and 30 characters  |
| `email`    | String | Unique email address         |
| `password` | String | Hashed using bcrypt          |
| `role`     | String | `admin`, `waiter`, or `chef` |

### Employee

| Field           | Type    | Description                   |
| --------------- | ------- | ----------------------------- |
| `name`          | String  | Between 2 and 100 characters  |
| `role`          | String  | `admin`, `chef`, or `waiter`  |
| `phoneNumber`   | String  | International phone format    |
| `email`         | String  | Unique email address          |
| `salaryPerHour` | Number  | Must be zero or greater       |
| `workedHours`   | Number  | Defaults to zero              |
| `totalSalary`   | Virtual | `salaryPerHour × workedHours` |

### Order

| Field         | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `orderNumber` | Number   | Automatically incremented                    |
| `tableId`     | ObjectId | References a restaurant table                |
| `items`       | Array    | Contains menu item IDs and quantities        |
| `note`        | String   | Maximum 500 characters                       |
| `status`      | String   | `Pending`, `Preparing`, `Ready`, or `Served` |
| `totalPrice`  | Number   | Calculated when the order is created         |

### Menu Item

| Field         | Type    | Description                            |
| ------------- | ------- | -------------------------------------- |
| `name`        | String  | Unique menu item name                  |
| `price`       | Number  | Must be zero or greater                |
| `category`    | String  | Required category                      |
| `image`       | String  | Image URL                              |
| `recipe`      | String  | Recipe or menu description             |
| `isAvailable` | Boolean | Defaults to true                       |
| `ingredients` | Array   | Ingredient IDs and required quantities |

### Inventory Item

| Field            | Type    | Description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| `ingredientName` | String  | Unique ingredient name                          |
| `quantity`       | Number  | Must be zero or greater                         |
| `unit`           | String  | `kg`, `g`, `liter`, `ml`, or `piece`            |
| `minThreshold`   | Number  | Low-stock threshold                             |
| `costPerUnit`    | Number  | Must be zero or greater                         |
| `supplier`       | String  | Defaults to `Unknown`                           |
| `isLowStock`     | Virtual | Returns whether quantity is below the threshold |

### Table

| Field      | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| `number`   | Number | Unique table number               |
| `capacity` | Number | Must be one or greater            |
| `status`   | String | `Free`, `Occupied`, or `Reserved` |

---

## Response Format

All endpoints use a standardized response structure from `utils/response.js`.

### Success Response

```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": [],
  "error": null
}
```

### Error Response

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

## Available Scripts

### Start Development Server

```bash
npm run dev
```

Starts the API using Nodemon with automatic reload.

### Start Production Server

```bash
npm start
```

Starts the API in production mode.

---

## Security Notes

* Passwords are hashed before being stored.
* Protected routes require JWT authentication.
* Role-based middleware restricts sensitive actions.
* MongoDB transactions are used for linked database operations.
* Environment variables store sensitive configuration.
* Production secrets should never be committed to GitHub.
* JWT secrets should be long, random, and different between environments.
* Database credentials should be rotated if they are accidentally exposed.

---

## Future Improvements

* Add request validation using Joi, Zod, or Express Validator
* Add centralized error-handling middleware
* Add refresh-token authentication
* Add automated API tests
* Add rate limiting
* Add request security using Helmet
* Add API documentation using Swagger or OpenAPI
* Add pagination to large resource lists
* Add structured application logging
* Add password reset and email verification
* Improve audit logging
* Add Docker support
* Add CI checks for linting and tests

---

## Related Repository

The RestaurantOS frontend provides the dashboard and user interface for this API.

* [RestaurantOS Frontend](https://github.com/mhmdkh1905/ResturantOS-frontend)
* [Live Frontend Application](https://resturant-os-frontend-mu.vercel.app/)

---

## Author

**Mohammad Khateeb**

* [GitHub](https://github.com/mhmdkh1905)
* [LinkedIn](https://www.linkedin.com/in/mohammad-khateeb-891332303)
* [Email](mailto:mhmd52kh@gmail.com)
