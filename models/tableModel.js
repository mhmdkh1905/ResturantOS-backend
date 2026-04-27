import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, "Table number is required"],
    unique: true,
    min: [1, "Table number must be positive"]
  },
  status: {
    type: String,
    enum: ["Free", "Reserved", "Occupied"],
    default: "Free"
  },
  seatsNumber: {
    type: Number,
    required: [true, "Seats number is required"],
    min: [1, "Seats must be at least 1"]
  }
}, {
  timestamps: true
});

const Table = mongoose.model("Table", tableSchema);

export default Table;

