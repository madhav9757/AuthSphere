import AuditLog from "../../models/auditLog.model.js";

class AuditLogService {
  /**
   * Get logs for a specific project
   */
  async getProjectLogs(projectId, limit = 50) {
    return await AuditLog.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Get global logs for a developer
   */
  async getGlobalLogs(developerId, limit = 50) {
    return await AuditLog.find({ developerId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new AuditLogService();
