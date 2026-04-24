import mongoose from "mongoose";
import Inventory from "../models/inventoryModel.js";

export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inventoryItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ success: true, data: inventoryItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const { ingredientName, quantity, unit, minThreshold, costPerUnit } =
      req.body;

    const supplier = req.body.supplier || "Unknown";

    const existingItem = await Inventory.findOne({
      ingredientName: { $regex: `^${ingredientName}$`, $options: "i" },
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ success: false, message: "Ingredient already exists" });
    }

    const newInventoryItem = await Inventory.create({
      ingredientName,
      quantity,
      unit,
      minThreshold,
      costPerUnit,
      supplier,
    });

    res.status(201).json({ success: true, data: newInventoryItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined),
    );

    const inventoryItem = await Inventory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ success: true, data: inventoryItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const inventoryItem = await Inventory.findByIdAndDelete(id);

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryByName = async (req, res) => {
  try {
    const { ingredientName } = req.params;

    const safeName = ingredientName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const inventoryItem = await Inventory.findOne({
      ingredientName: { $regex: safeName, $options: "i" },
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ success: true, data: inventoryItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
