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
import { authenticateUser, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, requireAdmin("admin"), getAllEmployees);

router.get("/:id", authenticateUser, requireAdmin("admin"), getEmployeeById);

router.get(
  "/name/:name",
  authenticateUser,
  requireAdmin("admin"),
  getEmployeeByName,
);

router.get(
  "/:id/total-salary",
  authenticateUser,
  requireAdmin("admin"),
  getEmployeeTotalSalary,
);

router.post("/", authenticateUser, requireAdmin("admin"), createEmployee);

router.put("/:id", authenticateUser, requireAdmin("admin"), updateEmployee);

router.patch(
  "/:id/worked-hours",
  authenticateUser,
  requireAdmin("admin"),
  updateEmployeeWorkedHours,
);

router.patch(
  "/:id/salary",
  authenticateUser,
  requireAdmin("admin"),
  updateEmployeeSalary,
);

router.patch(
  "/reset-worked-hours/:id",
  authenticateUser,
  requireAdmin("admin"),
  resetEmployeeWorkedHours,
);

router.patch(
  "/reset-worked-hours",
  authenticateUser,
  requireAdmin("admin"),
  resetAllEmployeesWorkedHours,
);

router.delete("/:id", authenticateUser, requireAdmin("admin"), deleteEmployee);

export default router;
