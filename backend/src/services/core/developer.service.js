import Developer from "../../models/developer.model.js";
import Project from "../../models/project.model.js";
import EndUser from "../../models/endUsers.models.js";
import DeveloperSession from "../../models/developerSession.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { parseUserAgent } from "../../utils/userAgentParser.js";
import { logEvent } from "../../utils/auditLogger.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { conf } from "../../configs/env.js";

class DeveloperService {
  /**
   * Register a new developer
   */
  async register(data) {
    const { email, username, password } = data;

    const existedDeveloper = await Developer.findOne({
      $or: [{ username }, { email }],
    });

    if (existedDeveloper) {
      throw new Error("Developer with email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const developer = await Developer.create({
      email,
      username,
      password: hashedPassword,
      provider: "local",
    });

    return await Developer.findById(developer._id).select(
      "-password -refreshToken",
    );
  }

  /**
   * Login developer
   */
  async login(email, password, reqInfo) {
    const developer = await Developer.findOne({ email });
    if (!developer) {
      throw new Error("Developer does not exist");
    }

    if (developer.provider !== "local" && !developer.password) {
      throw new Error(
        `Account created via ${developer.provider}. Please login accordingly.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, developer.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(developer._id);
    const refreshToken = generateRefreshToken(developer._id);

    developer.refreshToken = refreshToken;
    await developer.save({ validateBeforeSave: false });

    // Create session record
    const { ip, userAgent } = reqInfo;
    let location = { city: "Unknown", country: "Unknown", countryCode: "???" };

    try {
      const geoResponse = await axios
        .get(`https://ipapi.co/${ip}/json/`)
        .catch(() => null);
      if (geoResponse && geoResponse.data && !geoResponse.data.error) {
        location = {
          city: geoResponse.data.city,
          country: geoResponse.data.country_name,
          countryCode: geoResponse.data.country_code,
        };
      }
    } catch (geoError) {
      console.error("Geo lookup failed:", geoError.message);
    }

    await DeveloperSession.create({
      developer: developer._id,
      refreshToken: refreshToken,
      ipAddress: ip,
      userAgent: userAgent,
      deviceInfo: parseUserAgent(userAgent),
      location,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { developer, accessToken, refreshToken };
  }

  /**
   * Refresh access token
   */
  async refreshTokens(incomingRefreshToken) {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      conf.refreshTokenSecret,
    );
    const developer = await Developer.findById(decodedToken?._id);

    if (!developer || incomingRefreshToken !== developer.refreshToken) {
      throw new Error("Refresh token is expired or invalid");
    }

    const accessToken = generateAccessToken(developer._id);
    const newRefreshToken = generateRefreshToken(developer._id);

    developer.refreshToken = newRefreshToken;
    await developer.save({ validateBeforeSave: false });

    // Update existing session record with new refresh token
    await DeveloperSession.findOneAndUpdate(
      { refreshToken: incomingRefreshToken, developer: developer._id },
      {
        refreshToken: newRefreshToken,
        lastActive: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    );

    return { accessToken, newRefreshToken };
  }

  /**
   * Logout developer
   */
  async logout(developerId, refreshToken) {
    await Developer.findByIdAndUpdate(developerId, {
      $set: { refreshToken: null },
    });

    if (refreshToken) {
      await DeveloperSession.findOneAndUpdate(
        { refreshToken, developer: developerId },
        { isValid: false },
      );
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(developerId) {
    const totalProjects = await Project.countDocuments({
      developer: developerId,
    });
    const projects = await Project.find({ developer: developerId }).select(
      "_id",
    );
    const projectIds = projects.map((p) => p._id);

    const totalEndUsers = await EndUser.countDocuments({
      projectId: { $in: projectIds },
    });

    const recentUsers = await EndUser.find({ projectId: { $in: projectIds } })
      .select("email username createdAt projectId")
      .populate("projectId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawTrend = await EndUser.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const signupTrend = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = rawTrend.find((item) => item._id === dateStr);
      signupTrend.push({
        date: dateStr,
        signups: found ? found.count : 0,
      });
    }
    signupTrend.reverse();

    return { totalProjects, totalEndUsers, recentUsers, signupTrend };
  }

  /**
   * Update developer profile
   */
  async updateProfile(developerId, data, reqInfo) {
    const { username } = data;

    const existing = await Developer.findOne({
      username,
      _id: { $ne: developerId },
    });
    if (existing) {
      throw new Error("Username is already taken");
    }

    const updated = await Developer.findByIdAndUpdate(
      developerId,
      { $set: { username } },
      { new: true },
    ).select("-password -refreshToken");

    await logEvent({
      developerId,
      action: "PROFILE_UPDATED",
      description: `Developer profile updated. Username changed to "${username}".`,
      category: "security",
      metadata: reqInfo,
    });

    return updated;
  }

  /**
   * Delete developer account
   */
  async deleteAccount(developerId) {
    await Project.deleteMany({ developer: developerId });
    await DeveloperSession.deleteMany({ developer: developerId });
    await Developer.findByIdAndDelete(developerId);
  }

  /**
   * Update preferences
   */
  async updatePreferences(developerId, preferences, reqInfo) {
    const updated = await Developer.findByIdAndUpdate(
      developerId,
      { $set: { preferences } },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    await logEvent({
      developerId,
      action: "PREFERENCES_UPDATED",
      description: "Developer notification and theme preferences updated.",
      category: "account",
      metadata: reqInfo,
    });

    return updated;
  }

  /**
   * Update organization info
   */
  async updateOrganization(developerId, updateData, reqInfo) {
    const updated = await Developer.findByIdAndUpdate(
      developerId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    await logEvent({
      developerId,
      action: "ORGANIZATION_INFO_UPDATED",
      description: "Developer organization information updated.",
      category: "account",
      metadata: reqInfo,
    });

    return updated;
  }
}

export default new DeveloperService();
