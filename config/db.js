import mongoose from "mongoose";

export function connectDB() {
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/pet-adoption`)
        console.log("DB connected successfully")

    }
    catch (e) {
        console.error("Connection failed DB >>", e)
    }
}