import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["Admin", "Chef", "Waiter"],
        message: "Role must be one of: Admin, Chef, Waiter",
      },
    },

    salaryPerHour: {
      type: Number,
      required: [true, "Salary per hour is required"],
      min: [0, "Salary per hour must be a positive number"],
    },

    workedHours: {
      type: Number,
      default: 0,
      min: [0, "Worked hours must be 0 or more"],
    },
  },
  {
    timestamps: true,
  },
);

const Employee = mongoose.model("Employee", employeeSchema);

employeeSchema.virtual("totalSalary").get(function () {
  return this.salaryPerHour * this.workedHours;
});

export default Employee;
