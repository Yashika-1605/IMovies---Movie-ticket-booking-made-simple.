const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic and clean connection logging
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    // Do not crash in development if local Mongo is not running; give clear warning
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('[Database Warning] Running in offline / mock mode if MongoDB is not reachable.');
    }
  }
};

module.exports = connectDB;
