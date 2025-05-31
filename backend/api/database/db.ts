import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/hajkmat';

/**
 * Connect to MongoDB database
 */
const connectDB = async (): Promise<typeof mongoose> => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB connection URL is not defined. Check your environment variables.');
    }

    console.log(`Connecting to MongoDB environment: ${process.env.NODE_ENV || 'development'}`);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};
export default connectDB;
