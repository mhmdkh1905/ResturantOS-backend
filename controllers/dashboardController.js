import Order from "../models/orderModel.js";
import Inventory from "../models/inventoryModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();

    const todayIncomeAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const todayIncome = todayIncomeAgg[0]?.total || 0;

    const activeOrders = await Order.countDocuments({
      status: { $in: ["Pending", "Preparing", "Ready"] },
    });

    const lowStock = await Inventory.countDocuments({
      $expr: { $lte: ["$quantity", "$minThreshold"] },
    });

    const weeklyRaw = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const daysMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    };

    const weeklyRevenue = Object.values(daysMap).map((day) => {
      const found = weeklyRaw.find((d) => daysMap[d._id] === day);
      return { day, revenue: found?.revenue || 0 };
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("tableId");

    const formattedOrders = recentOrders.map((o) => ({
      id: `#${o.orderNumber}`,
      table: o.tableId?.number || "-",
      status: o.status,
      total: o.totalPrice,
    }));

    res.json({
      success: true,
      data: {
        totalOrders,
        todayIncome,
        activeOrders,
        lowStock,
        weeklyRevenue,
        recentOrders: formattedOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
