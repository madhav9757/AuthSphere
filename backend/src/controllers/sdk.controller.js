import Project from "../models/project.model.js";
import EndUser from "../models/endUsers.models.js";
import Session from "../models/session.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";
import bcrypt from "bcryptjs";
import { sendVerificationOTP } from "../services/email.service.js";
import { logEvent } from "../utils/auditLogger.js";

export const authRequests = new Map(); // sdk_request_id
export const authCodes = new Map();    // authorization_code

const AUTH_REQUEST_TTL = 10 * 60 * 1000; // 10 min
const AUTH_CODE_TTL = 10 * 60 * 1000;    // 10 min

// ---------------------------
// CLEANUP JOB
// ---------------------------
setInterval(() => {
  const now = Date.now();

  for (const [key, value] of authRequests.entries()) {
    if (now - value.createdAt > AUTH_REQUEST_TTL) {
      authRequests.delete(key);
    }
  }

  for (const [key, value] of authCodes.entries()) {
    if (now - value.createdAt > AUTH_CODE_TTL) {
      authCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ---------------------------
// SDK AUTHORIZE ROUTE
// ---------------------------
export const authorize = async (req, res) => {
  try {
    const {
      public_key,
      redirect_uri,
      provider,
      response_type,
      code_challenge,
      code_challenge_method,
      state,
    } = req.query;

    // ✅ Validate required params
    if (!public_key || !redirect_uri || !provider || !code_challenge || !state) {
      console.error("SDK Authorize: Missing parameters", { public_key, redirect_uri, provider, code_challenge, state });
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing required parameters",
      });
    }

    // ✅ Only support auth code flow
    if (response_type !== "code") {
      console.error("SDK Authorize: Invalid response_type", response_type);
      return res.status(400).json({
        error: "unsupported_response_type",
        error_description: "Only authorization code flow is supported",
      });
    }

    if (code_challenge_method !== "S256") {
      console.error("SDK Authorize: Invalid code_challenge_method", code_challenge_method);
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Only S256 PKCE method is supported",
      });
    }

    // ✅ Find project
    const project = await Project.findOne({ publicKey: public_key, status: "active" });
    if (!project) {
      console.error("SDK Authorize: Project not found or inactive", public_key);
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Invalid public key",
      });
    }

    // ✅ Check redirect_uri
    if (!project.redirectUris.includes(redirect_uri)) {
      console.error("SDK Authorize: Invalid redirect_uri", redirect_uri, "Expected:", project.redirectUris);
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Redirect URI not registered",
      });
    }

    // ✅ Provider enabled
    // Note: Project providers might be stored as "Google" while query is "google". Check case sensitivity.
    const projectProvidersLower = project.providers.map(p => p.toLowerCase());
    if (!projectProvidersLower.includes(provider.toLowerCase())) {
      console.error("SDK Authorize: Provider not enabled", provider, "Enabled:", project.providers);
      return res.status(400).json({
        error: "invalid_request",
        error_description: `${provider} not enabled`,
      });
    }

    // ✅ Create SDK auth request
    const requestId = crypto.randomBytes(16).toString("hex");
    authRequests.set(requestId, {
      publicKey: public_key,
      redirectUri: redirect_uri,
      provider,
      codeChallenge: code_challenge,
      state,
      projectId: project._id,
      createdAt: Date.now(),
    });

    console.log(`✓ SDK Auth request created: ${requestId}`);

    // ✅ Handle response
    if (req.headers.accept === "application/json" || req.query.json === "true") {
      return res.json({ requestId });
    }

    if (provider.toLowerCase() === "local") {
      return res.redirect(`${conf.frontendUrl}/login?sdk_request=${requestId}`);
    }

    // ✅ Redirect user to provider login with sdk_request
    return res.redirect(`/auth/${provider.toLowerCase()}?sdk=true&sdk_request=${requestId}`);
  } catch (err) {
    console.error("SDK Authorize error:", err);
    return res.status(500).json({
      error: "server_error",
      error_description: "Internal server error",
    });
  }
};

// ---------------------------
// SDK CALLBACK
// ---------------------------
export const handleSDKCallback = async (req, res, endUser, provider, manualSdkRequestId) => {
  try {
    const sdk_request = manualSdkRequestId || req.query.sdk_request;
    console.log("🔹 handleSDKCallback invoked with:", { sdk_request, endUserEmail: endUser?.email });

    if (!sdk_request) {
      console.error("❌ No sdk_request in query or manual argument");
      return null;
    }

    const authRequest = authRequests.get(sdk_request);
    if (!authRequest) {
      console.error("❌ Auth request not found in memory map for ID:", sdk_request);
      return res.status(400).send("Invalid or expired request (Server may have restarted)");
    }

    // --- ENHANCEMENT: Security Checks ---
    const project = await Project.findById(authRequest.projectId);

    // 1. Email Verification Enforcement
    if (project?.settings?.requireEmailVerification) {
      if (!endUser.isVerified) {
        // Generate new OTP if missing or expired, or just refresh it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        endUser.verificationOTP = otp;
        endUser.verificationOTPExpiry = otpExpiry;
        await endUser.save();

        // Send verification email
        await sendVerificationOTP(endUser.email, otp, project.name);

        // If not verified, return redirect info or redirect directly
        const redirectUrl = new URL(authRequest.redirectUri);
        redirectUrl.searchParams.set("error", "email_not_verified");
        redirectUrl.searchParams.set("email", endUser.email);
        redirectUrl.searchParams.set("sdk_request", sdk_request); // Pass sdk_request to frontend to verify later

        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.json({
            success: false,
            message: "Email not verified",
            redirect: redirectUrl.toString()
          });
        }
        return res.redirect(redirectUrl.toString());
      }
    }

    // Generate auth code
    const code = crypto.randomBytes(32).toString("hex");

    authCodes.set(code, {
      ...authRequest,
      endUser,
      createdAt: Date.now(),
    });

    authRequests.delete(sdk_request);

    console.log(`✓ Auth code issued for ${endUser.email}`);

    const redirectUrl = new URL(authRequest.redirectUri);
    redirectUrl.searchParams.set("code", code);
    redirectUrl.searchParams.set("state", authRequest.state);

    console.log("➡️ Returning redirect URL to client:", redirectUrl.toString());

    // Check if this is an AJAX/Fetch request (typical for verifyOTP)
    if (req.xhr || req.headers.accept?.includes('application/json') || req.body?.sdk_request) {
      return res.json({
        success: true,
        redirect: redirectUrl.toString()
      });
    }

    return res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("SDK callback error:", err);
    return res.status(500).send("Authentication failed");
  }
};

/* ============================================================
   TOKEN EXCHANGE
============================================================ */
export const token = async (req, res) => {
  try {
    const {
      grant_type,
      code, // The 'code' property from the frontend matches 'code' here
      redirect_uri,
      client_id, // The 'public_key' from frontend is sent as 'public_key' in body, NOT 'client_id' by default fetch in SDK?
      // Wait, let's double check SDK impl in callback.ts.
      // body: JSON.stringify({ code, public_key, redirect_uri, code_verifier })
      // Ah, the SDK sends 'public_key', not 'client_id'.
      // But let's check what I'm reading from req.body
      public_key, // Reading public_key as well to be safe
      code_verifier,
    } = req.body;

    // The SDK sends `public_key`, but standard OAuth is `client_id`.
    // We should support both or stick to what the SDK sends.
    const clientId = client_id || public_key;

    if (!code) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing code"
      });
    }

    // NOTE: The SDK doesn't send 'grant_type' in the body in handleAuthCallback?
    // Let's check callback.ts again.
    // It sends: { code, public_key, redirect_uri, code_verifier }
    // It does NOT send grant_type.
    // So we should make grant_type optional or default to 'authorization_code' if missing,
    // OR update the SDK to send it.
    // Ideally update backend to be lenient since we can't easily change the installed SDK package if it was external,
    // but here we have the source.
    // However, the prompt implies "fix the code", so let's fix backend to handle the SDK's current request format
    // OR fix the SDK.
    // Let's assume the SDK code we saw is the source of truth for what's being sent.

    const authData = authCodes.get(code);

    if (!authData) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired code"
      });
    }

    // PKCE Verification
    if (authData.codeChallenge) {
      if (!code_verifier) {
        return res.status(400).json({
          error: "invalid_request",
          error_description: "Missing code_verifier"
        });
      }

      const hash = crypto
        .createHash("sha256")
        .update(code_verifier)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      if (hash !== authData.codeChallenge) {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "Code verifier failed"
        });
      }
    }

    if (clientId && clientId !== authData.publicKey) {
      return res.status(400).json({ error: "invalid_client" });
    }

    // --- ENHANCEMENT: Project Configuration Fetch ---
    const project = await Project.findById(authData.projectId);
    if (!project) return res.status(400).json({ error: "invalid_client" });

    // 2. CORS / Allowed Origins Check
    const origin = req.headers.origin;
    if (project.allowedOrigins && project.allowedOrigins.length > 0) {
      if (!origin || !project.allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "access_denied", error_description: "CORS: Origin not allowed" });
      }
    }

    authCodes.delete(code);

    const { endUser, projectId } = authData;

    // 3. Token Validity Settings
    const tokenSettings = project.settings?.tokenValidity || {};
    const accessSeconds = tokenSettings.accessToken || 900; // Default 15m
    const refreshSeconds = tokenSettings.refreshToken || 604800; // Default 7d

    const refreshToken = crypto.randomBytes(40).toString("hex");

    await Session.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + refreshSeconds * 1000),
      endUserId: endUser._id,
      projectId: projectId,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      isValid: true,
    });

    const accessToken = jwt.sign(
      {
        sub: endUser._id,
        projectId: projectId,
        email: endUser.email,
        username: endUser.username
      },
      conf.accessTokenSecret,
      { expiresIn: accessSeconds } // Use project setting
    );

    // Prepare response matching AuthResponse interface in SDK
    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: endUser._id,
        email: endUser.email,
        username: endUser.username,
        picture: endUser.picture || "",
        provider: endUser.provider || "local"
      },
      expiresAt: Date.now() + (accessSeconds * 1000)
    });

  } catch (err) {
    console.error("Token Exchange Error:", err);
    return res.status(500).json({ error: "server_error" });
  }
};

/* ============================================================
   REFRESH TOKEN
============================================================ */
export const refresh = async (req, res) => {
  try {
    // SDK sends: { refreshToken, publicKey }
    const { refreshToken, publicKey } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "invalid_request", error_description: "Missing refresh token" });
    }

    const session = await Session.findOne({
      token: refreshToken,
      isValid: true
    }).populate("endUserId");

    if (!session) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid refresh token"
      });
    }

    if (new Date() > session.expiresAt) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Refresh token expired"
      });
    }

    // --- ENHANCEMENT: Fetch Project for Settings ---
    const project = await Project.findById(session.projectId);
    if (!project) return res.status(400).json({ error: "invalid_client" });

    // CORS Check
    const origin = req.headers.origin;
    if (project.allowedOrigins && project.allowedOrigins.length > 0) {
      if (!origin || !project.allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "access_denied", error_description: "CORS: Origin not allowed" });
      }
    }

    const tokenSettings = project.settings?.tokenValidity || {};
    const accessSeconds = tokenSettings.accessToken || 900;

    const endUser = session.endUserId;

    const accessToken = jwt.sign(
      {
        sub: endUser._id,
        projectId: endUser.projectId,
        email: endUser.email,
        username: endUser.username
      },
      conf.accessTokenSecret,
      { expiresIn: accessSeconds }
    );

    // Return format matching AuthResponse (partial) or what refreshTokens expects.
    // SDK refreshTokens function expects: { success: boolean, accessToken: string, refreshToken: string, expiresAt?: number }
    return res.json({
      success: true,
      accessToken,
      refreshToken: refreshToken,
      expiresAt: Date.now() + (accessSeconds * 1000)
    });
  } catch (err) {
    console.error("Token Refresh Error:", err);
    return res.status(500).json({ error: "server_error" });
  }
};

/* ============================================================
   LOCAL AUTH (Email/Password)
 ============================================================ */

/**
 * Register a new end-user locally.
 */
export const registerLocal = async (req, res) => {
  try {
    const { email, password, username, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !username || !actualPublicKey) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const project = await Project.findOne({ publicKey: actualPublicKey, status: "active" });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const existingUser = await EndUser.findOne({ email: normalizedEmail, projectId: project._id });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await EndUser.create({
      email: normalizedEmail,
      password, // Hashed via pre-save hook
      username,
      projectId: project._id,
      provider: "local",
      isVerified: false,
      verificationOTP: otp,
      verificationOTPExpiry: otpExpiry,
    });

    // Send verification email
    await sendVerificationOTP(email, otp, project.name);

    await logEvent({
      developerId: project.developer,
      projectId: project._id,
      action: "USER_REGISTERED",
      description: `New local user (${email}) registered. OTP sent.`,
      category: "user",
      metadata: { ip: req.ip, userAgent: req.headers["user-agent"], resourceId: user._id },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please enter the OTP sent to your email.",
      requireEmailVerification: true,
    });
  } catch (err) {
    console.error("Local Registration Error:", err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

/**
 * Login an end-user locally.
 */
export const loginLocal = async (req, res) => {
  try {
    const { email, password, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !actualPublicKey || !sdk_request) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const project = await Project.findOne({ publicKey: actualPublicKey, status: "active" });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await EndUser.findOne({ email: normalizedEmail, projectId: project._id }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check email verification if required
    if (project.settings?.requireEmailVerification && !user.isVerified) {
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.verificationOTP = otp;
      user.verificationOTPExpiry = otpExpiry;
      await user.save();

      // Send verification email
      await sendVerificationOTP(user.email, otp, project.name);

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new verification code has been sent to your email.",
        error_code: "EMAIL_NOT_VERIFIED",
        sdk_request: sdk_request // Frontend needs this to verify OTP later
      });
    }

    // Success - Initiate SDK Callback
    return await handleSDKCallback(req, res, user, "local", sdk_request);
  } catch (err) {
    console.error("Local Login Error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

/**
 * Verify end-user email via OTP.
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !otp || !actualPublicKey) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOTP = otp.toString().trim();

    const project = await Project.findOne({ publicKey: actualPublicKey, status: "active" });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const user = await EndUser.findOne({
      email: normalizedEmail,
      projectId: project._id,
      verificationOTP: normalizedOTP,
      verificationOTPExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpiry = undefined;
    await user.save();

    await logEvent({
      projectId: user.projectId,
      action: "USER_VERIFIED",
      description: `User (${user.email}) successfully verified their email via OTP.`,
      category: "user",
      metadata: { ip: req.ip, userAgent: req.headers["user-agent"], resourceId: user._id },
    });

    // If sdk_request is present, we should automatically log them in
    if (sdk_request) {
      console.log("✓ OTP Verified, proceeding to SDK Callback for automatic login.");
      // Note: handleSDKCallback will now return a JSON with { redirect: '...' } 
      // which the frontend fetch will receive and should navigate to.
      return await handleSDKCallback(req, res, user, "local", sdk_request);
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/**
 * Resend verification OTP.
 */
export const resendVerification = async (req, res) => {
  try {
    const { email, public_key, publicKey } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !actualPublicKey) {
      return res.status(400).json({ success: false, message: "Missing email or public key" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const project = await Project.findOne({ publicKey: actualPublicKey, status: "active" });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await EndUser.findOne({ email: normalizedEmail, projectId: project._id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOTP = otp;
    user.verificationOTPExpiry = otpExpiry;
    await user.save();

    await sendVerificationOTP(email, otp, project.name);

    return res.status(200).json({
      success: true,
      message: "Verification OTP resent. Please check your inbox.",
    });
  } catch (err) {
    console.error("Resend Verification Error:", err);
    return res.status(500).json({ success: false, message: "Failed to resend verification email" });
  }
};
