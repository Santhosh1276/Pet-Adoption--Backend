import mongoose from "mongoose";

const adoptionFormSchema = new mongoose.Schema({
    adopterId: { type: String, required: true },
    shelterId: { type: String, required: true },
    adopted_date: { type: Date, default: Date.now },
    petId: { type: String, required: true },
    pet_name: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    isShelterAccepted: { type: Boolean, default: false }


}, { timestamps: true });

export const AdoptionForm = mongoose.model("AdoptionForm", adoptionFormSchema);
