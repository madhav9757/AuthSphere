// backend/src/controllers/sdk.controller.js
import Project from "../models/project.model.js";
import Session from "../models/session.model.js";
import EndUser from "../models/endUsers.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";

// Store temporary authorization codes
const authCodes = new Map();

/* ============================================================
   AUTHORIZE - Initiate OAuth flow
============================================================ */
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

    // Validate required parameters
    if (!public_key || !redirect_uri || !provider || !code_challenge) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing required parameters",
      });
    }

    // Verify project exists and is active
    const project = await Project.findOne({
      publicKey: public_key,
      status: "active",
    });

    if (!project) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Invalid public key",
      });
    }

    // Verify redirect URI is registered
    if (!project.redirectUris.includes(redirect_uri)) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Redirect URI not registered",
      });
    }

    // Verify provider is enabled
    if (!project.providers.includes(provider)) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Provider not enabled for this project",
      });
    }

    // Verify code challenge method
    if (code_challenge_method !== "S256") {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Only S256 code challenge method is supported",
      });
    }

    // Store the authorization request data
    const authRequestId = crypto.randomBytes(16).toString("hex");
    authCodes.set(authRequestId, {
      publicKey: public_key,
      redirectUri: redirect_uri,
      provider,
      codeChallenge: code_challenge,
      state,
      projectId: project._id,
      createdAt: Date.now(),
    });

    // Clean up old codes (older than 10 minutes)
    for (const [key, value] of authCodes.entries()) {
      if (Date.now() - value.createdAt > 10 * 60 * 1000) {
        authCodes.delete(key);
      }
    }

    // Redirect to provider OAuth
    const providerAuthUrl = `/auth/${provider}?cli=false&sdk_request=${authRequestId}`;
    return res.redirect(providerAuthUrl);
  } catch (error) {
    console.error("Authorize Error:", error);
    return res.status(500).json({
      error: "server_error",
      error_description: "Internal server error",
    });
  }
};

/* ============================================================
   TOKEN - Exchange code for access token
============================================================ */
export const token = async (req, res) => {
  try {
    const { code, public_key, redirect_uri, code_verifier } = req.body;

    if (!code || !public_key || !redirect_uri || !code_verifier) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing required parameters",
      });
    }

    // Retrieve authorization data
    const authData = authCodes.get(code);
    if (!authData) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code",
      });
    }

    // Verify public key and redirect URI match
    if (
      authData.publicKey !== public_key ||
      authData.redirectUri !== redirect_uri
    ) {
      authCodes.delete(code);
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Client mismatch",
      });
    }

    // Verify PKCE code challenge
    const hash = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64url");

    if (hash !== authData.codeChallenge) {
      authCodes.delete(code);
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid code verifier",
      });
    }

    // Get user from code
    const endUser = authData.endUser;
    if (!endUser) {
      authCodes.delete(code);
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "No user associated with code",
      });
    }

    // Delete the used code
    authCodes.delete(code);

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: endUser._id,
        projectId: authData.projectId,
      },
      conf.accessTokenSecret,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        userId: endUser._id,
        projectId: authData.projectId,
      },
      conf.refreshTokenSecret,
      { expiresIn: "10d" }
    );

    // Create session
    await Session.create({
      token: refreshToken,
      endUserId: endUser._id,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: endUser._id,
        email: endUser.email,
        username: endUser.username,
        provider: authData.provider,
      },
    });
  } catch (error) {
    console.error("Token Error:", error);
    return res.status(500).json({
      error: "server_error",
      error_description: "Internal server error",
    });
  }
};

/* ============================================================
   REFRESH - Refresh access token
============================================================ */
export const refresh = async (req, res) => {
  try {
    const { refresh_token, public_key } = req.body;

    if (!refresh_token || !public_key) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing required parameters",
      });
    }

    // Verify project
    const project = await Project.findOne({ publicKey: public_key });
    if (!project) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Invalid public key",
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, conf.refreshTokenSecret);
    } catch (error) {
      return res.status(401).json({
        error: "invalid_grant",
        error_description: "Invalid or expired refresh token",
      });
    }

    // Verify session exists
    const session = await Session.findOne({
      token: refresh_token,
      endUserId: decoded.userId,
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        error: "invalid_grant",
        error_description: "Refresh token expired or revoked",
      });
    }

    // Get user
    const endUser = await EndUser.findById(decoded.userId).select("-password");
    if (!endUser) {
      return res.status(401).json({
        error: "invalid_grant",
        error_description: "User not found",
      });
    }

    // Generate new tokens
    const accessToken = jwt.sign(
      {
        userId: endUser._id,
        projectId: decoded.projectId,
      },
      conf.accessTokenSecret,
      { expiresIn: "1d" }
    );

    const newRefreshToken = jwt.sign(
      {
        userId: endUser._id,
        projectId: decoded.projectId,
      },
      conf.refreshTokenSecret,
      { expiresIn: "10d" }
    );

    // Update session with new refresh token
    session.token = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    await session.save();

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh Error:", error);
    return res.status(500).json({
      error: "server_error",
      error_description: "Internal server error",
    });
  }
};

/* ============================================================
   CALLBACK HANDLER - Handle OAuth provider callback for SDK
============================================================ */
export const handleSDKCallback = async (req, res, endUser, provider) => {
  try {
    const { sdk_request } = req.query;

    if (!sdk_request) {
      return null; // Not an SDK request
    }

    const authData = authCodes.get(sdk_request);
    if (!authData) {
      return res.status(400).send("Invalid or expired SDK request");
    }

    // Generate authorization code
    const code = crypto.randomBytes(32).toString("hex");

    // Store code with user data
    authCodes.set(code, {
      ...authData,
      endUser,
      createdAt: Date.now(),
    });

    // Delete the request ID
    authCodes.delete(sdk_request);

    // Build redirect URL
    const redirectUrl = new URL(authData.redirectUri);
    redirectUrl.searchParams.set("code", code);
    if (authData.state) {
      redirectUrl.searchParams.set("state", authData.state);
    }

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("SDK Callback Error:", error);
    return res.status(500).send("Authentication failed");
  }
};

export { authCodes };