import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "Table number is required"],
    unique: true,
    min: [1, "Table number must be at least 1"],
  },
  capacity: {
    type: Number,
    required: [true, "Table capacity is required"],
    min: [1, "Table capacity must be at least 1"],
  },
  status: {
    type: String,
    enum: {
      values: ["Free", "Occupied", "Reserved"],
      message: "Status must be one of: Free, Occupied, Reserved",
    },
    default: "Free",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Table = mongoose.model("Table", tableSchema);

export default Table;
