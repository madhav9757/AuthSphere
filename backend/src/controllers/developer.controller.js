import Developer from "../models/developer.model.js";
import Project from "../models/project.model.js";
import EndUser from "../models/endUsers.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import DeveloperSession from "../models/developerSession.model.js";
import { parseUserAgent } from "../utils/userAgentParser.js";
import { logEvent } from "../utils/auditLogger.js";
import axios from "axios";

// ✅ CONSISTENT COOKIE OPTIONS
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

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
      return res.status(409).json({
        message: "Developer with email or username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const developer = await Developer.create({
      email,
      username,
      password: hashedPassword,
      provider: "local",
    });

    const createdDeveloper = await Developer.findById(developer._id)
      .select("-password -refreshToken");

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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

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

    // Create session record
    try {
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      let location = { city: "Unknown", country: "Unknown", countryCode: "???" };
      try {
        // Optional geolocation - using a free service (ipapi.co is limited but works for demo)
        const geoResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`).catch(() => null);
        if (geoResponse && geoResponse.data && !geoResponse.data.error) {
          location = {
            city: geoResponse.data.city,
            country: geoResponse.data.country_name,
            countryCode: geoResponse.data.country_code
          };
        }
      } catch (geoError) {
        console.error("Geo lookup failed:", geoError.message);
      }

      await DeveloperSession.create({
        developer: developer._id,
        refreshToken: refreshToken,
        ipAddress: ipAddress,
        userAgent: userAgent,
        deviceInfo: parseUserAgent(userAgent),
        location: location,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days matching cookie
      });
    } catch (sessionError) {
      console.error("Failed to create developer session:", sessionError.message);
    }

    const options = getCookieOptions();

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
          picture: developer.picture,
        },
        accessToken,
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
      return res.status(401).json({
        message: "Refresh token is expired or invalid"
      });
    }

    const accessToken = generateAccessToken(developer._id);
    const newRefreshToken = generateRefreshToken(developer._id);

    developer.refreshToken = newRefreshToken;
    await developer.save({ validateBeforeSave: false });

    // Update existing session record with new refresh token
    try {
      await DeveloperSession.findOneAndUpdate(
        { refreshToken: incomingRefreshToken, developer: developer._id },
        {
          refreshToken: newRefreshToken,
          lastActive: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      );
    } catch (sessionError) {
      console.error("Failed to update developer session on refresh:", sessionError.message);
    }

    const options = getCookieOptions();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        success: true,
        message: "Tokens refreshed",
        accessToken,
        refreshToken: newRefreshToken,
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

  // Invalidate current session
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await DeveloperSession.findOneAndUpdate(
        { refreshToken: refreshToken, developer: req.developer._id },
        { isValid: false }
      );
    }
  } catch (error) {
    console.error("Logout session invalidation error:", error);
  }

  const options = getCookieOptions();

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

/* ---------------------- DASHBOARD STATS ---------------------- */
export const getDashboardStats = async (req, res) => {
  try {
    const developerId = req.developer._id;

    // Count projects
    const totalProjects = await Project.countDocuments({ developer: developerId });

    // Get all project IDs for this developer
    const projects = await Project.find({ developer: developerId }).select('_id');
    const projectIds = projects.map(p => p._id);

    // Count end users across all those projects
    const totalEndUsers = await EndUser.countDocuments({ projectId: { $in: projectIds } });

    // Get latest end users
    const recentUsers = await EndUser.find({ projectId: { $in: projectIds } })
      .select('email username createdAt projectId')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Aggregation for global signup trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawTrend = await EndUser.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days
    const signupTrend = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = rawTrend.find(item => item._id === dateStr);
      signupTrend.push({
        date: dateStr,
        count: found ? found.count : 0
      });
    }
    signupTrend.reverse();

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalEndUsers,
        recentUsers,
        signupTrend: signupTrend.map(d => ({ ...d, signups: d.count }))
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE PROFILE ---------------------- */
export const updateDeveloperProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const developerId = req.developer._id;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if username is taken by another developer
    const existing = await Developer.findOne({
      username,
      _id: { $ne: developerId }
    });

    if (existing) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { $set: { username } },
      { new: true }
    ).select("-password -refreshToken");

    // Log the event
    await logEvent({
      developerId,
      action: "PROFILE_UPDATED",
      description: `Developer profile updated. Username changed to "${username}".`,
      category: "security",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDeveloper
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- DELETE ACCOUNT ---------------------- */
export const deleteDeveloperAccount = async (req, res) => {
  try {
    const developerId = req.developer._id;

    // 1. Delete all projects for this developer
    await Project.deleteMany({ developer: developerId });

    // 2. Delete all sessions for this developer
    await DeveloperSession.deleteMany({ developer: developerId });

    // 3. Delete the developer record itself
    await Developer.findByIdAndDelete(developerId);

    const options = getCookieOptions();

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Account and all associated data deleted permanently"
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE PREFERENCES ---------------------- */
export const updateDeveloperPreferences = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ message: "Preferences data is required" });
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: updatedDeveloper
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE ORGANIZATION INFO ---------------------- */
export const updateDeveloperOrganization = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { organization, website, bio } = req.body;

    const updateData = {};
    if (organization !== undefined) updateData.organization = organization;
    if (website !== undefined) updateData.website = website;
    if (bio !== undefined) updateData.bio = bio;

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    await logEvent({
      developerId,
      action: "ORGANIZATION_INFO_UPDATED",
      description: "Developer organization information updated.",
      category: "account",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Organization info updated successfully",
      data: updatedDeveloper
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- GET FULL SETTINGS ---------------------- */
export const getDeveloperSettings = async (req, res) => {
  try {
    const developerId = req.developer._id;

    const developer = await Developer.findById(developerId)
      .select("-password -refreshToken");

    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }

    return res.status(200).json({
      success: true,
      data: developer
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};