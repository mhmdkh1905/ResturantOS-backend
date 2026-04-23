import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

