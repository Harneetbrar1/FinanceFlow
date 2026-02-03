/**
 * Database Configuration
 * 
 * Handles MongoDB connection using Mongoose.
 * Provides a reusable function to connect to the database.
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    // Exit process with failure code if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
