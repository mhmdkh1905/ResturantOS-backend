import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByName,
  updateEmployeeWorkedHours,
  updateEmployeeSalary,
  resetEmployeeWorkedHours,
  resetAllEmployeesWorkedHours,
  getEmployeeTotalSalary,
} from "../controllers/employeesController.js";

const router = express.Router();

router.get("/", getAllEmployees);

router.get("/:id", getEmployeeById);

router.get("/name/:name", getEmployeeByName);

router.get("/:id/total-salary", getEmployeeTotalSalary);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

router.patch("/:id/worked-hours", updateEmployeeWorkedHours);

router.patch("/:id/salary", updateEmployeeSalary);

router.patch("/reset-worked-hours/:id", resetEmployeeWorkedHours);

router.patch("/reset-worked-hours", resetAllEmployeesWorkedHours);

router.delete("/:id", deleteEmployee);

export default router;
