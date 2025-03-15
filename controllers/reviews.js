import { Review } from "../models/review.js";

export async function postReview(data) {
    return await new Review({
        petId: data.petId,
        shelterId: data.shelterId,
        rating: data.rating,
        review: data.review
    }).save();
}


export async function getReviewsByShelter(shelterId) {
    return await Review.find({ shelterId }).populate("userId", "name"); // Populating user details
}


export async function deleteReview(id) {
    return await Review.findByIdAndDelete(id);
}
