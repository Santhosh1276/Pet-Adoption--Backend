import mongoose from "mongoose";

const fosterSchema = new mongoose.Schema({
    petId: { type: String, required: true },
    pet_name: { type: String, required: true },
    shelterId:{type:String,required:true},
    fosterParentId: { type: String, required: true },
    duration: { type: Number, required: true }, // in weeks
    message: {type:String},
    status: { type: String, enum: ["InActive", "Active", "Completed"] },
    isShelterAccepted : {type:Boolean,default:false}
}, { timestamps: true });

export const Foster = mongoose.model("Foster", fosterSchema);
