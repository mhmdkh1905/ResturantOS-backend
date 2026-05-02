import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authinticateUser } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/create-user", authinticateUser, registerUser);
router.post("/login", loginUser);

export default router;
