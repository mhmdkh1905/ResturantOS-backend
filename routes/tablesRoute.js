import express from "express";
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
} from "../controllers/tablesController.js";
import {
  authenticateUser,
  requireAdmin,
  requireTwoRoles,
} from "../middleware/auth.js";

const router = express.Router();



router.get(
  "/",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  getAllTables,
);

router.get(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  getTableById,
);

router.post("/", authenticateUser, requireAdmin("admin"), createTable);

router.put(
  "/:id",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  updateTable,
);

router.patch(
  "/:id/status",
  authenticateUser,
  requireTwoRoles("admin", "waiter"),
  updateTableStatus,
);

router.delete("/:id", authenticateUser, requireAdmin("admin"), deleteTable);

export default router;
