import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("MongoDB Connected");

    } catch (error) {
        console.log("Error in MongoDB Connection: ", error);
    }
};


