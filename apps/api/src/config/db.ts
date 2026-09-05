import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './env';

// Configure public DNS servers for Windows SRV lookup compatibility
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported
}

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB Atlas] Connected successfully to database: ${conn.connection.name} at ${conn.connection.host}`);
  } catch (error: any) {
    console.error('[MongoDB] Connection error:', error.message);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
