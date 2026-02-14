import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import Project from "../models/project.model.js";
import logger from "./logger.js";

/**
 * Logs a system event to the database
 * @param {Object} params
 * @param {string} [params.developerId] - The developer performing or owning the action
 * @param {string} [params.projectId] - The project associated with the action
 * @param {string} params.action - Short unique code for the action (e.g., 'API_KEY_ROTATED')
 * @param {string} params.description - Human-readable description
 * @param {string} [params.category] - Category (project, security, user, api, system)
 * @param {Object} [params.actor] - Who performed the action { type, id, name }
 * @param {Object} [params.metadata] - Extra details like IP, User Agent, resource IDs
 */
export const logEvent = async ({
  developerId,
  projectId,
  action,
  description,
  category = "project",
  actor = null,
  metadata = {},
}) => {
  try {
    let finalDeveloperId = developerId;

    // If developerId is missing but we have a projectId, find the project owner
    if (!finalDeveloperId && projectId) {
      const project = await Project.findById(projectId).select("developer");
      if (project) {
        finalDeveloperId = project.developer;
      }
    }

    const logData = {
      developerId: finalDeveloperId,
      projectId,
      action,
      description,
      category,
      actor: actor || {
        type: finalDeveloperId ? "developer" : "system",
        id: finalDeveloperId ? finalDeveloperId.toString() : "system",
      },
      metadata: {
        ip: metadata.ip || "unknown",
        userAgent: metadata.userAgent || "unknown",
        resourceId: metadata.resourceId || null,
        details: metadata.details || {},
      },
    };

    await AuditLog.create(logData);

    // Create notification only if we have a recipient (developerId)
    if (finalDeveloperId) {
      await Notification.create({
        developerId: finalDeveloperId,
        title: action
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        message: description,
        type: category === "security" ? "warning" : "info",
        metadata: { action, projectId },
      });
    }
  } catch (error) {
    logger.error("Failed to save audit log", { error: error.message, action });
  }
};
