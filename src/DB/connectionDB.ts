// import mongoose from "mongoose";


// const MONGO_URI = process.env.MONGO_URI_ONLINE as string;

// let cached = (global as any).mongoose;

// if (!cached) {
//     cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export const connectDB = async () => {
//     if (cached.conn) return cached.conn;

//     if (!cached.promise) {
//         cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
//     }

//     cached.conn = await cached.promise;
//     return cached.conn;
// };

import mongoose from "mongoose";
import { MONGO_URL } from "../config/config.service";
// import { MONGO_URI } from "../config/config.service";



export const checkConnection = async () => {
    try {
        await mongoose.connect(MONGO_URL!);
        console.log(`Connected to MongoDB successfully at ${MONGO_URL}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}