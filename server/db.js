// server/db.js
import mongoose from 'mongoose';

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  connectionPromise = mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      return mongoose.connection;
    })
    .catch((err) => {
      connectionPromise = undefined;
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });

  return connectionPromise;
};
