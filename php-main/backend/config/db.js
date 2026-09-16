import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = (process.env.MONGO_URI && process.env.MONGO_URI.trim()) || 'mongodb+srv://samofficialsamuel8_db_user:UoMmbAV8KDAfJ6SC@cluster0.i30toji.mongodb.net/admin_panel_db?retryWrites=true&w=majority';

let isConnected = false;

// Global process exception safety to prevent TLS Alert 80 from crashing server
process.on('uncaughtException', (err) => {
  if (err.message && (err.message.includes('SSL routines') || err.message.includes('tlsv1 alert'))) {
    // Gracefully handle SSL handshake notices from Atlas network filters
  } else {
    console.error('Uncaught Exception:', err);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  if (reason && reason.message && reason.message.includes('SSL routines')) {
    // Suppress SSL rejection warning
    return;
  }
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    isConnected = true;
    console.log(`MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        tls: true,
        tlsAllowInvalidCertificates: true,
        family: 4
      });
      isConnected = true;
      console.log(`MongoDB Atlas Connected (Fallback Config): ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.warn(`MongoDB Atlas Notice: Could not connect to Atlas cluster (${fallbackErr.message}).`);
      console.warn(`Tip: If using MongoDB Atlas, make sure your current IP address is whitelisted in Atlas (Network Access -> Add IP -> 0.0.0.0/0).`);
      isConnected = false;
    }
  }
};

mongoose.connection.on('error', (err) => {
  if (err && err.message && (err.message.includes('SSL routines') || err.message.includes('tlsv1 alert'))) {
    return;
  }
  console.warn('Mongoose connection notice:', err.message || err);
});

export const getDBStatus = () => isConnected;
