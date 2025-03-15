import express from "express"
import { Message } from "../models/message.js";
const route = express.Router();



// Get past messages for a specific adopter-shelter chat
route.get("/messages", async (req, res) => {
    const { adopterId, shelterId } = req.query;
    const messages = await Message.find({
        $or: [
            { senderId: adopterId, receiverId: shelterId },
            { senderId: shelterId, receiverId: adopterId },
        ],
    }).sort("timestamp");
    res.json(messages);
});

route.get("/messagesById", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort("timestamp");

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export const messageRouter = route;

