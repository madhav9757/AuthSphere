// package/src/index.ts

import { handleAuthCallback } from "./client/callback";
import { redirectToLogin } from "./client/redirect";
import { initAuth } from "./config/options";
import { getToken, getUser, isAuthenticated, logout } from "./client/session";
import { fetchWithAuth } from "./client/api";
import { AuthError } from "./utils/errors";

// =======================
// Config
// =======================
export { initAuth } from "./config/options";

// =======================
// Auth Flow
// =======================
export { redirectToLogin } from "./client/redirect";
export { handleAuthCallback } from "./client/callback";

// =======================
// Session
// =======================
export {
  getUser,
  isAuthenticated,
  logout,
  getToken,
} from "./client/session";

// =======================
// API
// =======================
export { fetchWithAuth } from "./client/api";

// =======================
// Errors
// =======================
export { AuthError } from "./utils/errors";

// =======================
// Types
// =======================
export type {
  AuthConfig,
  AuthUser,
  AuthTokens,
  Provider,
} from "./types";

// =======================
// Default Export (DX Friendly)
// =======================
const AuthSphere = {
  initAuth,
  redirectToLogin,
  handleAuthCallback,
  getUser,
  isAuthenticated,
  logout,
  getToken,
  fetchWithAuth,
  AuthError,
};

export default AuthSphere;
