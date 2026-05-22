import express from "express";
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticateUser, requireTwoRoles } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authenticateUser, getAllOrders);
router.post(
  "/",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  createOrder,
);
router.put("/:id/status", authenticateUser, updateOrderStatus);

export default router;
