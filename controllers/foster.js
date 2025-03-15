import { Foster } from "../models/foster.js";
// import { Pet } from "../models/pet.js";

export async function checkIfthePetIsFostered(data) {
    return await Foster.find({
        petId: data?.petId,
        fosterParentId: data?.fosterParentId
    })
}

export async function registerFosterPet(data) {
    const fosterRecord = await new Foster({
        petId: data.petId,
        fosterParentId: data.fosterParentId,
        duration: data.duration,
        status: "InActive",
        message: data?.message ?? "",
        isShelterAccepted: false,
        shelterId: data?.shelterId,
        pet_name:data?.pet_name
    }).save();
   
    return fosterRecord;
}


export async function updatePetByIdFoster(id, updatedData) {
    try {
        console.log("id >>>",id)
        const result = await Foster.updateOne({ petId: id }, { $set: updatedData }, { runValidators: true });
        if (result.matchedCount === 0) {
            throw new Error("Pet not found");
        }


        return result;
    } catch (error) {
        console.error("Error updating pet:", error.message);
        throw error;
    }
}


export async function deletePetFostering(petId) {
    try {
        const result = await Foster.deleteOne({ petId: petId });

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
