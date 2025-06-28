// MongoDB connection utility
// Connects to MongoDB using Mongoose and environment variable for URI
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Connect using URI from .env
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
