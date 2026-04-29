import mongoose from "mongoose";

export async function connectTODatabase() {
  try {
    const url = process.env.MONGODB_URI;

    await mongoose.connect(url, {});

    console.log("Connected to the database successfully!");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export function getDatabase() {
  return mongoose.connection.db;
}
