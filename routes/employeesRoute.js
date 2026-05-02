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
import { authinticateUser, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authinticateUser, requireAdmin("admin"), getAllEmployees);

router.get("/:id", authinticateUser, requireAdmin("admin"), getEmployeeById);

router.get(
  "/name/:name",
  authinticateUser,
  requireAdmin("admin"),
  getEmployeeByName,
);

router.get(
  "/:id/total-salary",
  authinticateUser,
  requireAdmin("admin"),
  getEmployeeTotalSalary,
);

router.post("/", authinticateUser, requireAdmin("admin"), createEmployee);

router.put("/:id", authinticateUser, requireAdmin("admin"), updateEmployee);

router.patch(
  "/:id/worked-hours",
  authinticateUser,
  requireAdmin("admin"),
  updateEmployeeWorkedHours,
);

router.patch(
  "/:id/salary",
  authinticateUser,
  requireAdmin("admin"),
  updateEmployeeSalary,
);

router.patch(
  "/reset-worked-hours/:id",
  authinticateUser,
  requireAdmin("admin"),
  resetEmployeeWorkedHours,
);

router.patch(
  "/reset-worked-hours",
  authinticateUser,
  requireAdmin("admin"),
  resetAllEmployeesWorkedHours,
);

router.delete("/:id", authinticateUser, requireAdmin("admin"), deleteEmployee);

export default router;
