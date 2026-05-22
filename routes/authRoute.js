import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/create-user", authenticateUser, registerUser);
router.post("/login", loginUser);

export default router;
