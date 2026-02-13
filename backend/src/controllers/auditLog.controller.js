import auditLogService from "../services/core/auditLog.service.js";
import projectService from "../services/core/project.service.js";

export const getProjectLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.developer._id;

    // Verify ownership
    if (!(await projectService.verifyOwnership(projectId, developerId))) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't own this project",
      });
    }

    const logs = await auditLogService.getProjectLogs(projectId);

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
    const logs = await auditLogService.getGlobalLogs(developerId);

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
