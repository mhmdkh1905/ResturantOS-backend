import express from "express";
import { getAllMenu, getMenuById, createMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public can view menu, but modifications require admin/chef
router.get("/", getAllMenu);
router.get("/:id", getMenuById);
router.post("/", authenticate, requireRole("admin", "chef"), createMenuItem);
router.put("/:id", authenticate, requireRole("admin", "chef"), updateMenuItem);
router.delete("/:id", authenticate, requireRole("admin"), deleteMenuItem);

export default router;

