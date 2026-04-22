import mongoose from "mongoose";

export async function connectTODatabase() {
  try {
    const url =
      "mongodb+srv://mhmd52kh_db_user:hmode2002@cluster0.5ctgdsv.mongodb.net/resturantOS";

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
