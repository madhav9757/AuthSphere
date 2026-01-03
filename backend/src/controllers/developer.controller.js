import Developer from "../models/developer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js"; // Standardized config import
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

/* ---------------------- REGISTER ---------------------- */
export const registerDeveloper = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if ([email, username, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedDeveloper = await Developer.findOne({
            $or: [{ username }, { email }],
        });

        if (existedDeveloper) {
            return res.status(409).json({ message: "Developer with email or username already exists" });
        }

        // Note: Hashing here, but it's better in the Model's pre-save hook!
        const hashedPassword = await bcrypt.hash(password, 10);

        const developer = await Developer.create({
            email,
            username,
            password: hashedPassword,
            provider: "local",
        });

        const createdDeveloper = await Developer.findById(developer._id).select("-password -refreshToken");

        return res.status(201).json({
            success: true,
            message: "Developer registered successfully",
            data: createdDeveloper,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ---------------------- LOGIN ---------------------- */
export const loginDeveloper = async (req, res) => {
    try {
        const { email, password } = req.body;

        const developer = await Developer.findOne({ email });
        if (!developer) {
            return res.status(404).json({ message: "Developer does not exist" });
        }

        if (developer.provider !== "local" && !developer.password) {
            return res.status(400).json({
                message: `Account created via ${developer.provider}. Please login accordingly.`,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, developer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(developer._id);
        const refreshToken = generateRefreshToken(developer._id);

        developer.refreshToken = refreshToken;
        await developer.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: false, // Required for 'None'
            sameSite: "Lax", 
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Logged in successfully",
                developer: {
                    id: developer._id,
                    username: developer.username,
                    email: developer.email,
                },
                accessToken // Sent in JSON for frontend storage if needed
            });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ---------------------- REFRESH TOKEN ---------------------- */
export const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, conf.refreshTokenSecret);

        const developer = await Developer.findById(decodedToken?._id);

        if (!developer || incomingRefreshToken !== developer.refreshToken) {
            return res.status(401).json({ message: "Refresh token is expired or invalid" });
        }

        const accessToken = generateAccessToken(developer._id);
        const newRefreshToken = generateRefreshToken(developer._id);

        developer.refreshToken = newRefreshToken;
        await developer.save({ validateBeforeSave: false });

        const options = { httpOnly: true, secure: true, sameSite: "None" };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                success: true,
                message: "Tokens refreshed",
                accessToken,
                refreshToken: newRefreshToken
            });
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

/* ---------------------- LOGOUT ---------------------- */
export const logoutDeveloper = async (req, res) => {
    await Developer.findByIdAndUpdate(
        req.developer._id,
        { $set: { refreshToken: null } },
        { new: true }
    );

    const options = { httpOnly: true, secure: true, sameSite: "None" };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ success: true, message: "Logged out successfully" });
};

/* ---------------------- GET PROFILE ---------------------- */
export const getCurrentDeveloper = async (req, res) => {
    if (!req.developer) {
        return res.status(404).json({
            success: false,
            message: "Developer profile not found in request",
        });
    }

    return res.status(200).json({
        success: true,
        data: req.developer,
        message: "Developer profile fetched successfully",
    });
};