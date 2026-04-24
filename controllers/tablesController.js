import mongoose from "mongoose";
import Table from "../models/tablesModel.js";

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    const newTable = await Table.create({
      number,
      capacity,
    });

    res.status(201).json({ success: true, data: newTable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ success: true, data: updatedTable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!["Free", "Occupied", "Reserved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ success: true, data: updatedTable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
