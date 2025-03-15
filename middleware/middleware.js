import jwt from "jsonwebtoken";

export const authenticated = async (req, res, next) => {
    const token = req.headers["x-auth-token"]; // Get token from header

    if (!token) {
        return res.status(401).json({ error: "Invalid Token" }); // 401 Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Store decoded user info in request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid Authorization" }); // 403 Forbidden
    }
};
