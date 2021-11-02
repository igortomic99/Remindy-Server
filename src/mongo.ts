import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDatabase = async () => {
  dotenv.config();
  const uri = process.env.DB_CONN_STRING as any;
  await mongoose
    .connect(uri)
    .then((_result) => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });
};
