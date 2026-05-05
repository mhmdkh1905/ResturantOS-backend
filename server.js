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

const allowedOrigins = [
  "http://localhost:5173",
  "https://resturant-os-frontend-mu.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use("/api/auth", authRoute);
app.use("/api/menu", menuRoute);
app.use("/api/dashboard", authinticateUser, dashboardRoute);
app.use("/api/orders", authinticateUser, orderRoute);
app.use("/api/inventory", authinticateUser, inventoryRoute);
app.use("/api/employees", authinticateUser, employeeRoute);
app.use("/api/tables", authinticateUser, tableRoute);

try {
  await connectTODatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
