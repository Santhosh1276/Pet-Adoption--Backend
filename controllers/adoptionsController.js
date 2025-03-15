import { AdoptionForm } from "../models/adoption.js";

export async function applyForAdoption(data) {
    return await new AdoptionForm({
        adopterId: data.adopterId,
        petId: data.petId,
        message: data.message ?? "",
        pet_name: data.pet_name,
        shelterId :data?.shelterId,
        status: "Pending" 
    }).save();
}


export async function getAdoptionRequests(key,userId) {
    return await AdoptionForm.find({ [key]: userId });
}


export async function updateAdoptionStatus(id, status) {
    return await AdoptionForm.findByIdAndUpdate(id, { status }, { new: true });
}


export async function checkIfPetAdopted(data) {
    return await AdoptionForm.find({
        petId: data?.petId,
        adopterId: data?.adopterId
    })
}

export async function updatePetByIdAdoption(id, updatedData) {
    try {
        console.log("id >>>",id)
        const result = await AdoptionForm.updateOne({ petId: id }, { $set: updatedData }, { runValidators: true });
        if (result.matchedCount === 0) {
            throw new Error("Pet not found");
        }


        return result;
    } catch (error) {
        console.error("Error updating pet:", error.message);
        throw error;
    }
}

export async function deleteAdoption(petId) {
    try {
        const result = await AdoptionForm.deleteOne({ petId: petId });

        if (result.deletedCount === 0) {
            throw new Error("No matching record found to delete.");
        }

        console.log(`Successfully deleted fostering record: petId=${petId}`);
        return result;
    } catch (error) {
        console.error("Error deleting fostering record:", error.message);
        throw error;
    }
}
