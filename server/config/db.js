import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js SRV lookup issues on Windows / certain ISP routers
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if restricted
}

export const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB Warning]: Neither MONGO_URI nor MONGODB_URI is defined. Running fallback mode.');
    return false;
  }

  // If URI ends with .mongodb.net/? without a DB name, supply 'unisol' default DB
  if (uri.includes('.mongodb.net/?')) {
    uri = uri.replace('.mongodb.net/?', '.mongodb.net/unisol?');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: ${error.message}. Running fallback mode.`);
    return false;
  }
};
