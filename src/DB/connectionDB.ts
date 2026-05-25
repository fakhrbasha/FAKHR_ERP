import mongoose from "mongoose"
import { MONGO_URL } from "../config/config.service";


export const CheckConnectionDB = async () => {
    try {
        await mongoose.connect(MONGO_URL!)
        console.log(`Connected to MongoDB successfully at ${MONGO_URL}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}   