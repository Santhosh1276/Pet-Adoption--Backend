import express from 'express'
import { createPet, deletePetById, findAllPets, findPetById, findPetsByAdopterId, findPetsByFosterId, findPetsByShelterId, findPetsByShelterId_fostering, searchPets, updatePetById } from '../controllers/pets.js'
import { internalServerError } from '../middleware/errorHandling.js'
import { updatePetByIdFoster } from '../controllers/foster.js'
import { updatePetByIdAdoption } from '../controllers/adoptionsController.js'
import { Pet } from '../models/pet.js'

const route = express.Router()


// Create Pet
route.post("/", async (req, res) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ "error": "No Data Found" });
        }
        let newPet = await createPet(req?.body);
        return res.status(201).json({ "message": "Pet listed successfully", "data": newPet });
    } catch (error) {
        console.log("errrr >>>>", error)

        internalServerError()
    }

})

// Read Pet
route.get("/", async (req, res) => {
    try {
        let fetchAllPets = await findAllPets()
        if (fetchAllPets?.length == 0) {
            return res.status(400).json({ "error": "No Data Found" })
        }

        return res.status(200).json({ "message": "Data Fetched Successfully", "data": fetchAllPets })
    }
    catch (e) {
        console.log("errrr >>>>", e)
    }
})

// ADD REVIEW 
// Add a review to a pet
route.post("/:petId/review", async (req, res) => {
    try {
        const { petId } = req.params;
        const { userId, userName, rating, reviewText } = req.body;

        if (!userId || !rating || !reviewText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        pet.reviews.push({ userId, userName, rating, reviewText });
        await pet.save();

        res.status(200).json({ message: "Review added successfully", pet });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




// fetch pets by unique Shelter id(adoption form)
route.get("/shelter/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let pets = await findPetsByShelterId(id);
        console.log("pets >>>", pets)
        if (!pets.length) {
            return res.status(404).json({ "error": "No pets found under this shelter" });
        }

        return res.status(200).json({ "message": "Pets Found", "data": pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// fetch pets by unique Shelter id (fostering data)
route.get("/shelter_fostering/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let pets = await findPetsByShelterId_fostering(id);
        console.log("pets >>>", pets)
        if (!pets.length) {
            return res.status(404).json({ "error": "No pets found under this shelter" });
        }

        return res.status(200).json({ "message": "Pets Found", "data": pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// fetch pets by unique foster id (fostering data)
route.get("/foster/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let pets = await findPetsByFosterId(id);
        console.log("pets >>>", pets)
        if (!pets.length) {
            return res.status(404).json({ "error": "No pets found under this foster" });
        }

        return res.status(200).json({ "message": "Pets Found", "data": pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// fetch pets by unique adopter id (adopter data)
route.get("/adopter/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let pets = await findPetsByAdopterId(id);
        console.log("pets >>>", pets)
        if (!pets.length) {
            return res.status(404).json({ "error": "No pets found under this adopter" });
        }

        return res.status(200).json({ "message": "Pets Found", "data": pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// filter by pet
// Get all pets: GET / pets
// Filter by breed & age: GET / pets ? breed = Golden Retriever & age=2
route.get("/filter", async (req, res) => {
    try {

        const filters = req.query;
        console.log("filters  from req.body >>>>",filters)
        const pets = await searchPets(filters);
        

        if (!pets.length) {
            return res.status(404).json({ message: "No pets found" });
        }

        return res.status(200).json({ message: "Pets retrieved successfully", data: pets });
    } catch (error) {
        console.error("Error fetching pets >>>>>>>>>>>>>>>:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// fetch pets by unique id
route.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract pet ID from URL
        
        if (!id) {
            return res.status(400).json({ "error": "Pet ID is required" });
        }

        let pet = await findPetById(id);
        if (!pet) {
            return res.status(404).json({ "error": "Pet not found" });
        }

        return res.status(200).json({ "message": "Pet Found", "data": pet });

    } catch (error) {
        console.error("Error fetching pet................:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});

// edit / update  (for fostering)
route.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;      

        if (!id || !updatedData) {
            return res.status(400).json({ "error": "Pet ID and data are required" });
        }

        let updatedPet = await updatePetById(id, updatedData);
        console.log(">>>>>>>>> updated pet  >>.",updatedPet)
        if (Object.keys(updatedPet)?.length == 0) {
            return res.status(404).json({ "error": "Pet not found in Pet DB" });
        }
        let fosterDBUpdate = await updatePetByIdFoster(id, { isShelterAccepted: true, status: "Active" })
        console.log("foster db update >>>",fosterDBUpdate)
        if (Object.keys(fosterDBUpdate)?.length == 0) {
            return res.status(404).json({ "error": "Pet not found in Foster DB" });
        }

        return res.status(200).json({ "message": "Pet updated successfully", "data": { ...updatedPet ,...fosterDBUpdate} });

    } catch (error) {
        console.error("Error updating pet:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// edit / update for (adoption)
route.put("/adop/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        console.log("id >>>", id)
        console.log("updated data >>>", updatedData)
        

        if (!id || !updatedData) {
            return res.status(400).json({ "error": "Pet ID and data are required" });
        }

        let updatedPet = await updatePetById(id, updatedData);
        console.log(">>>>>>>>> updated pet  >>.", updatedPet)
        if (Object.keys(updatedPet)?.length == 0) {
            return res.status(404).json({ "error": "Pet not found in Pet DB" });
        }
        let adopterDBUpdate = await updatePetByIdAdoption(id, { isShelterAccepted: true, status: "Approved" })
        console.log("foster db update >>>", adopterDBUpdate)
        if (Object.keys(adopterDBUpdate)?.length == 0) {
            return res.status(404).json({ "error": "Pet not found in Foster DB" });
        }

        return res.status(200).json({ "message": "Pet updated successfully", "data": { ...updatedPet, ...adopterDBUpdate } });

    } catch (error) {
        console.error("Error updating pet:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// Delete Pet
route.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ "error": "Pet ID is required" });
        }

        let deletedPet = await deletePetById(id);
        if (!deletedPet) {
            return res.status(404).json({ "error": "Pet not found" });
        }

        return res.status(200).json({ "message": "Pet deleted successfully" });

    } catch (error) {
        console.error("Error deleting pet:", error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
});


// Toggle favorite
route.post("/:petId/favorite", async (req, res) => {
    const { userId } = req.body;
    const { petId } = req.params;
    console.log("pet id , userid >>",petId,userId)
    try {
        const pet = await Pet.findById(petId);
        console.log("pet >>>",pet)
        if (!pet) return res.status(404).json({ message: "Pet not found" });

        const index = pet.favorites.indexOf(userId);
        if (index === -1) {
            pet.favorites.push(userId);
        } else {
            pet.favorites.splice(index, 1);
        }

        await pet.save();
        res.json({ message: "Favorite updated", favorites: pet.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// Get User's Favorite Pets
route.get("/favorites/:userId", async (req, res) => {
    try {
        const pets = await Pet.find({ favorites: req.params.userId });
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export const petRoute = route