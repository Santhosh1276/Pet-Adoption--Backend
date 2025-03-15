import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    description: { type: String, trim: true },
    registeredDate: { type: Date, default: Date.now },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }], // References listed pets
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // References user reviews
}, { timestamps: true });

export const Shelter = mongoose.model("Shelter", shelterSchema);
