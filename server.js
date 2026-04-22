import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import { connectTODatabase } from "./config/database.js";

import productRoute from "./routes/productsRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use("/products", productRoute);

try {
  await connectTODatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
