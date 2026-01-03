import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";
import Developer from "../models/developer.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies);

        let token = req.cookies?.accessToken 
            || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, conf.accessTokenSecret);

        const developer = await Developer.findById(decoded?._id)
            .select("-password -refreshToken");

        if (!developer) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }

        req.developer = developer;
        next();
    } catch (error) {
        console.log("JWT Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Authentication failed" });
    }
};
