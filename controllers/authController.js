import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../utils/response.js";

export const registerUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { name, email, password, role } = req.body;

    const userCount = await User.countDocuments();

    let finalRole;

    if (userCount === 0) {
      finalRole = "admin";
    } else {
      if (!req.user || req.user.role !== "admin") {
        return errorResponse(res, "Only admin can create users", 403);
      }

      const allowedRoles = ["waiter", "chef"];

      if (!allowedRoles.includes(role)) {
        return errorResponse(res, "Invalid role", 400);
      }

      finalRole = role;
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: finalRole,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return successResponse(res, "User created successfully", {
      user: newUser,
      token,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, "User is not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return successResponse(res, "Login successfully", {
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
