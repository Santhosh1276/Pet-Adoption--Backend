import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export function generateJwt(id) {
    return jwt.sign({id},process.env.SECRET_KEY)
}