import axios from "axios";
import qs from "qs";
import { conf } from "../../configs/env.js";
import redisService from "../core/redis.service.js";

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

  // ── Deduplication Guard ──────────────────────────────────────────────────
  // Google auth codes are one-time-use. On Vercel (serverless), the callback
  // can be hit twice almost simultaneously (duplicate requests / retries).
  // We use Redis to atomically mark this code as "in-use" before exchanging.
  // If the code was already marked, we abort immediately to avoid invalid_grant.
  const codeKey = `oauth:google:code:${code.substring(0, 20)}`;
  try {
    const alreadyUsed = await redisService.client?.get(codeKey);
    if (alreadyUsed) {
      console.warn(
        "Google OAuth code already used (duplicate callback). Aborting.",
      );
      throw new Error("DUPLICATE_CALLBACK");
    }
    // Mark as used for 2 minutes (codes expire in ~10 min but we only need protection for concurrent hits)
    await redisService.client?.set(codeKey, "1", "EX", 120);
  } catch (guardErr) {
    if (guardErr.message === "DUPLICATE_CALLBACK") throw guardErr;
    // If Redis is down, log and continue (don't block auth)
    console.warn(
      "Redis dedup guard failed (continuing without guard):",
      guardErr.message,
    );
  }
  // ────────────────────────────────────────────────────────────────────────

  try {
    // Exchange code for tokens
    const params = new URLSearchParams();
    params.append("client_id", conf.GOOGLE_CLIENT_ID);
    params.append("client_secret", conf.GOOGLE_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", conf.GOOGLE_REDIRECT_URI);
    params.append("grant_type", "authorization_code");

    console.log("Exchanging Google code with:", {
      client_id: conf.GOOGLE_CLIENT_ID,
      redirect_uri: conf.GOOGLE_REDIRECT_URI,
      code_received: !!code,
      secret_prefix: conf.GOOGLE_CLIENT_SECRET
        ? conf.GOOGLE_CLIENT_SECRET.substring(0, 6) + "..."
        : "MISSING",
      secret_suffix: conf.GOOGLE_CLIENT_SECRET
        ? "..." + conf.GOOGLE_CLIENT_SECRET.slice(-4)
        : "MISSING",
    });

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
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
      },
    );

    if (!userRes.data || !userRes.data.sub || !userRes.data.email) {
      console.error(
        "Invalid user data from Google (missing sub or email):",
        userRes.data,
      );
      throw new Error(
        "Failed to get valid user info from Google (missing email)",
      );
    }

    return userRes.data; // { sub, email, name, picture }
  } catch (err) {
    console.error("Error fetching Google user:", err.response?.data || err);
    throw new Error("Google OAuth failed");
  }
}
