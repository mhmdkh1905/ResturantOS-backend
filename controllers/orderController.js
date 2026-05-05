import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Table from "../models/tablesModel.js";
import MenuItem from "../models/menuModel.js";
import Inventory from "../models/inventoryModel.js";
import Counter from "../models/counterModel.js";

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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { tableId, items, note } = req.body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Table ID and items array are required");
    }

    const table = await Table.findById(tableId).session(session);
    if (!table) {
      throw new Error("Table not found");
    }

    let totalPrice = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!item.menuItemId || !Number.isFinite(quantity) || quantity < 1) {
        throw new Error(
          "Each order item needs a menuItemId and quantity of at least 1",
        );
      }

      const menuItem = await MenuItem.findById(item.menuItemId).session(
        session,
      );

      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      if (!menuItem.ingredients || menuItem.ingredients.length === 0) {
        throw new Error(
          `Menu item "${menuItem.name}" has no ingredients configured`,
        );
      }

      totalPrice += menuItem.price * quantity;

      for (const ing of menuItem.ingredients) {
        const requiredQty = ing.quantity * quantity;

        const updated = await Inventory.findOneAndUpdate(
          {
            _id: ing.ingredientId,
            quantity: { $gte: requiredQty },
          },
          {
            $inc: { quantity: -requiredQty },
          },
          {
            new: true,
            session,
          },
        );

        if (!updated) {
          throw new Error("Not enough stock for ingredient");
        }
      }
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "order" },
      { $inc: { value: 1 } },
      { new: true, upsert: true, session },
    );

    const newOrder = new Order({
      orderNumber: counter.value,
      tableId,
      items,
      note,
      totalPrice,
    });

    const savedOrder = await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    await savedOrder.populate("tableId", "tableNumber status");
    await savedOrder.populate("items.menuItemId", "name price category");

    res.status(201).json(savedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      message: error.message,
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

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
