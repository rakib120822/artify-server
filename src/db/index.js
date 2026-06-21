import mongoose from "mongoose";
import config from "../config/index.js";

const uri = config.mongodbUri;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...", uri);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
