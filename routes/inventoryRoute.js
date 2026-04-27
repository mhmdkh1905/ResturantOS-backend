import express from "express";
import { getInventory, getLowStockItems } from "../controllers/inventoryController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getInventory);
router.get("/low-stock", authenticate, requireRole("admin"), getLowStockItems);

export default router;

