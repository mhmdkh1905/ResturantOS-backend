import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import { authinticateUser } from "./middleware/auth.js";
import { connectTODatabase } from "./config/database.js";

import menuRoute from "./routes/menuRoute.js";
import orderRoute from "./routes/orderRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import employeeRoute from "./routes/employeesRoute.js";
import tableRoute from "./routes/tablesRoute.js";
import authRoute from "./routes/authRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use("/auth", authRoute);
app.use("/menu", menuRoute);
app.use("/dashboard", authinticateUser, dashboardRoute);
app.use("/orders", authinticateUser, orderRoute);
app.use("/inventory", authinticateUser, inventoryRoute);
app.use("/employees", authinticateUser, employeeRoute);
app.use("/tables", authinticateUser, tableRoute);

try {
  await connectTODatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
