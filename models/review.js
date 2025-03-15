import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    petId: { type: String, required: true },
    shelterId: { type: String,required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
    review_date: { type: Date, default: Date.now }, // Auto-generate date

}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
