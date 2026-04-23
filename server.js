import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import { connectTODatabase } from "./config/database.js";

import productRoute from "./routes/productsRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import menuRoute from "./routes/menuRoute.js";
import orderRoute from "./routes/orderRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/menu", menuRoute);
app.use("/orders", orderRoute);

try {
  await connectTODatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
