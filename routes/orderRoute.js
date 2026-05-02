import express from "express";
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authinticateUser, requireTwoRoles } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authinticateUser, getAllOrders);
router.post(
  "/",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  createOrder,
);
router.put("/:id/status", authinticateUser, updateOrderStatus);

export default router;
