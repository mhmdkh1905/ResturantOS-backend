import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Menu item name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    recipe: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ingredients: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity must be positive"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
