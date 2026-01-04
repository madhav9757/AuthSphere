import Developer from "../models/developer.model.js";
import { getGoogleAuthURL, getGoogleUser } from "../services/google.service.js";
import { getGithubAuthURL, getGithubUser } from "../services/github.service.js";
import {
  getDiscordAuthURL,
  getDiscordUser,
} from "../services/discord.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import fetch from "node-fetch";

const handleSocialAuth = async (res, userData, cli) => {
  let developer = await Developer.findOne({ email: userData.email });

  if (!developer) {
    let baseUsername = userData.username || userData.email.split("@")[0];
    let username = baseUsername;

    while (await Developer.findOne({ username })) {
      username = baseUsername + Math.floor(Math.random() * 1000);
    }

    developer = await Developer.create({
      email: userData.email,
      username,
      picture: userData.picture || null,
      provider: userData.provider,
      providerId: userData.providerId,
    });
  }

  const accessToken = generateAccessToken(developer._id);
  const refreshToken = generateRefreshToken(developer._id);

  developer.refreshToken = refreshToken;
  await developer.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  if (cli === "true") {
    await fetch(
      `http://localhost:5001/cli-update?name=${developer.username}&email=${developer.email}&id=${developer._id}&provider=${userData.provider}`
    );
    return res.send("<script>window.close();</script>");
  }

  return res.redirect("http://localhost:5173/dashboard");
};

/* ---------------------- GOOGLE ---------------------- */
export async function googleLogin(req, res) {
  try {
    const url = getGoogleAuthURL();
    res.redirect(url);
  } catch (err) {
    res.status(500).send("Could not start Google login");
  }
}

export async function googleCallback(req, res) {
  try {
    const { code, cli } = req.query;
    if (!code) return res.status(400).send("Missing code");


    const googleUser = await getGoogleUser(code);


    await handleSocialAuth(
      res,
      {
        email: googleUser.email,
        username: googleUser.name,
        picture: googleUser.picture,
        provider: "Google",
        providerId: googleUser.sub,
      },
      cli
    );
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).send("Google authentication failed");
  }
}

/* ---------------------- GITHUB ---------------------- */
export async function githubLogin(req, res) {
  try {
    const url = getGithubAuthURL();
    res.redirect(url);
  } catch (err) {
    res.status(500).send("Could not start GitHub login");
  }
}

export async function githubCallback(req, res) {
  try {
    const { code, cli } = req.query;
    if (!code) return res.status(400).send("Missing code");

    const githubUser = await getGithubUser(code);
    await handleSocialAuth(
      res,
      {
        email: githubUser.email,
        username: githubUser.login, // GitHub uses 'login' for username
        picture: githubUser.avatar_url,
        provider: "GitHub",
        providerId: String(githubUser.id),
      },
      cli
    );
  } catch (err) {
    res.status(500).send("GitHub authentication failed");
  }
}

/* ---------------------- DISCORD ---------------------- */
export async function discordLogin(req, res) {
  try {
    const url = getDiscordAuthURL();
    res.redirect(url);
  } catch (err) {
    res.status(500).send("Could not start Discord login");
  }
}

export async function discordCallback(req, res) {
  try {
    const { code, cli } = req.query;
    if (!code) return res.status(400).send("Missing code");

    const discordUser = await getDiscordUser(code);
    await handleSocialAuth(
      res,
      {
        email: discordUser.email,
        username: discordUser.username,
        picture: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        provider: "Discord",
        providerId: discordUser.id,
      },
      cli
    );
  } catch (err) {
    res.status(500).send("Discord authentication failed");
  }
}
