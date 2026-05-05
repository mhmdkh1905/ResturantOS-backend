import MenuItem from "../models/menuModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate("ingredients.ingredientId")
      .sort({ category: 1, name: 1 });
    successResponse(res, "Menu items fetched successfully", menuItems);
  } catch (error) {
    errorResponse(res, "Internal server error", 500, error.message);
  }
};

export const getMenuById = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findById(menuItemId).populate(
      "ingredients.ingredientId",
    );
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
    const { name, price, category, image, recipe, isAvailable, ingredients } =
      req.body;
    if (name && price && category) {
      const newMenuItem = new MenuItem({
        name,
        price,
        category,
        image,
        recipe,
        isAvailable,
        ingredients,
      });

      const savedMenuItem = await newMenuItem.save();
      successResponse(res, "Menu item created successfully", savedMenuItem);
    } else {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }
  } catch (error) {
    console.error("Create menu error:", error); // Log for debugging
    if (error.name === "ValidationError") {
      errorResponse(res, "Validation failed", 400, error.message);
    } else if (error.code === 11000) {
      
      errorResponse(res, "Menu item name must be unique", 409, error.message);
    } else {
      errorResponse(res, "Internal server error", 500, error.message);
    }
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const { name, price, category, image, recipe, ingredients } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (recipe !== undefined) updateData.recipe = recipe;

    if (ingredients !== undefined) {
      if (!Array.isArray(ingredients)) {
        return res.status(400).json({
          message: "Ingredients must be an array",
        });
      }

      updateData.ingredients = ingredients;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(menuItemId, updateData, {
      new: true,
      runValidators: true,
    });

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
