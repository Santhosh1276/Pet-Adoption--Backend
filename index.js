import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Server } from 'socket.io'
import http from "http"

import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/users.js";
import { authenticated } from "./middleware/middleware.js";
import { petRoute } from "./routes/pets.js";
import { adoptionRouter } from "./routes/adoption.js";
import { reviewRouter } from "./routes/reviews.js";
import { fosterRouter } from "./routes/foster.js";
import { mailRouter } from "./routes/generateMail.js";
import { messageRouter } from "./routes/message.js";
import { Message } from "./models/message.js";


const app = express()
dotenv.config(); // Load environment variables


const port = process.env.PORT ?? 8000
console.log("port >>", port)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows requests from any origin
        methods: ["GET", "POST"]
    }
});

console.log("io >>>",io)

connectDB()

// Increase the body size limit
app.use(express.json({ limit: "50mb" }));  // Adjust the limit as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((cors()))
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit to handle large images


app.use(express.json())



app.use("/api/auth/", userRouter)
app.use("/api/pets", authenticated, petRoute)
app.use("/api/adoptions", authenticated, adoptionRouter)
app.use("/api/reviews", authenticated, reviewRouter)
app.use("/api/foster", authenticated, fosterRouter)
app.use("/api/generate-mail", mailRouter)
app.use("/api/", authenticated, messageRouter)

// 📌 Socket.io for Real-time Messaging
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        if (!receiverId) {
            console.error("Error: receiverId is missing!");
            socket.emit("errorMessage", { error: "receiverId is required." });
            return;
        }

        try {
            const newMessage = new Message({ senderId, receiverId, message });
            await newMessage.save();

            const room = `${senderId}_${receiverId}`;
            io.to(room).emit("receiveMessage", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
            socket.emit("errorMessage", { error: "Failed to send message." });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



server.listen(port, () => {
    console.log(`Server running on ${port}`)
})