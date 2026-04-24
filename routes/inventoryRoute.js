import express from "express";

import {
  getAllInventory,
  getInventoryById,
  getInventoryByName,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", getAllInventory);

router.get("/name/:ingredientName", getInventoryByName);

router.get("/:id", getInventoryById);

router.post("/", createInventoryItem);

router.put("/:id", updateInventoryItem);

router.delete("/:id", deleteInventoryItem);

export default router;
