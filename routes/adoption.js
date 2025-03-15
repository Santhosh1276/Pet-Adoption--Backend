import express from "express";
import mongoose from "mongoose";
import {
  applyForAdoption,
  checkIfPetAdopted,
  deleteAdoption,
  getAdoptionRequests,
  updateAdoptionStatus,
  updatePetByIdAdoption,
} from "../controllers/adoptionsController.js";

const router = express.Router();

// apply new adoption
router.post("/", async (req, res) => {
  try {
    console.log("req?.body >>>>",req?.body)
    const { adopterId, shelterId, petId, message, pet_name } = req.body;

    if (!adopterId || !petId || !shelterId) {
      return res
        .status(400)
        .json({ error: "Adopter ID and Pet ID  and Shelter Id are required" });
    }

    // Validate ObjectIds
    if (![petId, adopterId, shelterId].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ error: "Invalid IDs provided" });
    }

    let checkAdopted = await checkIfPetAdopted({
      petId,
      adopterId,
      message,
      shelterId,
    });
    console.log("check adopted >>>",checkAdopted)
    if (checkAdopted?.length > 0) {
      return res
        .status(200)
        .json({ message: "Pet Already Adopted", data: checkAdopted });
    } else {
      const adoptionRequest = await applyForAdoption({
        adopterId,
        petId,
        shelterId,
        message,
        pet_name,
      });
      return res
        .status(201)
        .json({ message: "Adoption request submitted", data: adoptionRequest });
    }
  } catch (error) {
    console.error("Error applying for adoption:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// track the application
router.get("/", async (req, res) => {
  try {
    console.log("from querey >>>>",req.query)
    const { userId, user_role } = req.query; // Corrected to query params

    console.log("user role and role >>>",userId,user_role)

    if (!userId?.trim() || !user_role?.trim()) {
      return res.status(400).json({ error: "User ID and User Role are required" });
    }

    
    const applications = await getAdoptionRequests(user_role === "adopter" ? "adopterId" : "fosterId", userId);
    console.log("applications >>>>",applications)
    if (!applications.length) {
      return res.status(404).json({ error: "No applications found" });
    }

    return res.status(200).json({ message: "Applications fetched", data: applications });
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Approving / rejecting
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Status should be 'Approved' or 'Rejected'

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedApplication = await updateAdoptionStatus(id, status);
    if (!updatedApplication) {
      return res.status(404).json({ error: "Adoption request not found" });
    }

    return res
      .status(200)
      .json({
        message: `Adoption request - ${status.toLowerCase()}`,
        data: updatedApplication,
      });
  } catch (error) {
    console.error("Error updating adoption status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteAdoption(id);

        if (!result) {
            return res.status(404).json({ message: "Pet not found" });
        }

      let adopterDBUpdate = await updatePetByIdAdoption(id, { isShelterAccepted: false, status: "Rejected" })
                console.log("adoptor db update >>>",adopterDBUpdate)
                if (Object.keys(adopterDBUpdate)?.length == 0) {
                    return res.status(404).json({ "error": "Pet not found in Foster DB" });
                }


        res.json({ message: "Pet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
export const adoptionRouter = router;
