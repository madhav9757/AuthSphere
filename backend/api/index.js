import connectDB from "../src/database/connectDB.js";
import { app } from "../src/app.js";

export default async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Function Error:", error);
        res.status(500).json({ error: "Internal Server Error during DB connection" });
    }
};
