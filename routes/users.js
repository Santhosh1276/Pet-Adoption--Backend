import express from "express"
import bcrypt from "bcrypt"

import { internalServerError } from "../middleware/errorHandling.js"
import { checkUser, createUser } from "../controllers/users.js"
import { generateJwt } from "../controllers/generateJWTtoken.js"
import { User } from "../models/user.js"

const route = express.Router()

// Sign Up Router
route.post("/register", async (req, res) => {
    try {
        if (req.body) {
            let findUser = await checkUser(req)
            console.log("find user >>>>", findUser)
            if (findUser) {
                return res.status(400).json({ "message": "User Already Registered", "data": findUser })
            }
            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(req.body.password, salt)
            let newUser = await createUser(req, hashedPassword)
            if (newUser) {
                return res.status(200).json({
                    "message": "User Created Successfully",
                    "data": newUser
                })
            }
            else {
                return res.status(200).json({
                    "message": "User Not Created",
                    "error": newUser
                })
            }
        }
    } catch (error) {
        internalServerError()
    }
})

// Log in Router
route.post("/login", async (req, res) => {
    try {
        if (req.body) {
            let findUser = await checkUser(req)
            console.log("find user  >>>>>>>>>>>>", findUser)
            if (!findUser) {
                return res.status(400).json({ "message": "User Not Found", "data": findUser })
            }
            else {
                let checkPassword = await bcrypt.compare(
                    req.body.password,
                    findUser?.password
                )
                console.log("check password >>>",checkPassword)
                if (!checkPassword) {
                    return res.status(400).json({ "error": "Invalid Credentials" })
                }

                let generateToken = await generateJwt(findUser?._id)
                return res.status(200).json({ "message": "Login Successfully", accessToken: generateToken, userInfo: findUser })
            }
        }
    } catch (error) {
        internalServerError()
    }
})

route.get("/shelters", async (req, res) => {
    try {
        const shelters = await User.find({ role: "shelter" }).select("-password"); // Exclude passwords
        return res.status(200).json({ message: "Shelters fetched successfully", data: shelters });
    } catch (error) {
        console.error("Error fetching shelters:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// get all users
route.get("/all-users", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        return res.status(200).json({ message: "All Users fetched successfully", data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


route.put("/update-profile/:id",  async(req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile_number, user_image } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, mobile_number, user_image },
            { new: true }
        );

        if(!updatedUser) {
            return res.status(404).json({ message: "Pet not found" });
        }

    res.status(200).json(updatedUser);
    } catch(error) {
        res.status(500).json({ message: "Error updating pet details", error });
    }

})








export const userRouter = route