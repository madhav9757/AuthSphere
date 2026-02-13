import sessionService from "../services/core/session.service.js";

export const getDeveloperSessions = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;
    const sessions = await sessionService.getSessions(
      req.developer._id,
      currentRefreshToken,
    );

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };

    const session = await sessionService.revokeSession(
      sessionId,
      req.developer._id,
      reqInfo,
    );

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeAllOtherSessions = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };

    await sessionService.revokeAllOtherSessions(
      req.developer._id,
      currentRefreshToken,
      reqInfo,
    );

    return res.status(200).json({
      success: true,
      message: "All other sessions revoked successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const revokeAllSessions = async (req, res) => {
  try {
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };

    await sessionService.revokeAllSessions(req.developer._id, reqInfo);

    return res.status(200).json({
      success: true,
      message: "All sessions revoked successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
