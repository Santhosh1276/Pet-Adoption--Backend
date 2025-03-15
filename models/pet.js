import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    age: { type: Number, required: true }, // Changed to Number for logical accuracy
    color: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    shelterId: { type: String  },
    fosterId: { type: String },
    adoptorId: { type: String },
    isFostered: { type: Boolean, default: false },
    isAdopted: { type: Boolean, default: false },
    favorites: [{ type: String }], // field for favorite users
    reviews: [
        {
            userId: { type: String, required: true },
            userName: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            reviewText: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],    image: { type: String } // Store image as binary



}, { timestamps: true });

export const Pet = mongoose.model("Pet", petSchema);
