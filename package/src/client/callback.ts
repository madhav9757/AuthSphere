import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";
import {
  getCodeVerifier,
  clearCodeVerifier,
  getState,
  clearState,
  setAccessToken,
  setRefreshToken,
  setUser,
  setExpiresAt,
} from "../utils/storage";
import type { AuthResponse } from "../types";

const DEFAULT_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_BASE_URL = "https://api.authsphere.com";

export async function handleAuthCallback(): Promise<AuthResponse | null> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const error = params.get("error");

  if (error) {
    const errorDescription = params.get("error_description") || "Authentication failed";
    throw new AuthError(`${error}: ${errorDescription}`);
  }

  if (!code) return null;

  // CSRF protection
  const storedState = getState();
  if (!storedState || state !== storedState) {
    clearState();
    throw new AuthError("Invalid state parameter - possible CSRF attack");
  }
  clearState();

  // PKCE code verifier
  const codeVerifier = getCodeVerifier();
  if (!codeVerifier) throw new AuthError("Missing code verifier - invalid flow");
  clearCodeVerifier();

  // Config
  const { publicKey, redirectUri, baseUrl } = getConfig();

  if (!publicKey || !redirectUri) {
    throw new AuthError("AuthConfig missing publicKey or redirectUri");
  }

  const tokenUrl = `${(baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "")}/sdk/token`;

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        public_key: publicKey,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new AuthError(errorData.message || "Token exchange failed");
    }

    const data = (await res.json().catch(() => ({}))) as AuthResponse;

    if (!data || !data.accessToken || !data.user) {
      throw new AuthError("Invalid token response from server");
    }

    // Store tokens and user
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);

    const expiresAt = Date.now() + DEFAULT_TOKEN_EXPIRY; // 24h from now
    setExpiresAt(expiresAt);

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);

    return data;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError(`Authentication failed: ${(err as Error).message}`);
  }
}
