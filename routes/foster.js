import express from "express"
import mongoose from "mongoose";

import { checkIfthePetIsFostered, deletePetFostering, registerFosterPet, updatePetByIdFoster } from "../controllers/foster.js";
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        
        const { petId, fosterParentId, shelterId, duration,message, pet_name } = req.body;

        if (!petId || !fosterParentId || !duration || !shelterId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Validate ObjectIds
        if (![petId, fosterParentId, shelterId].every(mongoose.Types.ObjectId.isValid)) {
            return res.status(400).json({ error: "Invalid IDs provided" });
        }
        let checkFostered = await checkIfthePetIsFostered({ petId, fosterParentId, duration, message, shelterId })
        if (checkFostered?.length > 0) {
            return res.status(200).json({ message: "Pet Already Fostered", data: checkFostered });
        }
        else {
            const fosteredPet = await registerFosterPet({ petId, fosterParentId, duration, message, shelterId, pet_name });
            return res.status(200).json({ message: "Pet registered for foster care", data: fosteredPet });
        }
    } catch (error) {
        console.error("Error registering foster pet:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deletePetFostering(id);

        if (!result) {
            return res.status(404).json({ message: "Pet not found" });
        }

         let fosterDBUpdate = await updatePetByIdFoster(id, { isShelterAccepted: false, status: "InActive" })
                console.log("foster db update >>>",fosterDBUpdate)
                if (Object.keys(fosterDBUpdate)?.length == 0) {
                    return res.status(404).json({ "error": "Pet not found in Foster DB" });
                }


        res.json({ message: "Pet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



export const fosterRouter = router
