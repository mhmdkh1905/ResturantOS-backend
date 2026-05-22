import express from "express";
import {
  getAllMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import {
  authenticateUser,
  requireTwoRoles,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMenu);
router.get(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  getMenuById,
);
router.post("/", authenticateUser, requireAdmin("admin"), createMenuItem);
router.put("/:id", authenticateUser, requireAdmin("admin"), updateMenuItem);
router.delete("/:id", authenticateUser, requireAdmin("admin"), deleteMenuItem);

export default router;
