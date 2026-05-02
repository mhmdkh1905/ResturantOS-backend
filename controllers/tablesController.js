import mongoose from "mongoose";
import Table from "../models/tablesModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    return successResponse(res, "Tables fetched successfully", tables);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const table = await Table.findById(id);

    if (!table) {
      return errorResponse(res, "Table not found", 404);
    }

    return successResponse(res, "Table fetched successfully", table);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    const newTable = await Table.create({
      number,
      capacity,
    });

    return successResponse(res, "Table created successfully", newTable);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, "Table number already exists", 400, {
        field: "number",
        value: req.body.number,
      });
    }
    return errorResponse(res, error.message, 500);
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTable) {
      return errorResponse(res, "Table not found", 404);
    }

    return successResponse(res, "Table updated successfully", updatedTable);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    if (!["Free", "Occupied", "Reserved"].includes(status)) {
      return errorResponse(res, "Invalid status value", 400);
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { status },
{ returnDocument: 'after' }
    );

    if (!updatedTable) {
      return errorResponse(res, "Table not found", 404);
    }

    return successResponse(
      res,
      "Table status updated successfully",
      updatedTable,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return errorResponse(res, "Table not found", 404);
    }

    return successResponse(res, "Table deleted successfully", deletedTable);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
