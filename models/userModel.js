import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be less than 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    enum: ["waiter", "chef", "admin"],
    default: "waiter"
  },
  salaryPerHour: {
    type: Number,
    default: 0,
    min: [0, "Salary cannot be negative"]
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;

