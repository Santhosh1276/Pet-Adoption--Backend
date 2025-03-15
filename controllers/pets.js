import { Pet } from "../models/pet.js";
import { AdoptionForm } from "../models/adoption.js";

import { Foster } from "../models/foster.js";

export async function createPet(data) {
    console.log(data ,"data >>>>>")
    // Check if request body is empty
    if (!data || Object.keys(data).length === 0) {
        throw new Error("Request body is empty");
    }

    return await new Pet({
        name: data.name,
        breed: data.breed,
        age: data.age,
        color: data.color,
        size: data.size,
        location: data.location,
        shelterId: data.shelterId, // Shelter that listed the pet
        isFostered: false, // Default to false
        isAdopted:false,
        image : data?.image
    }).save();

}

export async function searchPets(filters) {
    const query = {};
    if (filters.breed) query.breed = filters.breed;
    if (filters.age) query.age = filters.age;
    if (filters.size) query.size = filters.size;
    if (filters.location) query.location = filters.location;

    return await Pet.find(query);
}


export async function findAllPets() {
    return await Pet.find();
}

export async function findPetById(id) {
    return await Pet.findById(id); // Fetch pet by ID
}

export async function findPetsByShelterId(id) {
    return await AdoptionForm.find({ shelterId: id }); 
}

export async function findPetsByShelterId_fostering(id) {
    return await Foster.find({shelterId:id})
}

export async function findPetsByFosterId(id) {
    return await Foster.find({ fosterParentId: id })
}

export async function findPetsByAdopterId(id) {
    return await AdoptionForm.find({ adopterId: id })
}




export async function findPetByField(field, value) {
    return await Pet.findOne({ [field]: value }); // Dynamic search
}

export async function updatePetById(id, updatedData) {
    console.log("update pet by id >>>>>", id, updatedData)
    const updatedPet = await Pet.findByIdAndUpdate(id, updatedData, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation is applied
    });
    console.log("updated pet data >>>",updatedData)
    return updatedPet
}


export async function deletePetById(id) {
    return await Pet.findByIdAndDelete(id);
}