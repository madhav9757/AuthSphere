import Project from "../../models/project.model.js";
import EndUser from "../../models/endUsers.models.js";
import Session from "../../models/session.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { conf } from "../../configs/env.js";
import bcrypt from "bcryptjs";
import { sendVerificationOTP } from "./email.service.js";
import { logEvent } from "../../utils/auditLogger.js";
import { triggerWebhook } from "../../utils/webhookSender.js";
import { emitEvent } from "../core/socket.service.js";

class SDKService {
  constructor() {
    this.authRequests = new Map();
    this.authCodes = new Map();
    this.AUTH_REQUEST_TTL = 10 * 60 * 1000;
    this.AUTH_CODE_TTL = 10 * 60 * 1000;

    // Cleanup job
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, value] of this.authRequests.entries()) {
          if (now - value.createdAt > this.AUTH_REQUEST_TTL)
            this.authRequests.delete(key);
        }
        for (const [key, value] of this.authCodes.entries()) {
          if (now - value.createdAt > this.AUTH_CODE_TTL)
            this.authCodes.delete(key);
        }
      },
      5 * 60 * 1000,
    );
  }

  async validateAuthorizeRequest(params) {
    const {
      public_key,
      project_id,
      redirect_uri,
      provider,
      response_type,
      code_challenge_method,
    } = params;

    if (response_type !== "code")
      throw new Error("Only authorization code flow is supported");
    if (code_challenge_method !== "S256")
      throw new Error("Only S256 PKCE method is supported");

    const project = await Project.findOne({
      publicKey: public_key,
      _id: project_id,
      status: "active",
    });
    if (!project) throw new Error("Invalid public key or inactive project");

    if (!project.redirectUris.includes(redirect_uri))
      throw new Error("Redirect URI not registered");

    const projectProvidersLower = project.providers.map((p) => p.toLowerCase());
    if (!projectProvidersLower.includes(provider.toLowerCase()))
      throw new Error(`${provider} not enabled`);

    return project;
  }

  createAuthRequest(params, projectId) {
    const requestId = crypto.randomBytes(16).toString("hex");
    this.authRequests.set(requestId, {
      ...params,
      redirectUri: params.redirect_uri || params.redirectUri,
      publicKey: params.public_key || params.publicKey,
      codeChallenge: params.code_challenge || params.codeChallenge,
      codeChallengeMethod:
        params.code_challenge_method || params.codeChallengeMethod,
      projectId,
      createdAt: Date.now(),
    });
    return requestId;
  }

  getAuthRequest(requestId) {
    return this.authRequests.get(requestId);
  }

  async handleEmailVerification(endUser, project, sdk_request, reqInfo) {
    if (project?.settings?.requireEmailVerification && !endUser.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      endUser.verificationOTP = otp;
      endUser.verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await endUser.save();

      await sendVerificationOTP(
        endUser.email,
        otp,
        project.name,
        project.emailTemplate,
        {
          ...reqInfo,
          requestId: sdk_request,
          projectId: project._id,
        },
      );

      return true; // Verification required
    }
    return false;
  }

  issueAuthCode(authRequest, endUser) {
    const code = crypto.randomBytes(32).toString("hex");
    this.authCodes.set(code, {
      ...authRequest,
      endUser,
      createdAt: Date.now(),
    });
    return code;
  }

  getAuthCode(code) {
    return this.authCodes.get(code);
  }

  deleteAuthCode(code) {
    this.authCodes.delete(code);
  }

  deleteAuthRequest(requestId) {
    this.authRequests.delete(requestId);
  }

  async verifyPKCE(authData, code_verifier) {
    if (authData.codeChallenge) {
      if (!code_verifier) throw new Error("Missing code_verifier");

      const hash = crypto
        .createHash("sha256")
        .update(code_verifier)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      console.log("PKCE Check:", {
        expected: authData.codeChallenge,
        actual: hash,
        verifier: code_verifier,
      });

      if (hash !== authData.codeChallenge)
        throw new Error("Code verifier failed");
    }
  }

  async createSession(endUser, project, reqInfo) {
    const tokenSettings = project.settings?.tokenValidity || {};
    const accessSeconds = tokenSettings.accessToken || 900;
    const refreshSeconds = tokenSettings.refreshToken || 604800;

    const refreshToken = crypto.randomBytes(40).toString("hex");
    await Session.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + refreshSeconds * 1000),
      endUserId: endUser._id,
      projectId: project._id,
      userAgent: reqInfo.userAgent,
      ipAddress: reqInfo.ip,
      isValid: true,
    });

    const accessToken = jwt.sign(
      {
        sub: endUser._id,
        projectId: project._id,
        email: endUser.email,
        username: endUser.username,
      },
      conf.accessTokenSecret,
      { expiresIn: accessSeconds },
    );

    return {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + accessSeconds * 1000,
    };
  }

  async registerLocal(data, reqInfo) {
    const {
      email,
      password,
      username,
      actualPublicKey,
      projectId,
      sdk_request,
    } = data;
    const normalizedEmail = email.toLowerCase().trim();

    const project = await Project.findOne({
      publicKey: actualPublicKey,
      _id: projectId,
      status: "active",
    });
    if (!project) throw new Error("Project not found");

    const existingUser = await EndUser.findOne({
      email: normalizedEmail,
      projectId: project._id,
    });
    if (existingUser) throw new Error("User already exists");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await EndUser.create({
      email: normalizedEmail,
      password,
      username,
      projectId: project._id,
      provider: "local",
      isVerified: false,
      verificationOTP: otp,
      verificationOTPExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationOTP(email, otp, project.name, project.emailTemplate, {
      ...reqInfo,
      requestId: sdk_request || "N/A",
      projectId: project._id,
    });

    await logEvent({
      developerId: project.developer,
      projectId: project._id,
      action: "USER_REGISTERED",
      description: `New local user (${email}) registered. OTP sent.`,
      category: "user",
      actor: {
        type: "user",
        id: user._id.toString(),
        name: user.username || email,
      },
      metadata: { ...reqInfo, resourceId: user._id },
    });

    triggerWebhook(project._id, "user.registered", {
      userId: user._id,
      email: user.email,
      username: user.username,
      provider: "local",
      timestamp: new Date().toISOString(),
    });

    return { user, project };
  }

  async getProjectAndUser(projectId, email) {
    const project = await Project.findById(projectId);
    if (!project || project.status !== "active")
      throw new Error("Project not found or inactive");

    const user = await EndUser.findOne({
      email: email.toLowerCase().trim(),
      projectId: project._id,
    });
    // user might be null if strictly fetching context for new social user, but usually we expect it.

    return { project, user };
  }

  async loginLocal(data) {
    const { email, password, actualPublicKey, projectId } = data;
    const normalizedEmail = email.toLowerCase().trim();

    const project = await Project.findOne({
      publicKey: actualPublicKey,
      _id: projectId,
      status: "active",
    });
    if (!project) throw new Error("Project not found");

    const user = await EndUser.findOne({
      email: normalizedEmail,
      projectId: project._id,
    }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    if (user.isBlocked) {
      throw new Error(
        "This account has been suspended by the project administrator.",
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return { user, project };
  }

  async verifyOTP(email, otp, actualPublicKey) {
    const project = await Project.findOne({
      publicKey: actualPublicKey,
      status: "active",
    });
    if (!project) throw new Error("Project not found");

    const user = await EndUser.findOne({
      email: email.toLowerCase().trim(),
      projectId: project._id,
      verificationOTP: otp.toString().trim(),
      verificationOTPExpiry: { $gt: new Date() },
    });

    if (!user) throw new Error("Invalid or expired OTP");

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpiry = undefined;
    await user.save();

    await logEvent({
      projectId: user.projectId,
      action: "USER_VERIFIED",
      description: `User (${user.email}) successfully verified their email via OTP.`,
      category: "user",
      actor: { type: "user", id: user._id.toString(), name: user.email },
      metadata: { resourceId: user._id },
    });

    return { user, project };
  }

  async resendOTP(email, actualPublicKey, sdk_request, reqInfo) {
    const project = await Project.findOne({
      publicKey: actualPublicKey,
      status: "active",
    });
    if (!project) throw new Error("Project not found");

    const user = await EndUser.findOne({
      email: email.toLowerCase().trim(),
      projectId: project._id,
    });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationOTP(email, otp, project.name, project.emailTemplate, {
      ...reqInfo,
      requestId: sdk_request,
      projectId: project._id,
    });

    await logEvent({
      projectId: project._id,
      action: "OTP_RESENT",
      description: `Verification OTP resent to ${email}.`,
      category: "user",
      actor: { type: "user", id: user._id.toString(), name: email },
      metadata: { ...reqInfo, resourceId: user._id },
    });
  }
}

export default new SDKService();
