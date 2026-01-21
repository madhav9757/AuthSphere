import Developer from "../models/developer.model.js";
import EndUser from "../models/endUsers.models.js";
import { getGoogleAuthURL, getGoogleUser } from "../services/google.service.js";
import { getGithubAuthURL, getGithubUser } from "../services/github.service.js";
import { getDiscordAuthURL, getDiscordUser } from "../services/discord.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { handleSDKCallback, authRequests } from "./sdk.controller.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { conf } from "../configs/env.js";

/* ============================================================
   SOCIAL AUTH HANDLER
============================================================ */
/* ============================================================
   SOCIAL AUTH HANDLER
============================================================ */
const handleSocialAuth = async (res, req, userData, context = {}) => {
  const { sdkRequest, cli } = context;

  console.log("🔗 handleSocialAuth Context:", context);

  // ---------- SDK FLOW ----------
  // Prioritize context.sdkRequest over req.query.sdk_request to avoid ambiguity
  if (sdkRequest) {
    console.log("🔁 SDK login detected:", sdkRequest);
    return await handleSDKFlow(res, req, userData, sdkRequest);
  }

  // ---------- REGULAR DEVELOPER LOGIN ----------
  console.log("🔁 Developer login detected:", userData.email);
  let developer = await Developer.findOne({ email: userData.email });

  if (!developer) {
    let baseUsername = userData.username || userData.email.split("@")[0];
    let username = baseUsername;

    while (await Developer.findOne({ username })) {
      username = baseUsername + Math.floor(Math.random() * 10000);
    }

    developer = await Developer.create({
      email: userData.email,
      username,
      picture: userData.picture || null,
      provider: userData.provider,
      providerId: userData.providerId,
    });
  } else {
    // Update existing developer info
    developer.picture = userData.picture || developer.picture;
    developer.username = userData.username || developer.username;
    await developer.save();
  }

  const accessToken = generateAccessToken(developer._id);
  const refreshToken = generateRefreshToken(developer._id);

  developer.refreshToken = refreshToken;
  await developer.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // ---------- CLI LOGIN ----------
  if (cli === "true" || cli === true) {
    try {
      await fetch(
        `${conf.cliUrl}/cli-update?name=${developer.username}&email=${developer.email}&id=${developer._id}&provider=${userData.provider}`
      );
      return res.send("<script>window.close();</script>");
    } catch (error) {
      console.error("CLI callback failed:", error);
      return res.send("<script>window.close();</script>");
    }
  }

  // ---------- REDIRECT DEVELOPER ----------
  return res.redirect(`${conf.frontendUrl}/dashboard`);
};

/* ============================================================
   SDK FLOW
============================================================ */
const handleSDKFlow = async (res, req, userData, explicitSdkRequestId) => {
  try {
    const sdkRequestId = explicitSdkRequestId || req.query.sdk_request;
    const authRequest = authRequests.get(sdkRequestId);

    if (!authRequest) {
      console.error("❌ SDK Request not found for ID:", sdkRequestId);
      return res.status(400).send("Invalid or expired SDK request");
    }

    // ---------- FIND OR CREATE END USER ----------
    console.log("🔍 Looking for EndUser...");
    let endUser = await EndUser.findOne({
      email: userData.email,
      projectId: authRequest.projectId,
    });

    if (!endUser) {
      console.log("👤 EndUser not found, creating new one...");
      const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10);

      let baseUsername = userData.username || userData.email.split("@")[0];
      let username = baseUsername;

      while (
        await EndUser.findOne({ username, projectId: authRequest.projectId })
      ) {
        username = baseUsername + Math.floor(Math.random() * 10000);
      }

      endUser = await EndUser.create({
        email: userData.email,
        username,
        password: randomPassword,
        projectId: authRequest.projectId,
        picture: userData.picture || "",
        provider: userData.provider || "local",
        providerId: userData.providerId || "",
      });
      console.log("✨ EndUser created:", endUser._id);
    } else {
      console.log("✅ EndUser found, updating profile info...");
      endUser.picture = userData.picture || endUser.picture;
      endUser.username = userData.username || endUser.username;
      await endUser.save();
    }

    // ---------- CALL SDK CALLBACK ----------
    // IMPORTANT: Set req.query.sdk_request for handleSDKCallback to use if it relies on it
    req.query.sdk_request = sdkRequestId;
    console.log("📞 Calling handleSDKCallback with requestId:", sdkRequestId);
    return await handleSDKCallback(req, res, endUser, userData.provider, sdkRequestId);
  } catch (err) {
    console.error("SDK Flow Error:", err);
    return res.status(500).send("Authentication failed. Please try again.");
  }
};

const getContextFromReq = (req) => {
  if (req.query.sdk === 'true') {
    return { type: 'sdk', sdk_request: req.query.sdk_request };
  }
  if (req.query.cli === 'true') {
    return { type: 'cli' };
  }
  return { type: 'dev' };
};

/* ============================================================
   GOOGLE
============================================================ */
export async function googleLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    console.log("🚀 Google Login Context:", context);
    const url = getGoogleAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).send("Could not start Google login");
  }
}

export async function googleCallback(req, res) {
  try {
    const { code, state } = req.query;
    console.log(`📥 Google Callback - Code: ${!!code}, State: ${state}`);

    if (!code) return res.status(400).send("Missing authorization code");

    // Parse state to restore context
    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }
    console.log("🧩 Parsed Parse Context:", context);

    const googleUser = await getGoogleUser(code);
    console.log("✅ Google user:", googleUser.email);

    await handleSocialAuth(res, req, {
      email: googleUser.email,
      username: googleUser.name,
      picture: googleUser.picture,
      provider: "Google",
      providerId: googleUser.sub,
    }, context);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).send("Google authentication failed");
  }
}

/* ============================================================
   GITHUB
============================================================ */
export async function githubLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    console.log("🚀 GitHub Login Context:", context);
    const url = getGithubAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("GitHub login error:", err);
    res.status(500).send("Could not start GitHub login");
  }
}

export async function githubCallback(req, res) {
  try {
    const { code, state } = req.query;
    console.log(`📥 GitHub Callback - Code: ${!!code}, State: ${state}`);

    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }
    console.log("🧩 Parsed GitHub Context:", context);

    const githubUser = await getGithubUser(code);
    console.log("✅ GitHub user:", githubUser.email);

    await handleSocialAuth(res, req, {
      email: githubUser.email,
      username: githubUser.login,
      picture: githubUser.avatar,
      provider: "GitHub",
      providerId: String(githubUser.id),
    }, context);
  } catch (err) {
    console.error("GitHub callback error:", err);
    res.status(500).send("GitHub authentication failed");
  }
}

/* ============================================================
   DISCORD
============================================================ */
export async function discordLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    console.log("🚀 Discord Login Context:", context);
    const url = getDiscordAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("Discord login error:", err);
    res.status(500).send("Could not start Discord login");
  }
}

export async function discordCallback(req, res) {
  try {
    const { code, state } = req.query;
    console.log(`📥 Discord Callback - Code: ${!!code}, State: ${state}`);

    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }
    console.log("🧩 Parsed Discord Context:", context);

    const discordUser = await getDiscordUser(code);
    console.log("✅ Discord user:", discordUser.email);

    await handleSocialAuth(res, req, {
      email: discordUser.email,
      username: discordUser.username,
      picture: discordUser.avatar,
      provider: "Discord",
      providerId: discordUser.id,
    }, context);
  } catch (err) {
    console.error("Discord callback error:", err);
    res.status(500).send("Discord authentication failed");
  }
}
