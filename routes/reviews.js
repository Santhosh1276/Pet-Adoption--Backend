import express from "express";
import { postReview, deleteReview, getReviewsByShelter } from "../controllers/reviews.js";

const router = express.Router();


// Add reviews
router.post("/", async (req, res) => {
    try {
        const { petId, shelterId, rating, review } = req.body;

        if (!petId || !shelterId || !rating || !review) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newReview = await postReview({ petId, shelterId, rating, review });

        return res.status(201).json({ message: "Review submitted successfully", data: newReview });
    } catch (error) {
        console.error("Error posting review:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// get all reviews respect to shelter
router.get("/:shelterId", async (req, res) => {
    try {
        const { shelterId } = req.params;

        if (!shelterId) {
            return res.status(400).json({ error: "Shelter ID is required" });
        }

        const reviews = await getReviewsByShelter(shelterId);
        return res.status(200).json({ message: "Reviews fetched successfully", data: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete review
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await deleteReview(id);
        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


export const reviewRouter = router;
