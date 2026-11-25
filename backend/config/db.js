import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const rawUri = (config.mongoUri || 'mongodb://localhost:27017/natchiyar_crackers').trim();
  // Ensure we connect cleanly with dbName if uri has empty path or ends with /
  const options = {
    dbName: 'natchiyar_crackers',
    serverSelectionTimeoutMS: 5000
  };

  try {
    const conn = await mongoose.connect(rawUri, options);
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ️ Running with offline resilience (in-memory/JSON fallback enabled).`);
  }
};

export const isDbConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export default connectDB;
