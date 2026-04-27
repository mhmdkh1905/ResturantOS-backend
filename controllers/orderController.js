import Order from "../models/orderModel.js";
import Table from "../models/tablesModel.js";
import MenuItem from "../models/menuModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("tableId", "tableNumber status")
      .populate("items.menuItemId", "name price category")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Table ID and items array are required" });
    }

    // Validate table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Calculate total and validate items
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res
          .status(404)
          .json({ message: `Menu item ${item.menuItemId} not found` });
      }
      totalPrice += menuItem.price * item.quantity;
    }

    const newOrder = new Order({
      tableId,
      items,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    await savedOrder.populate("tableId", "tableNumber status");
    await savedOrder.populate("items.menuItemId", "name price category");

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!["Pending", "Preparing", "Ready", "Served"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    )
      .populate("tableId", "tableNumber status")
      .populate("items.menuItemId", "name price category");

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
