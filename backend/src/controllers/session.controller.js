import DeveloperSession from "../models/developerSession.model.js";
import Developer from "../models/developer.model.js";
import { parseUserAgent } from "../utils/userAgentParser.js";
import { logEvent } from "../utils/auditLogger.js";

export const getDeveloperSessions = async (req, res) => {
  try {
    const sessions = await DeveloperSession.find({ developer: req.developer._id, isValid: true })
      .sort({ lastActive: -1 });

    const currentRefreshToken = req.cookies.refreshToken;

    const formattedSessions = sessions.map(session => ({
      _id: session._id,
      deviceInfo: session.deviceInfo,
      location: session.location,
      ipAddress: session.ipAddress,
      lastActive: session.lastActive,
      createdAt: session.createdAt,
      current: session.refreshToken === currentRefreshToken
    }));

    return res.status(200).json({
      success: true,
      data: formattedSessions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await DeveloperSession.findOneAndUpdate(
      { _id: sessionId, developer: req.developer._id },
      { isValid: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Log the event
    await logEvent({
      developerId: req.developer._id,
      action: "SESSION_REVOKED",
      description: `Active session on ${session.deviceInfo?.os || 'unknown device'} was revoked.`,
      category: "security",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        resourceId: sessionId,
        details: { deviceInfo: session.deviceInfo }
      },
    });

    return res.status(200).json({
      success: true,
      message: "Session revoked successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeAllOtherSessions = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;

    await DeveloperSession.updateMany(
      {
        developer: req.developer._id,
        refreshToken: { $ne: currentRefreshToken }
      },
      { isValid: false }
    );

    // Log the event
    await logEvent({
      developerId: req.developer._id,
      action: "OTHER_SESSIONS_REVOKED",
      description: "All other active sessions were revoked.",
      category: "security",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({
      success: true,
      message: "All other sessions revoked successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeAllSessions = async (req, res) => {
  try {
    await DeveloperSession.updateMany(
      { developer: req.developer._id },
      { isValid: false }
    );

    // Also clear refresh token in developer model
    await Developer.findByIdAndUpdate(req.developer._id, { refreshToken: null });

    // Log the event
    await logEvent({
      developerId: req.developer._id,
      action: "ALL_SESSIONS_REVOKED",
      description: "All active sessions (including current) were revoked.",
      category: "security",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({
      success: true,
      message: "All sessions revoked successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
