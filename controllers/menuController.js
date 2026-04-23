import MenuItem from "../models/menuModel.js";

export const getAllMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getMenuById = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findById(menuItemId);
    if (menuItem) {
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, category, image, recipe } = req.body;
    if (name && price && category) {
      const newMenuItem = new MenuItem({ name, price, category, image, recipe });
      const savedMenuItem = await newMenuItem.save();
      res.status(201).json(savedMenuItem);
    } else {
      return res.status(400).json({ message: "Name, price and category are required" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const { name, price, category, image, recipe } = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      { name, price, category, image, recipe },
      { new: true, runValidators: true }
    );
    if (menuItem) {
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findByIdAndDelete(menuItemId);
    if (menuItem) {
      res.status(200).json({ message: "Menu item deleted" });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

