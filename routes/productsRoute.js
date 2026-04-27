import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", authenticate, requireRole("admin"), createProduct);

router.put("/:id", authenticate, requireRole("admin"), updateProduct);

router.delete("/:id", authenticate, requireRole("admin"), deleteProduct);

export default router;
