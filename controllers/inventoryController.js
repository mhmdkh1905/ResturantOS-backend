import mongoose from "mongoose";
import Inventory from "../models/inventoryModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().sort({ createdAt: -1 });
    return successResponse(
      res,
      "Inventory items fetched successfully",
      inventoryItems,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      return errorResponse(res, "Inventory item not found", 404);
    }

    return successResponse(
      res,
      "Inventory item fetched successfully",
      inventoryItem,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
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
      return errorResponse(res, "Ingredient already exists", 400);
    }

    const newInventoryItem = await Inventory.create({
      ingredientName,
      quantity,
      unit,
      minThreshold,
      costPerUnit,
      supplier,
    });

    return successResponse(
      res,
      "Inventory item created successfully",
      newInventoryItem,
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, "Ingredient already exists", 400, {
        field: "ingredientName",
        value: req.body.ingredientName,
      });
    }
    return errorResponse(res, error.message, 400);
  }
};

export const updateInventoryItem = async (req, res) => {
  console.error("Update Inventory Item - Request Body:", req.params, req.body);
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined),
    );

    const inventoryItem = await Inventory.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!inventoryItem) {
      return errorResponse(res, "Inventory item not found", 404);
    }

    return successResponse(
      res,
      "Inventory item updated successfully",
      inventoryItem,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const inventoryItem = await Inventory.findByIdAndDelete(id);

    if (!inventoryItem) {
      return errorResponse(res, "Inventory item not found", 404);
    }

    return successResponse(
      res,
      "Inventory item deleted successfully",
      inventoryItem,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
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
      return errorResponse(res, "Inventory item not found", 404);
    }

    return successResponse(
      res,
      "Inventory item fetched successfully",
      inventoryItem,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
