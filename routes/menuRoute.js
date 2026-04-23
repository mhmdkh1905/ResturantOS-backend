import express from "express";
import {
  getAllMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getAllMenu);
router.get("/:id", getMenuById);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;

