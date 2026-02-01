import Developer from "../models/developer.model.js";
import EndUser from "../models/endUsers.models.js";
import { getGoogleAuthURL, getGoogleUser } from "../services/google.service.js";
import { getGithubAuthURL, getGithubUser } from "../services/github.service.js";
import { getDiscordAuthURL, getDiscordUser } from "../services/discord.service.js";
import { getLinkedinAuthURL, getLinkedinUser } from "../services/linkedin.service.js";
import { getGitlabAuthURL, getGitlabUser } from "../services/gitlab.service.js";
import { getTwitchAuthURL, getTwitchUser } from "../services/twitch.service.js";
import { getBitbucketAuthURL, getBitbucketUser } from "../services/bitbucket.service.js";
import { getMicrosoftAuthURL, getMicrosoftUser } from "../services/microsoft.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { handleSDKCallback, authRequests } from "./sdk.controller.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import Project from "../models/project.model.js";
import DeveloperSession from "../models/developerSession.model.js";
import { logEvent } from "../utils/auditLogger.js";
import { parseUserAgent } from "../utils/userAgentParser.js";
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

    // Log account creation
    await logEvent({
      developerId: developer._id,
      action: "ACCOUNT_CREATED",
      description: `New developer account created via ${userData.provider}. Welcome to AuthSphere!`,
      category: "project",
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      }
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

  // ---------- CREATE SESSION RECORD ----------
  try {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let location = { city: "Unknown", country: "Unknown", countryCode: "???" };
    try {
      const geoResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`).catch(() => null);
      if (geoResponse && geoResponse.data && !geoResponse.data.error) {
        location = {
          city: geoResponse.data.city,
          country: geoResponse.data.country_name,
          countryCode: geoResponse.data.country_code
        };
      }
    } catch (geoError) {
      console.error("Geo lookup failed in social auth:", geoError.message);
    }

    await DeveloperSession.create({
      developer: developer._id,
      refreshToken: refreshToken,
      ipAddress: ipAddress,
      userAgent: userAgent,
      deviceInfo: parseUserAgent(userAgent),
      location: location,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Log the event
    await logEvent({
      developerId: developer._id,
      action: "DEVELOPER_LOGIN",
      description: `Successful login via ${userData.provider || 'Social Auth'} from ${location?.city || 'unknown location'}.`,
      category: "security",
      metadata: {
        ip: ipAddress,
        userAgent: userAgent,
        details: { location }
      },
    });
  } catch (sessionError) {
    console.error("Failed to create developer session in social auth:", sessionError.message);
  }

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
    const normalizedEmail = userData.email.toLowerCase().trim();
    let endUser = await EndUser.findOne({
      email: normalizedEmail,
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

      const project = await Project.findById(authRequest.projectId);
      const isVerifiedDefault = project?.settings?.requireEmailVerification ? false : true;

      endUser = await EndUser.create({
        email: userData.email,
        username,
        password: randomPassword,
        projectId: authRequest.projectId,
        picture: userData.picture || "",
        provider: userData.provider || "local",
        providerId: userData.providerId || "",
        isVerified: isVerifiedDefault,
      });
      console.log("✨ EndUser created:", endUser._id);

      // Log the event
      if (project) {
        await logEvent({
          developerId: project.developer,
          projectId: project._id,
          action: "USER_REGISTERED",
          description: `New user (${userData.email}) registered via ${userData.provider || 'Email'}.`,
          category: "user",
          metadata: {
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            resourceId: endUser._id,
          },
        });
      }
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

/* ============================================================
   LINKEDIN
============================================================ */
export async function linkedinLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    const url = getLinkedinAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("LinkedIn login error:", err);
    res.status(500).send("Could not start LinkedIn login");
  }
}

export async function linkedinCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }

    const linkedinUser = await getLinkedinUser(code);

    await handleSocialAuth(res, req, {
      email: linkedinUser.email,
      username: linkedinUser.username,
      picture: linkedinUser.picture,
      provider: "LinkedIn",
      providerId: linkedinUser.sub,
    }, context);
  } catch (err) {
    console.error("LinkedIn callback error:", err);
    res.status(500).send("LinkedIn authentication failed");
  }
}

/* ============================================================
   GITLAB
============================================================ */
export async function gitlabLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    const url = getGitlabAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("GitLab login error:", err);
    res.status(500).send("Could not start GitLab login");
  }
}

export async function gitlabCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }

    const gitlabUser = await getGitlabUser(code);

    await handleSocialAuth(res, req, {
      email: gitlabUser.email,
      username: gitlabUser.username,
      picture: gitlabUser.picture,
      provider: "GitLab",
      providerId: gitlabUser.sub,
    }, context);
  } catch (err) {
    console.error("GitLab callback error:", err);
    res.status(500).send("GitLab authentication failed");
  }
}

/* ============================================================
   TWITCH
============================================================ */
export async function twitchLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    const url = getTwitchAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("Twitch login error:", err);
    res.status(500).send("Could not start Twitch login");
  }
}

export async function twitchCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }

    const twitchUser = await getTwitchUser(code);

    await handleSocialAuth(res, req, {
      email: twitchUser.email,
      username: twitchUser.username,
      picture: twitchUser.picture,
      provider: "Twitch",
      providerId: twitchUser.sub,
    }, context);
  } catch (err) {
    console.error("Twitch callback error:", err);
    res.status(500).send("Twitch authentication failed");
  }
}

/* ============================================================
   BITBUCKET
============================================================ */
export async function bitbucketLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    const url = getBitbucketAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("Bitbucket login error:", err);
    res.status(500).send("Could not start Bitbucket login");
  }
}

export async function bitbucketCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }

    const bitbucketUser = await getBitbucketUser(code);

    await handleSocialAuth(res, req, {
      email: bitbucketUser.email,
      username: bitbucketUser.username,
      picture: bitbucketUser.picture,
      provider: "Bitbucket",
      providerId: bitbucketUser.sub,
    }, context);
  } catch (err) {
    console.error("Bitbucket callback error:", err);
    res.status(500).send("Bitbucket authentication failed");
  }
}

/* ============================================================
   MICROSOFT
============================================================ */
export async function microsoftLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    const url = getMicrosoftAuthURL(context);
    res.redirect(url);
  } catch (err) {
    console.error("Microsoft login error:", err);
    res.status(500).send("Could not start Microsoft login");
  }
}

export async function microsoftCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === 'cli') context.cli = true;
    if (state && state.startsWith('sdk:')) {
      context.sdkRequest = state.split(':')[1];
    }

    const microsoftUser = await getMicrosoftUser(code);

    await handleSocialAuth(res, req, {
      email: microsoftUser.email,
      username: microsoftUser.username,
      picture: microsoftUser.picture,
      provider: "Microsoft",
      providerId: microsoftUser.sub,
    }, context);
  } catch (err) {
    console.error("Microsoft callback error:", err);
    res.status(500).send("Microsoft authentication failed");
  }
}
