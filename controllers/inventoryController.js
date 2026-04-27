import Product from "../models/productsModel.js";

export const getInventory = async (req, res) => {
  try {
    const products = await Product.find().select("name price size inStock createdAt");
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Product.find({ inStock: false });
    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch low stock items",
      error: error.message,
    });
  }
};
