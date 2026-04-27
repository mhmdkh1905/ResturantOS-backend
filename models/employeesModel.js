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

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Phone number must be a valid international format",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

employeeSchema.virtual("totalSalary").get(function () {
  return this.salaryPerHour * this.workedHours;
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
