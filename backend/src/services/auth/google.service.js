import axios from "axios";
import qs from "qs";
import { conf } from "../../configs/env.js";

/**
 * Returns Google OAuth 2.0 authorization URL
 * @param {object} context
 * @param {"dev" | "sdk" | "cli"} context.type
 * @param {string} [context.sdk_request]
 */
export function getGoogleAuthURL(context = { type: "dev" }) {
  let state = "dev";

  if (context.type === "sdk" && context.sdk_request) {
    state = `sdk:${context.sdk_request}`;
  }

  if (context.type === "cli") {
    state = "cli";
  }

  const params = new URLSearchParams({
    client_id: conf.GOOGLE_CLIENT_ID,
    redirect_uri: conf.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state, // 🔥 REQUIRED
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}


/**
 * Exchanges authorization code for access token and fetches user info
 * @param {string} code - Authorization code from Google
 * @returns {Promise<object>} - Google user info (sub, email, name, picture)
 */
export async function getGoogleUser(code) {
  if (!code) throw new Error("No code provided from Google callback");

  try {
    // Exchange code for tokens (application/x-www-form-urlencoded required)
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        client_id: conf.GOOGLE_CLIENT_ID,
        client_secret: conf.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: conf.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!tokenRes.data.access_token) {
      console.error("No access_token in token response:", tokenRes.data);
      throw new Error("Failed to get access_token from Google");
    }

    const { access_token } = tokenRes.data;

    // Fetch user info via OIDC
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userRes.data || !userRes.data.sub) {
      console.error("Invalid user data from Google:", userRes.data);
      throw new Error("Failed to get valid user info from Google");
    }

    return userRes.data; // { sub, email, name, picture }
  } catch (err) {
    console.error("Error fetching Google user:", err.response?.data || err);
    throw new Error("Google OAuth failed");
  }
}
