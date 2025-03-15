import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    mobile_number: { type: String, required: true, trim: true }, 
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    randomString: { type: String }, 
    user_image: { type: String } // Store image as binary

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
