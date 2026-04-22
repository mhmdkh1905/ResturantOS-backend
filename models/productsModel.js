import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlenght: [100, "Product name must be less than 100 characters"],
    minlenght: [2, "Product name must be at least 2 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price must be a positive number"],
  },
  size: {
    type: String,
    required: [true, "Product size is required"],
    enum: ["S", "M", "L", "XL"],
    uppercase: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
