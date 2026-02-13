import axios from "axios";
import { conf } from "../../configs/env.js";

/**
 * Returns GitHub OAuth authorization URL
 */
/**
 * Returns GitHub OAuth authorization URL
 * @param {object} context
 */
export function getGithubAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request) {
    state = `sdk:${context.sdk_request}`;
  }
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.GITHUB_CLIENT_ID,
    redirect_uri: conf.GITHUB_REDIRECT_URI,
    scope: "read:user user:email",
    allow_signup: "true",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange code for access token and get user info
 */
export async function getGithubUser(code) {
  if (!code) throw new Error("No code provided from GitHub callback");

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: conf.GITHUB_CLIENT_ID,
        client_secret: conf.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: conf.GITHUB_REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenRes.data;
    if (!access_token) throw new Error("Failed to get access token from GitHub");

    // Get user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    // Get primary email
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const primaryEmail = emailsRes.data.find((e) => e.primary)?.email;

    return {
      id: userRes.data.id,
      login: userRes.data.login,
      name: userRes.data.name,
      email: primaryEmail,
      avatar: userRes.data.avatar_url,
    };
  } catch (err) {
    console.error("GitHub OAuth error:", err.response?.data || err);
    throw new Error("GitHub OAuth failed");
  }
}
