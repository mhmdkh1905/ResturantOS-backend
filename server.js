import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import { connectTODatabase } from "./config/database.js";

import productRoute from "./routes/productsRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import menuRoute from "./routes/menuRoute.js";
import orderRoute from "./routes/orderRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import employeeRoute from "./routes/employeesRoute.js";
import tableRoute from "./routes/tablesRoute.js";

import cors from "cors";

dotenv.config();

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

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/employees", employeeRoute);
app.use("/api/tables", tableRoute);

try {
  await connectTODatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
