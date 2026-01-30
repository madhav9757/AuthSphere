import AuditLog from "../models/auditLog.model.js";

/**
 * Logs a system event to the database
 * @param {Object} params
 * @param {string} params.developerId - The developer performing or owning the action
 * @param {string} [params.projectId] - The project associated with the action
 * @param {string} params.action - Short unique code for the action (e.g., 'API_KEY_ROTATED')
 * @param {string} params.description - Human-readable description
 * @param {string} [params.category] - Category (project, security, user, api)
 * @param {Object} [params.metadata] - Extra details like IP, User Agent, resource IDs
 */
export const logEvent = async ({
    developerId,
    projectId,
    action,
    description,
    category = "project",
    metadata = {},
}) => {
    try {
        // Basic sanitization
        const logData = {
            developerId,
            projectId,
            action,
            description,
            category,
            metadata: {
                ip: metadata.ip || "unknown",
                userAgent: metadata.userAgent || "unknown",
                resourceId: metadata.resourceId || null,
                details: metadata.details || {},
            }
        };

        await AuditLog.create(logData);
    } catch (error) {
        console.error("Critical: Failed to save audit log:", error.message);
    }
};
