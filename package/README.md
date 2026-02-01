<div align="center">
  <img src="assets/Gemini_Generated_Image_swlzriswlzriswlz.png" alt="AuthSphere Logo" width="200" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
  
  # 🌐 AuthSphere SDK
  
  **The ultimate TypeScript engine for secure, enterprise-grade authentication.**
  
  [![npm version](https://img.shields.io/npm/v/@authspherejs/sdk.svg?style=for-the-badge&color=007cf0)](https://www.npmjs.com/package/@authspherejs/sdk)
  [![license](https://img.shields.io/npm/l/@authspherejs/sdk.svg?style=for-the-badge&color=7928ca)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/@authspherejs/sdk?style=for-the-badge&color=ff0080)](https://bundlephobia.com/package/@authspherejs/sdk)

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-configuration">Configuration</a> •
    <a href="#-security">Security</a> •
    <a href="#-api-reference">API Reference</a>
  </p>
</div>

---

## ✨ Features

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  <div style="background: rgba(0, 124, 240, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(0, 124, 240, 0.2);">
    <h3>🛡️ Secure by Design</h3>
    <p>Built-in OAuth2 with <strong>PKCE</strong> (Proof Key for Code Exchange) to prevent authorization code injection and man-in-the-middle attacks.</p>
  </div>
  <div style="background: rgba(121, 40, 202, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(121, 40, 202, 0.2);">
    <h3>🔌 Multi-Provider</h3>
    <p>Seamless support for <strong>Google, GitHub, and Discord</strong> out of the box. Unified interface for all providers.</p>
  </div>
  <div style="background: rgba(255, 0, 128, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 0, 128, 0.2);">
    <h3>🔄 Session Management</h3>
    <p>Automated JWT handling, secure token persistence (localStorage/SessionStorage), and ready-to-use logout flows.</p>
  </div>
  <div style="background: rgba(0, 255, 128, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(0, 255, 128, 0.2);">
    <h3>🔐 Local Auth</h3>
    <p>Complete <strong>Email/Password</strong> system with built-in <strong>OTP verification</strong> and email lifecycle management.</p>
  </div>
  <div style="background: rgba(255, 255, 0, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 255, 0, 0.2);">
    <h3>🏗️ Type Safe</h3>
    <p>Written in <strong>TypeScript</strong>. Full IDE support, IntelliSense, and comprehensive type definitions for every flow.</p>
  </div>
</div>

---

## 📺 Demo

<div align="center">
  <img src="assets/demo.gif" alt="AuthSphere Demo" width="100%" style="border-radius: 12px; border: 1px solid #333;" />
  <p><i>Standard authentication flow: Redirect -> login -> Token Exchange -> Session</i></p>
</div>

---

## 🚀 Installation

Install the package via your favorite package manager:

```bash
# npm
npm install @authspherejs/sdk

# pnpm
pnpm add @authspherejs/sdk

# yarn
yarn add @authspherejs/sdk
```

---

## 🛠️ Quick Start

### 1️⃣ Initialize the SDK
Initialize the client at the root of your application (e.g., in `main.ts` or `App.tsx`).

```typescript
import AuthSphere from '@authspherejs/sdk';

AuthSphere.initAuth({
  publicKey: 'your_project_public_key',
  redirectUri: 'http://localhost:3000/callback',
  baseUrl: 'https://api.authsphere.dev' // Your AuthSphere backend URL
});
```

### 2️⃣ Trigger Login
Redirect users to their preferred OAuth provider with a single function call.

```typescript
// Support for 'google', 'github', 'discord'
const login = (provider: 'google' | 'github' | 'discord') => {
  AuthSphere.redirectToLogin(provider);
};
```

### 3️⃣ Handle Callback
Create a route for your `redirectUri` (e.g., `/callback`) to process the exchange.

```typescript
async function handleCallback() {
  try {
    const session = await AuthSphere.handleAuthCallback();
    console.log('User signed in:', session.user);
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### 4️⃣ Local Authentication (New)
For apps requiring custom signup flows with email verification.

```typescript
// Register User
await AuthSphere.register({
  email: 'dev@example.com',
  password: 'Password123!',
  username: 'Madhav'
});

// Login and check verification
try {
  await AuthSphere.loginLocal({ email, password });
} catch (err) {
  if (err.error_code === 'EMAIL_NOT_VERIFIED') {
    // Redirect to your OTP verification page
    console.log('SDK Request ID:', err.sdk_request);
  }
}

// Verify OTP
await AuthSphere.verifyOTP({
  email: 'dev@example.com',
  otp: '123456',
  sdk_request: '...' // Optional for auto-login
});
```

---

## 📖 API Reference

### `initAuth(config: Config)`
Initializes the SDK with your project settings.

### `redirectToLogin(provider: Provider)`
Initiates the OAuth2 PKCE flow for the specified provider.

### `handleAuthCallback()`
Exchanges the authorization code for a session token. Returns a `Promise<Session>`.

### `register(data: RegisterData)`
Registers a new user and triggers the verification email.

### `loginLocal(data: LoginData)`
Authenticates with email/password. Throws `AuthError` if verification is required.

### `verifyOTP(data: OTPData)`
Verifies a 6-digit code. Can perform an automatic login if `sdk_request` is provided.

### `resendVerification(email: string)`
Requests a new 6-digit verification code for the specified email.

### `isAuthenticated()`
Checks if a valid session exists in storage.

### `getUser()`
Returns the profile information of the currently logged-in user.

### `logout()`
Clears the session data and terminates the user session.

---

## 🔧 Configuration Options

| Option | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `publicKey` | `string` | **Yes** | Your project's Identification Key from the dashboard. |
| `redirectUri` | `string` | **Yes** | The URI your app redirects back to after auth. |
| `baseUrl` | `string` | No | Your API server URL (Default: `http://localhost:8000`). |
| `onAuthError` | `Function`| No | Global hook for handling authentication errors. |

---

## 🛡️ Security Note

AuthSphere implements the **Authorization Code Flow with PKCE**, the gold standard for securing public clients (SPAs/Mobile Apps).

> [!IMPORTANT]
> This flow ensures that even if an authorization code is intercepted, it cannot be exchanged for a token without the original client's cryptographically generated "code verifier".

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<hr />

<div align="center">
  <p>Built with ❤️ by the <b>AuthSphere Team</b></p>
  <a href="https://github.com/madhav9757/AuthSphere">GitHub</a> •
  <a href="https://authsphere.dev">Documentation</a> •
  <a href="https://authsphere.dev/discord">Discord</a>
</div>
