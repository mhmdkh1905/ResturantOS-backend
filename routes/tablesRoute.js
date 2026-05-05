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
  authinticateUser,
  requireAdmin,
  requireTwoRoles,
} from "../middleware/auth.js";

const router = express.Router();



router.get(
  "/",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  getAllTables,
);

router.get(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  getTableById,
);

router.post("/", authinticateUser, requireAdmin("admin"), createTable);

router.put(
  "/:id",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  updateTable,
);

router.patch(
  "/:id/status",
  authinticateUser,
  requireTwoRoles("admin", "waiter"),
  updateTableStatus,
);

router.delete("/:id", authinticateUser, requireAdmin("admin"), deleteTable);

export default router;
