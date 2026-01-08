import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setExpiresAt,
  clearAll,
} from "../utils/storage";
import type { RefreshTokenRequest } from "../types";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const DEFAULT_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_BASE_URL = "https://api.authsphere.com";

export async function refreshTokens(): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;

  refreshPromise = (async () => {
    const { publicKey, baseUrl, onTokenRefresh, onAuthError } = getConfig();
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      refreshPromise = null;
      throw new AuthError("No refresh token available");
    }

    try {
      if (!publicKey) throw new AuthError("AuthConfig missing publicKey");

      const body: RefreshTokenRequest = {
        refreshToken,
        publicKey,
      };

      const res = await fetch(`${(baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "")}/sdk/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new AuthError(errorData.message || "Token refresh failed");
      }

      const data = await res.json() as { accessToken: string; refreshToken: string; expiresAt?: number };

      if (!data.accessToken || !data.refreshToken) {
        throw new AuthError("Invalid token response from server");
      }

      // Store tokens
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      const expiresAt = data.expiresAt || Date.now() + DEFAULT_TOKEN_EXPIRY;
      setExpiresAt(expiresAt);

      if (onTokenRefresh) {
        onTokenRefresh({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt,
        });
      }
    } catch (err) {
      clearAll();
      const error = err instanceof AuthError ? err : new AuthError("Token refresh failed: " + (err as Error).message);
      if (onAuthError) onAuthError(error);
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
