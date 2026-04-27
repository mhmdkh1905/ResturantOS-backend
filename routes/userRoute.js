import express from "express";
import { createUser } from "../controllers/userController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can create users directly through /users endpoint
router.post("/", authenticate, requireRole("admin"), createUser);

export default router;

