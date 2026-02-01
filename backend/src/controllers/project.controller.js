import Project from "../models/project.model.js";
import EndUser from "../models/endUsers.models.js";
import crypto from "crypto";
import { logEvent } from "../utils/auditLogger.js";

/* ============================================================
   CREATE PROJECT
============================================================ */
export const createProject = async (req, res) => {
  try {
    const { name, redirectUris, providers, logoUrl } = req.body;
    const developerId = req.developer._id;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    if (
      !redirectUris ||
      !Array.isArray(redirectUris) ||
      redirectUris.length === 0
    )
      return res
        .status(400)
        .json({ success: false, message: "Redirect URIs are required" });
    if (!providers || !Array.isArray(providers) || providers.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "At least one provider is required" });

    const exists = await Project.findOne({ name, developer: developerId });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Project already exists" });

    const publicKey = crypto.randomBytes(16).toString("hex");
    const privateKey = crypto.randomBytes(32).toString("hex");

    const project = await Project.create({
      name,
      publicKey,
      privateKey,
      developer: developerId,
      redirectUris,
      providers,
      logoUrl,
    });

    // Log the event
    await logEvent({
      developerId,
      projectId: project._id,
      action: "PROJECT_CREATED",
      description: `New project "${name}" was created.`,
      category: "project",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project, // privateKey hidden by model
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET ALL PROJECTS
============================================================ */
export const getProjects = async (req, res) => {
  try {
    const developerId = req.developer._id;

    const projects = await Project.find({ developer: developerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error("Get Projects Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET SINGLE PROJECT
============================================================ */
export const getProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error("Get Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   UPDATE PROJECT
============================================================ */
export const updateProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const allowedUpdates = ["name", "settings", "redirectUris", "providers", "allowedOrigins", "logoUrl"]; // prevent modifying keys manually
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Log the event
    await logEvent({
      developerId,
      projectId: updated._id,
      action: "PROJECT_UPDATED",
      description: `Project settings for "${updated.name}" were updated.`,
      category: "project",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: { updates: Object.keys(updates) }
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   ROTATE PROJECT KEYS
============================================================ */
export const rotateKeys = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const newPublicKey = crypto.randomBytes(16).toString("hex");
    const newPrivateKey = crypto.randomBytes(32).toString("hex");

    const project = await Project.findOneAndUpdate(
      { _id: projectId, developer: developerId },
      { publicKey: newPublicKey, privateKey: newPrivateKey },
      { new: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Log the event
    await logEvent({
      developerId,
      projectId: project._id,
      action: "API_KEY_ROTATED",
      description: "Project API keys were rotated.",
      category: "security",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Keys rotated successfully",
      data: project,
    });
  } catch (err) {
    console.error("Rotate Keys Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   DELETE PROJECT
============================================================ */
export const deleteProject = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      developer: developerId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Log the event
    await logEvent({
      developerId,
      action: "PROJECT_DELETED",
      description: `Project "${project.name}" was deleted permanently.`,
      category: "project",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        resourceId: project._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET PROJECT USERS
============================================================ */
export const getProjectUsers = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId } = req.params;

    // 1. Verify project belongs to developer
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // 2. Fetch users
    const users = await EndUser.find({ projectId }).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Get Project Users Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   DELETE PROJECT USER
============================================================ */
export const deleteProjectUser = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId, userId } = req.params;

    // 1. Verify project belongs to developer
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // 2. Delete user
    const user = await EndUser.findOneAndDelete({ _id: userId, projectId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete Project User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   TOGGLE USER VERIFICATION
============================================================ */
export const toggleUserVerification = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const { projectId, userId } = req.params;

    // 1. Verify project belongs to developer
    const project = await Project.findOne({
      _id: projectId,
      developer: developerId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // 2. Find and update user
    const user = await EndUser.findOne({ _id: userId, projectId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
      data: user
    });
  } catch (err) {
    console.error("Toggle User Verification Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET CONFIGURED PROVIDERS (INTERNAL CONFIG CHECK)
   Checks which .env variables are set for OAuth providers.
   Returns detailed status for each provider.
============================================================ */
export const getConfiguredProviders = async (req, res) => {
  try {
    // Helper function to create provider status object
    const getProviderStatus = (clientId, clientSecret) => {
      const isConfigured = !!(clientId && clientSecret);
      return {
        isConfigured,
        status: isConfigured ? "ready" : "not_configured",
        message: isConfigured
          ? "Ready to integrate"
          : "Not yet configured. Add credentials to enable this provider."
      };
    };

    const providers = {
      google: getProviderStatus(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET),
      github: getProviderStatus(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET),
      discord: getProviderStatus(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET),
      gitlab: getProviderStatus(process.env.GITLAB_CLIENT_ID, process.env.GITLAB_CLIENT_SECRET),
      twitch: getProviderStatus(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET),
      microsoft: getProviderStatus(process.env.MICROSOFT_CLIENT_ID, process.env.MICROSOFT_CLIENT_SECRET),
      facebook: getProviderStatus(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_CLIENT_SECRET),
      twitter: getProviderStatus(process.env.TWITTER_CLIENT_ID, process.env.TWITTER_CLIENT_SECRET),
      slack: getProviderStatus(process.env.SLACK_CLIENT_ID, process.env.SLACK_CLIENT_SECRET),
      apple: getProviderStatus(process.env.APPLE_CLIENT_ID, process.env.APPLE_CLIENT_SECRET),
      spotify: getProviderStatus(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET),
      reddit: getProviderStatus(process.env.REDDIT_CLIENT_ID, process.env.REDDIT_CLIENT_SECRET),
      linkedin: getProviderStatus(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET),
      hubspot: getProviderStatus(process.env.HUBSPOT_CLIENT_ID, process.env.HUBSPOT_CLIENT_SECRET),
      instagram: getProviderStatus(process.env.INSTAGRAM_CLIENT_ID, process.env.INSTAGRAM_CLIENT_SECRET),
      pinterest: getProviderStatus(process.env.PINTEREST_CLIENT_ID, process.env.PINTEREST_CLIENT_SECRET),
    };

    return res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (err) {
    console.error("Get Configured Providers Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
