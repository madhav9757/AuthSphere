import sdkService from "../services/auth/sdk.service.js";
import { conf } from "../configs/env.js";
import { emitEvent } from "../services/core/socket.service.js";
import { triggerWebhook } from "../utils/webhookSender.js";
import Session from "../models/session.model.js";

// Exporting these for backward compatibility/internal use by AuthService for now
export const authRequests = sdkService.authRequests;
export const authCodes = sdkService.authCodes;

// ---------------------------
// SDK AUTHORIZE ROUTE
// ---------------------------
export const authorize = async (req, res) => {
  try {
    const project = await sdkService.validateAuthorizeRequest(req.query);
    const requestId = sdkService.createAuthRequest(req.query, project._id);

    console.log(`✓ SDK Auth request created: ${requestId}`);

    emitEvent(project._id, "AUTH_REQUEST", {
      requestId,
      provider: req.query.provider,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (
      req.headers.accept === "application/json" ||
      req.query.json === "true"
    ) {
      return res.json({ requestId });
    }

    if (req.query.provider.toLowerCase() === "local") {
      return res.redirect(`${conf.frontendUrl}/login?sdk_request=${requestId}`);
    }

    return res.redirect(
      `/auth/${req.query.provider.toLowerCase()}?sdk=true&sdk_request=${requestId}`,
    );
  } catch (err) {
    console.error("SDK Authorize error:", err.message);
    return res
      .status(
        err.message.includes("Missing") || err.message.includes("Only")
          ? 400
          : 401,
      )
      .json({
        error: "invalid_request",
        error_description: err.message,
      });
  }
};

// ---------------------------
// SDK CALLBACK
// ---------------------------
export const handleSDKCallback = async (
  req,
  res,
  endUser,
  provider,
  manualSdkRequestId,
) => {
  try {
    const sdk_request = manualSdkRequestId || req.query.sdk_request;
    if (!sdk_request) return null;

    const authRequest = sdkService.getAuthRequest(sdk_request);
    if (!authRequest) {
      return res.status(400).send("Invalid or expired request");
    }

    const { project } = await sdkService
      .loginLocal({
        email: endUser.email,
        password: "", // Handled differently here
        actualPublicKey: authRequest.publicKey,
        projectId: authRequest.projectId,
      })
      .catch(() => ({ project: null }));

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const verificationRequired = await sdkService.handleEmailVerification(
      endUser,
      project,
      sdk_request,
      reqInfo,
    );

    if (verificationRequired) {
      const redirectUrl = new URL(authRequest.redirectUri);
      redirectUrl.searchParams.set("error", "email_not_verified");
      redirectUrl.searchParams.set("email", endUser.email);
      redirectUrl.searchParams.set("sdk_request", sdk_request);

      if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.json({ success: false, redirect: redirectUrl.toString() });
      }
      return res.redirect(redirectUrl.toString());
    }

    const code = sdkService.issueAuthCode(authRequest, endUser);
    sdkService.deleteAuthRequest(sdk_request);

    emitEvent(authRequest.projectId, "AUTH_CODE_ISSUED", {
      email: endUser.email,
      provider: endUser.provider || "local",
    });

    const redirectUrl = new URL(authRequest.redirectUri);
    redirectUrl.searchParams.set("code", code);
    redirectUrl.searchParams.set("state", authRequest.state);

    if (
      req.xhr ||
      req.headers.accept?.includes("application/json") ||
      req.body?.sdk_request
    ) {
      return res.json({ success: true, redirect: redirectUrl.toString() });
    }
    return res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("SDK callback error:", err);
    return res.status(500).send("Authentication failed");
  }
};

// ---------------------------
// TOKEN EXCHANGE
// ---------------------------
export const token = async (req, res) => {
  try {
    const { code, client_id, public_key, code_verifier } = req.body;
    const clientId = client_id || public_key;

    if (!code)
      return res
        .status(400)
        .json({ error: "invalid_request", error_description: "Missing code" });

    const authData = sdkService.getAuthCode(code);
    if (!authData)
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired code",
      });

    await sdkService.verifyPKCE(authData, code_verifier);

    if (clientId && clientId !== authData.publicKey)
      return res.status(400).json({ error: "invalid_client" });

    const { project } = await sdkService
      .loginLocal({
        email: authData.endUser.email,
        actualPublicKey: authData.publicKey,
        projectId: authData.projectId,
      })
      .catch(() => ({ project: null }));

    if (!project) return res.status(400).json({ error: "invalid_client" });

    // CORS Check
    const origin = req.headers.origin;
    if (
      project.allowedOrigins?.length > 0 &&
      (!origin || !project.allowedOrigins.includes(origin))
    ) {
      return res.status(403).json({
        error: "access_denied",
        error_description: "CORS: Origin not allowed",
      });
    }

    sdkService.deleteAuthCode(code);

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const result = await sdkService.createSession(
      authData.endUser,
      project,
      reqInfo,
    );

    triggerWebhook(project._id, "user.login", {
      userId: authData.endUser._id,
      email: authData.endUser.email,
      username: authData.endUser.username,
      provider: authData.endUser.provider || "local",
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    emitEvent(project._id, "TOKEN_EXCHANGED", {
      email: authData.endUser.email,
      userId: authData.endUser._id,
      ip: req.ip,
    });

    return res.json({
      success: true,
      ...result,
      user: {
        id: authData.endUser._id,
        email: authData.endUser.email,
        username: authData.endUser.username,
        picture: authData.endUser.picture || "",
        provider: authData.endUser.provider || "local",
      },
    });
  } catch (err) {
    console.error("Token Exchange Error:", err.message);
    return res
      .status(err.message.includes("verifier") ? 400 : 500)
      .json({ error: "invalid_grant", error_description: err.message });
  }
};

// ---------------------------
// REFRESH TOKEN
// ---------------------------
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing refresh token",
      });

    const session = await Session.findOne({
      token: refreshToken,
      isValid: true,
    }).populate("endUserId");
    if (!session || new Date() > session.expiresAt) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired token",
      });
    }

    const { project } = await sdkService
      .loginLocal({
        email: session.endUserId.email,
        actualPublicKey: "",
        projectId: session.projectId,
      })
      .catch(() => ({ project: null }));

    if (!project) return res.status(400).json({ error: "invalid_client" });

    // CORS Check
    const origin = req.headers.origin;
    if (
      project.allowedOrigins?.length > 0 &&
      (!origin || !project.allowedOrigins.includes(origin))
    ) {
      return res.status(403).json({
        error: "access_denied",
        error_description: "CORS: Origin not allowed",
      });
    }

    const result = await sdkService.createSession(session.endUserId, project, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    emitEvent(session.projectId, "TOKEN_REFRESHED", {
      email: session.endUserId.email,
      userId: session.endUserId._id,
    });

    return res.json({ success: true, ...result });
  } catch (err) {
    console.error("Token Refresh Error:", err);
    return res.status(500).json({ error: "server_error" });
  }
};

// ---------------------------
// LOCAL AUTH (Email/Password)
// ---------------------------
export const registerLocal = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      public_key,
      publicKey,
      projectId,
      sdk_request,
    } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !username || !actualPublicKey || !projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    await sdkService.registerLocal(
      { email, password, username, actualPublicKey, projectId, sdk_request },
      reqInfo,
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please enter the OTP sent to your email.",
      requireEmailVerification: true,
    });
  } catch (err) {
    return res
      .status(err.message.includes("exists") ? 400 : 500)
      .json({ success: false, message: err.message });
  }
};

export const loginLocal = async (req, res) => {
  try {
    const { email, password, public_key, publicKey, projectId, sdk_request } =
      req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !actualPublicKey || !projectId || !sdk_request) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const { user, project } = await sdkService.loginLocal({
      email,
      password,
      actualPublicKey,
      projectId,
    });

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const verificationRequired = await sdkService.handleEmailVerification(
      user,
      project,
      sdk_request,
      reqInfo,
    );

    if (verificationRequired) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. A new code has been sent.",
        error_code: "EMAIL_NOT_VERIFIED",
        sdk_request,
      });
    }

    return await handleSDKCallback(req, res, user, "local", sdk_request);
  } catch (err) {
    return res
      .status(err.message.includes("credentials") ? 401 : 500)
      .json({ success: false, message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    const { user } = await sdkService.verifyOTP(email, otp, actualPublicKey);
    return await handleSDKCallback(req, res, user, user.provider, sdk_request);
  } catch (err) {
    return res
      .status(err.message.includes("expired") ? 400 : 500)
      .json({ success: false, message: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !actualPublicKey || !sdk_request) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    await sdkService.resendOTP(email, actualPublicKey, sdk_request, reqInfo);

    return res.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
