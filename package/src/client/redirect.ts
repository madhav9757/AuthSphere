import { getConfig } from "../config/options";
import { generateCodeVerifier, generateCodeChallenge, generateState } from "../utils/pkce";
import { setCodeVerifier, setState } from "../utils/storage";
import type { Provider } from "../types";

const DEFAULT_BASE_URL = "https://api.authsphere.com";

export async function redirectToLogin(provider: Provider): Promise<void> {
  const { publicKey, redirectUri, baseUrl } = getConfig();

  if (!publicKey || !redirectUri) {
    throw new Error("AuthConfig missing publicKey or redirectUri");
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  // Store for later verification
  setCodeVerifier(codeVerifier);
  setState(state);

  // Build authorization URL
  const authBase = (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  const url = new URL(`${authBase}/sdk/authorize`);

  const params = {
    public_key: publicKey,
    redirect_uri: redirectUri,
    provider,
    response_type: "code",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  };

  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  // Redirect
  window.location.href = url.toString();
}
