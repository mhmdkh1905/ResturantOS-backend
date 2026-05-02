import MenuItem from "../models/menuModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    successResponse(res, "Menu items fetched successfully", menuItems);
  } catch (error) {
    errorResponse(res, "Internal server error", 500, error.message);
  }
};

export const getMenuById = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findById(menuItemId);
    if (menuItem) {
      successResponse(res, "Menu item fetched successfully", menuItem);
    } else {
      errorResponse(res, "Menu item not found", 404);
    }
  } catch (error) {
    errorResponse(res, "Internal server error", 500, error.message);
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, category, image, recipe } = req.body;
    if (name && price && category) {
      const newMenuItem = new MenuItem({
        name,
        price,
        category,
        image,
        recipe,
      });

      const savedMenuItem = await newMenuItem.save();
      successResponse(res, "Menu item created successfully", savedMenuItem);
    } else {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }
  } catch (error) {
    console.error('Create menu error:', error); // Log for debugging
    if (error.name === 'ValidationError') {
      errorResponse(res, 'Validation failed', 400, error.message);
    } else if (error.code === 11000) { // Duplicate key
      errorResponse(res, 'Menu item name must be unique', 409, error.message);
    } else {
      errorResponse(res, 'Internal server error', 500, error.message);
    }
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const { name, price, category, image, recipe } = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      { name, price, category, image, recipe },
{ returnDocument: 'after', runValidators: true }
    );
    if (menuItem) {
      successResponse(res, "Menu item updated successfully", menuItem);
    } else {
      errorResponse(res, "Menu item not found", 404);
    }
  } catch (error) {
    errorResponse(res, "Internal server error", 500, error.message);
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findByIdAndDelete(menuItemId);
    if (menuItem) {
      successResponse(res, "Menu item deleted successfully", menuItem);
    } else {
      errorResponse(res, "Menu item not found", 404);
    }
  } catch (error) {
    errorResponse(res, "Internal server error", 500, error.message);
  }
};
