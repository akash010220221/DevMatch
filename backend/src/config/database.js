import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Uses the connection string from environment variables.
 * 
 * @returns {Promise} Resolves on successful connection.
 */
const connectDB = async () => {
    await mongoose.connect(MONGODB_URI);
}

export default connectDB;
