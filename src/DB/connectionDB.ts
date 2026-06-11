import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI_ONLINE as string;

if (!MONGO_URI) {
    throw new Error("MONGO_URI_ONLINE is not defined");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
};