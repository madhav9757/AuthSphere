# 🧪 AuthSphere Reference Application (SDK Demo)

This is a comprehensive reference implementation built with **React** and **Vite** designed to showcase the full power of the `@authspherejs/sdk`. It serves as a blueprint for developers building secure, identity-aware applications with AuthSphere.

## 🚀 Orchestration Patterns Demonstrated

- **SDK Bootstrapping**: Standardized initialization patterns for production and local development environments.
- **Provider Handshakes**: Low-latency redirects for **Google, GitHub, and Discord** with automatic PKCE state management.
- **Identity Creation**: End-to-end flow for **Email/Password** registration with integrated OTP triggers.
- **Challenge Resolution**: Implementation of a dedicated **OTP Verification** interface that preserves original login context.
- **Ecxhange Resolution**: Secure processing of the OIDC authorization code to establish high-entropy sessions.
- **Route Guarding**: Pattern for restricting access to sensitive dashboard views based on authenticated identity state.
- **Profile Propagation**: Real-time access to user claims and session metadata across the React component tree.

## 🛠️ Implementation Highlights

### ⚡ Global Identity Context

The SDK is initialized at the application root, ensuring that the `AuthSphere` singleton is pre-warmed for instant authentication events.

### 🛡️ Secure Callbacks

The `/callback` route demonstrates the "Handshake Resolution" pattern, where `AuthSphere.handleAuthCallback()` performs the cryptographic exchange behind the scenes.

### 🔄 State Persistence

Identity is maintained via secure storage, with the `getUser()` hook providing a reactive bridge to the underlying session.

## 🏁 Getting Started

### Prerequisites

1. **Backend Engine**: Verify that the AuthSphere Core is active (Production: `https://auth-sphere-6s2v.vercel.app` or Local: `http://localhost:8000`).
2. **Identity Vault**: Create a project in the [Command Center](https://auth-sphere-gilt.vercel.app/) and retrieve your **Project Public Key**.

### Installation & Launch

1. **Enter Workspace**:

   ```bash
   cd test
   ```

2. **Sync Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Project**:
   Update your SDK initialization in `src/App.jsx` with your project's Public Key:

   ```javascript
   AuthSphere.initAuth({
     publicKey: "YOUR_KEY_HERE",
     baseUrl: "https://auth-sphere-6s2v.vercel.app",
   });
   ```

4. **Ignite App**:
   ```bash
   npm run dev
   ```

## 📸 The Handshake Lifecycle

### Social Identity Flow

1. User selects **"Login with GitHub"**.
2. App generates a `code_verifier` and redirects to the AuthSphere Hub.
3. Upon approval, User returns to `/callback?code=...`.
4. SDK exchanges the code + verifier for tokens.
5. Identity is established and User enters the dashboard.

### Local Identity Flow

1. User provides credentials in the **Sign Up** interface.
2. Backend generates a cryptographic OTP and waits for resolution.
3. User is navigated to the **Challenge Page** (`/verify`).
4. Upon entering the correct 6-digit code, the SDK resolves the pending handshake.
5. Session is established and User enters the dashboard.

---

Designed for 🧬 high-security integration by the AuthSphere Team.
