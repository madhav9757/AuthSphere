import Project from "../models/project.model.js";
import crypto from "crypto";

/* ============================================================
   CREATE PROJECT
============================================================ */
export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const developerId = req.developer._id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    // Check if duplicate project name under same dev
    const exists = await Project.findOne({ name, developer: developerId });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "A project with this name already exists",
      });
    }

    const publicKey = crypto.randomBytes(16).toString("hex");
    const privateKey = crypto.randomBytes(32).toString("hex");

    const project = await Project.create({
      name,
      publicKey,
      privateKey,
      developer: developerId,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
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
      return res.status(404).json({ success: false, message: "Project not found" });
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

    const allowedUpdates = ["name", "settings"]; // prevent modifying keys manually
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
      return res.status(404).json({ success: false, message: "Project not found" });
    }

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
      return res.status(404).json({ success: false, message: "Project not found" });
    }

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
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
