import express from "express";

import {
  getAllInventory,
  getInventoryById,
  getInventoryByName,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { authinticateUser, requireTwoRoles } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  getAllInventory,
);

router.get(
  "/name/:ingredientName",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  getInventoryByName,
);

router.get(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  getInventoryById,
);

router.post(
  "/",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  createInventoryItem,
);

router.put(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  updateInventoryItem,
);

router.delete(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "chef"),
  deleteInventoryItem,
);

export default router;
