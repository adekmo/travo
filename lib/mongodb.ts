// lib/mongodb.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Tentukan tipe untuk cached koneksi
type MongooseConnectionCache = {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
};

// Tambahkan properti global secara aman
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseConnectionCache;
};

const cached: MongooseConnectionCache =
  globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = (await cached.promise).connection;

  globalWithMongoose.mongoose = cached;

  return cached.conn;
}
