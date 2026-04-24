import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    ingredientName: {
      type: String,
      required: [true, "Ingredient name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Ingredient name must be at least 2 characters"],
      maxlength: [100, "Ingredient name must be less than 100 characters"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be a positive number"],
    },

    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: ["kg", "g", "liter", "ml", "piece"],
        message: "Unit must be one of: kg, g, liter, ml, piece",
      },
    },

    minThreshold: {
      type: Number,
      required: [true, "Minimum threshold is required"],
      min: [0, "Minimum threshold must be a positive number"],
    },

    costPerUnit: {
      type: Number,
      required: [true, "Cost per unit is required"],
      min: [0, "Cost per unit must be a positive number"],
    },

    supplier: {
      type: String,
      trim: true,
      minlength: [2, "Supplier name must be at least 2 characters"],
      maxlength: [100, "Supplier name must be less than 100 characters"],
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  },
);

inventorySchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.minThreshold;
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
