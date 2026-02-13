import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: false, // Made optional to support system/user events
      index: true,
    },
    actor: {
      type: {
        type: String,
        enum: ["developer", "user", "system"],
        default: "developer",
      },
      id: String, // ID of the developer or end-user
      name: String, // Readable name of the actor
    },
    action: {
      type: String,
      required: true,
      // Examples: 'PROJECT_CREATED', 'API_KEY_ROTATED', 'USER_REGISTERED', 'SESSION_REVOKED'
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      ip: String,
      userAgent: String,
      resourceId: String, // ID of the affected resource (user, session, etc.)
      details: mongoose.Schema.Types.Mixed,
    },
    category: {
      type: String,
      enum: ["project", "security", "user", "api", "system"],
      default: "project",
    },
  },
  { timestamps: true },
);

// Indexes for performance
auditLogSchema.index({ projectId: 1, createdAt: -1 });
auditLogSchema.index({ developerId: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
