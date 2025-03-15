import express from "express"
const router = express.Router();
import { Meeting } from "./models/meeting.js";

// Schedule a meeting
router.post("/", async (req, res) => {
    try {
        const { adopterId, shelterId, petId, dateTime } = req.body;
        const newMeeting = new Meeting({ adopterId, shelterId, petId, dateTime });
        await newMeeting.save();
        res.status(201).json(newMeeting);
    } catch (err) {
        res.status(500).json({ error: "Meeting scheduling failed" });
    }
});

// Get meetings for a user
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const meetings = await Meeting.find({
            $or: [{ adopterId: userId }, { shelterId: userId }]
        }).populate("petId");
        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve meetings" });
    }
});

module.exports = router;
export const meetingRouter = router

