import express from "express";
import { getAllOrders, createOrder, updateOrderStatus } from "../controllers/orderController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Orders require authentication
// Waiters and chefs can create/get orders, admin can do everything
router.get("/", authenticate, requireRole("waiter", "chef", "admin"), getAllOrders);
router.post("/", authenticate, requireRole("waiter", "chef", "admin"), createOrder);
router.put("/:id/status", authenticate, requireRole("chef", "admin"), updateOrderStatus);

export default router;

