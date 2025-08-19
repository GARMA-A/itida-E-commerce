import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/itida-ecommerce';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.warn('MongoDB connection failed:', error.message);
    console.warn('Continuing without database connection for demo purposes');
    // Don't exit - continue for demo purposes
  }
};

export { connectDB };