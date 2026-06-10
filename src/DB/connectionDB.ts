import mongoose from "mongoose"
import { MONGO_URI_ONLINE, MONGO_URL } from "../config/config.service";


export const CheckConnectionDB = async () => {
    try {
        await mongoose.connect(MONGO_URI_ONLINE!)
        console.log(`Connected to MongoDB successfully at ${MONGO_URI_ONLINE}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}   