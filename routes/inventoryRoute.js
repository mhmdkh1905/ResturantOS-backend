import express from "express";

import {
  getAllInventory,
  getInventoryById,
  getInventoryByName,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { authenticateUser, requireTwoRoles } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  getAllInventory,
);

router.get(
  "/name/:ingredientName",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  getInventoryByName,
);

router.get(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  getInventoryById,
);

router.post(
  "/",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  createInventoryItem,
);

router.put(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  updateInventoryItem,
);

router.delete(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "chef"),
  deleteInventoryItem,
);

export default router;
