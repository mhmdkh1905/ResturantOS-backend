import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Free", "Occupied", "Reserved"],
      default: "Free",
    },
  },
  {
    timestamps: true,
  },
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
