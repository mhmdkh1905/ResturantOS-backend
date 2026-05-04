import mongoose from "mongoose";
import Employee from "../models/employeesModel.js";
import User from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return successResponse(res, "Employees fetched successfully", employees);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedEmployee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(
      res,
      "Employee updated successfully",
      updatedEmployee,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(res, "Employee deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getEmployeeByName = async (req, res) => {
  try {
    const { name } = req.params;

    const employee = await Employee.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateEmployeeWorkedHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { workedHours } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    if (typeof workedHours !== "number" || workedHours < 0) {
      return errorResponse(
        res,
        "Worked hours must be a non-negative number",
        400,
      );
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    employee.workedHours += workedHours;
    await employee.save();

    return successResponse(res, "Worked hours updated", employee);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateEmployeeSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { salaryPerHour } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    if (typeof salaryPerHour !== "number" || salaryPerHour < 0) {
      return errorResponse(res, "Salary must be a non-negative number", 400);
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    employee.salaryPerHour = salaryPerHour;
    await employee.save();

    return successResponse(res, "Salary updated", employee);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const resetEmployeeWorkedHours = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    employee.workedHours = 0;
    await employee.save();

    return successResponse(res, "Worked hours reset", employee);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const resetAllEmployeesWorkedHours = async (req, res) => {
  try {
    await Employee.updateMany({}, { workedHours: 0 });
    const employees = await Employee.find().sort({ createdAt: -1 });

    return successResponse(res, "All employees hours reset", employees);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getEmployeeTotalSalary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid ID", 400);
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(res, "Total salary fetched", {
      totalSalary: employee.totalSalary,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      workedHours,
      salaryPerHour,
    } = req.body;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create(
      [
        {
          name,
          email,
          password,
          role: role.toLowerCase(),
        },
      ],
      { session },
    );

    const employee = await Employee.create(
      [
        {
          name,
          email,
          phoneNumber,
          role,
          workedHours,
          salaryPerHour,
          userId: user[0]._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Employee created successfully",
      employee: employee[0],
      user: user[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: error.message });
  }
};
