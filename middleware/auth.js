import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/userModel.js";

export const authinticateUser = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return errorResponse(res, "Access denied. No valid token provided", 401);
    }

    const token = authHeader.substring(7);
    if (!token) {
      return errorResponse(
        res,
        "Access denied. Token missing from Authorization header",
        401,
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name == "TokenExpiredError") {
        return errorResponse(res, "Access denied. Token has expired", 401);
      }
      if (jwtError.name == "JsonWebTokenError") {
        return errorResponse(res, "Access denied. Invalid token", 401);
      }
      return errorResponse(res, "Access denied. Token verfication failed", 401);
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse(
        res,
        "Access denied. User account no longer exist",
        "401",
      );
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    req.tokenData = decoded;

    next();
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};
