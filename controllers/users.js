import { User } from "../models/user.js";

export async function checkUser(req) {
    return await User.findOne({ "email": req.body.email })
}


export async function createUser(req, hashedPassword) {
    return await new User({
        ...req.body,
        password: hashedPassword
    }).save()
}


export async function getUserById(shelterId) {
    return await User.findOne({ _id:shelterId });
}
