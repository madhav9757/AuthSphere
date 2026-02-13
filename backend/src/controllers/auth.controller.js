import {
  getGoogleAuthURL,
  getGoogleUser,
} from "../services/auth/google.service.js";
import {
  getGithubAuthURL,
  getGithubUser,
} from "../services/auth/github.service.js";
import {
  getDiscordAuthURL,
  getDiscordUser,
} from "../services/auth/discord.service.js";
import {
  getLinkedinAuthURL,
  getLinkedinUser,
} from "../services/auth/linkedin.service.js";
import {
  getGitlabAuthURL,
  getGitlabUser,
} from "../services/auth/gitlab.service.js";
import {
  getTwitchAuthURL,
  getTwitchUser,
} from "../services/auth/twitch.service.js";
import {
  getBitbucketAuthURL,
  getBitbucketUser,
} from "../services/auth/bitbucket.service.js";
import {
  getMicrosoftAuthURL,
  getMicrosoftUser,
} from "../services/auth/microsoft.service.js";
import authService from "../services/auth/auth.service.js";
import { handleSDKCallback } from "./sdk.controller.js";
import { conf } from "../configs/env.js";

/* ============================================================
   SOCIAL AUTH HANDLER (TRANSPORT LAYER)
 ============================================================ */
const processSocialAuth = async (res, req, userData, context = {}) => {
  try {
    const result = await authService.handleSocialAuth(req, userData, context);

    // SDK Flow callback
    if (result.endUser) {
      req.query.sdk_request = result.sdkRequestId;
      return await handleSDKCallback(
        req,
        res,
        result.endUser,
        result.provider,
        result.sdkRequestId,
      );
    }

    // Developer Login (Cookies & Redirects)
    const { developer, accessToken, refreshToken, cli } = result;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    if (cli === "true" || cli === true) {
      try {
        await fetch(
          `${conf.cliUrl}/cli-update?name=${developer.username}&email=${developer.email}&id=${developer._id}&provider=${userData.provider}`,
        );
        return res.send("<script>window.close();</script>");
      } catch (error) {
        console.error("CLI callback failed:", error);
        return res.send("<script>window.close();</script>");
      }
    }

    return res.redirect(`${conf.frontendUrl}/dashboard`);
  } catch (err) {
    console.error("Social Auth Process Error:", err);
    return res.status(500).send(err.message || "Authentication failed");
  }
};

const getContextFromReq = (req) => {
  if (req.query.sdk === "true")
    return { type: "sdk", sdk_request: req.query.sdk_request };
  if (req.query.cli === "true") return { type: "cli" };
  return { type: "dev" };
};

/* ============================================================
   GOOGLE
 ============================================================ */
export async function googleLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getGoogleAuthURL(context));
  } catch (err) {
    res.status(500).send("Could not start Google login");
  }
}

export async function googleCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === "cli") context.cli = true;
    if (state && state.startsWith("sdk:"))
      context.sdkRequest = state.split(":")[1];

    const googleUser = await getGoogleUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: googleUser.email,
        username: googleUser.name,
        picture: googleUser.picture,
        provider: "Google",
        providerId: googleUser.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("Google authentication failed");
  }
}

/* ============================================================
   GITHUB
 ============================================================ */
export async function githubLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getGithubAuthURL(context));
  } catch (err) {
    res.status(500).send("Could not start GitHub login");
  }
}

export async function githubCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === "cli") context.cli = true;
    if (state && state.startsWith("sdk:"))
      context.sdkRequest = state.split(":")[1];

    const githubUser = await getGithubUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: githubUser.email,
        username: githubUser.login,
        picture: githubUser.avatar,
        provider: "GitHub",
        providerId: String(githubUser.id),
      },
      context,
    );
  } catch (err) {
    res.status(500).send("GitHub authentication failed");
  }
}

/* ============================================================
   DISCORD
 ============================================================ */
export async function discordLogin(req, res) {
  try {
    const context = getContextFromReq(req);
    res.redirect(getDiscordAuthURL(context));
  } catch (err) {
    res.status(500).send("Could not start Discord login");
  }
}

export async function discordCallback(req, res) {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");

    let context = { cli: false, sdkRequest: null };
    if (state === "cli") context.cli = true;
    if (state && state.startsWith("sdk:"))
      context.sdkRequest = state.split(":")[1];

    const discordUser = await getDiscordUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: discordUser.email,
        username: discordUser.username,
        picture: discordUser.avatar,
        provider: "Discord",
        providerId: discordUser.id,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("Discord authentication failed");
  }
}

/* ============================================================
   OTHER PROVIDERS (LINKEDIN, GITLAB, TWITCH, BITBUCKET, MICROSOFT)
 ============================================================ */
export async function linkedinLogin(req, res) {
  try {
    res.redirect(getLinkedinAuthURL(getContextFromReq(req)));
  } catch (err) {
    res.status(500).send("LinkedIn login failed");
  }
}

export async function linkedinCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getLinkedinUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "LinkedIn",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("LinkedIn authentication failed");
  }
}

export async function gitlabLogin(req, res) {
  try {
    res.redirect(getGitlabAuthURL(getContextFromReq(req)));
  } catch (err) {
    res.status(500).send("GitLab login failed");
  }
}

export async function gitlabCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getGitlabUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "GitLab",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("GitLab authentication failed");
  }
}

export async function twitchLogin(req, res) {
  try {
    res.redirect(getTwitchAuthURL(getContextFromReq(req)));
  } catch (err) {
    res.status(500).send("Twitch login failed");
  }
}

export async function twitchCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getTwitchUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Twitch",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("Twitch authentication failed");
  }
}

export async function bitbucketLogin(req, res) {
  try {
    res.redirect(getBitbucketAuthURL(getContextFromReq(req)));
  } catch (err) {
    res.status(500).send("Bitbucket login failed");
  }
}

export async function bitbucketCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getBitbucketUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Bitbucket",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("Bitbucket authentication failed");
  }
}

export async function microsoftLogin(req, res) {
  try {
    res.redirect(getMicrosoftAuthURL(getContextFromReq(req)));
  } catch (err) {
    res.status(500).send("Microsoft login failed");
  }
}

export async function microsoftCallback(req, res) {
  try {
    const { code, state } = req.query;
    const context = {
      cli: state === "cli",
      sdkRequest: state?.startsWith("sdk:") ? state.split(":")[1] : null,
    };
    const user = await getMicrosoftUser(code);
    await processSocialAuth(
      res,
      req,
      {
        email: user.email,
        username: user.username,
        picture: user.picture,
        provider: "Microsoft",
        providerId: user.sub,
      },
      context,
    );
  } catch (err) {
    res.status(500).send("Microsoft authentication failed");
  }
}
