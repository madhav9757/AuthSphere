import AuditLog from "../models/auditLog.model.js";
import Project from "../models/project.model.js";

export const getProjectLogs = async (req, res) => {
    try {
        const { projectId } = req.params;
        const developerId = req.developer._id;

        // Verify ownership
        const project = await Project.findOne({ _id: projectId, developer: developerId });
        if (!project) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this project" });
        }

        const logs = await AuditLog.find({ projectId })
            .sort({ createdAt: -1 })
            .limit(50); // Fetch last 50 events

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getGlobalLogs = async (req, res) => {
    try {
        const developerId = req.developer._id;

        // Fetch all logs related to this developer (all their projects)
        const logs = await AuditLog.find({ developerId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
