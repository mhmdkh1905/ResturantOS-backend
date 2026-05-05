import express from "express";
import {
  getAllMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import {
  authinticateUser,
  requireTwoRoles,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMenu);
router.get(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  getMenuById,
);
router.post("/", authinticateUser, requireAdmin("admin"), createMenuItem);
router.put("/:id", authinticateUser, requireAdmin("admin"), updateMenuItem);
router.delete("/:id", authinticateUser, requireAdmin("admin"), deleteMenuItem);

export default router;
