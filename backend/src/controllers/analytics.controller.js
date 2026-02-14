import analyticsService from "../services/core/analytics.service.js";
import projectService from "../services/core/project.service.js";

export const getAnalyticsOverview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.developer._id;

    if (!(await projectService.verifyOwnership(projectId, developerId))) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't own this project",
      });
    }

    const data = await analyticsService.getOverview(projectId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalyticsCharts = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.developer._id;

    if (!(await projectService.verifyOwnership(projectId, developerId))) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't own this project",
      });
    }

    const data = await analyticsService.getCharts(projectId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.developer._id;

    if (!(await projectService.verifyOwnership(projectId, developerId))) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't own this project",
      });
    }

    const data = await analyticsService.getRecentActivity(projectId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
