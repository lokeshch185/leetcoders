/**
 * Database Connection Module
 * Handles the connection to MongoDB using Mongoose
 */

import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database
 * Uses the connection URL from environment variables
 * Sets up event listeners for connection status
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    // Connect to MongoDB using the URL from environment variables
    mongoose.connect(process.env.mongo_url);

    const connection = mongoose.connection;
    
    // Handle connection errors
    connection.on("error", () => {
      console.log("Error connecting to database");
    });
    
    // Handle successful connection
    connection.on("connected", () => {
      console.log("Mongo DB Connection Successful");
    });
};

export default connectDB;
