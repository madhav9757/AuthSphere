<div align="center">
  <img src="assets/Gemini_Generated_Image_swlzriswlzriswlz.png" alt="AuthSphere Logo" width="200" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
  
  # 🌐 AuthSphere Universal SDK
  
  **The high-performance, zero-trust TypeScript engine for secure identity orchestration.**
  
  [![npm version](https://img.shields.io/npm/v/@authspherejs/sdk.svg?style=for-the-badge&color=007cf0)](https://www.npmjs.com/package/@authspherejs/sdk)
  [![license](https://img.shields.io/npm/l/@authspherejs/sdk.svg?style=for-the-badge&color=7928ca)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/@authspherejs/sdk?style=for-the-badge&color=ff0080)](https://bundlephobia.com/package/@authspherejs/sdk)

  <p align="center">
    <a href="#-core-capabilities">Capabilities</a> •
    <a href="#-automated-pkce-handshake">The Handshake</a> •
    <a href="#-api-reference">API Surface</a> •
    <a href="#-security-architecture">Security</a> •
    <a href="https://auth-sphere-gilt.vercel.app">Command Center</a>
  </p>
</div>

---

## 📖 Overview

The **AuthSphere Universal SDK** is a lightweight, zero-dependency TypeScript library designed to eliminate the complexity of implementing secure authentication. Written from the ground up for the modern web, it abstracts the intricacies of **OpenID Connect (OIDC)** and **PKCE (Proof Key for Code Exchange) flows** into a unified, high-level API.

Whether you are building a React SPA, a Next.js application, or a mobile-first web app, the AuthSphere SDK provides the cryptographic primitives and session management logic needed to establish verified user identity in milliseconds.

---

## ✨ Core Capabilities

### **🛡️ Automated OIDC + PKCE S256**

The SDK is natively compliant with **RFC 7636**. It automatically handles the generation of high-entropy `code_verifier` strings and cryptographically secure `code_challenge` hashes (SHA-256), protecting your application against authorization code injection and Man-in-the-Middle (MITM) attacks.

### **🔌 Universal Provider Handshaking**

A single, unified interface for initiating social identity redirects. One function call handles the state preservation and protocol negotiation for **Google, GitHub, and Discord**.

### **🔄 Stateless Session Management**

The SDK manages the entire lifecycle of Access and Refresh tokens. It includes a built-in renewal engine that handles token rotation automatically before they expire, ensuring your users never face unexpected logout events.

### **🔐 Identity Challenge Engines**

Complete support for local auth flows including **Email/Password** registration and **OTP (One-Time Password)** verification. The SDK preserves the original authentication context (`sdk_request`) across redirects, ensuring a seamless user experience.

---

## 🚀 Installation

Deploy the engine to your project via your preferred package manager:

```bash
# Using npm
npm install @authspherejs/sdk

# Using pnpm
pnpm add @authspherejs/sdk

# Using yarn
yarn add @authspherejs/sdk
```

---

## 🛠️ The 4-Step Handshake Lifecycle

### **1️⃣ Initialize the Global Handshake**

Configure the AuthSphere singleton at the very root of your application (e.g., `main.ts` or `index.js`).

```typescript
import AuthSphere from "@authspherejs/sdk";

AuthSphere.initAuth({
  publicKey: "YOUR_PROJECT_PUB_KEY", // Available in your Command Center
  redirectUri: "https://yourapp.com/callback", // Target for post-auth return
  baseUrl: "https://auth-sphere-6s2v.vercel.app", // The production engine
});
```

### **2️⃣ Initiate Identity Handshake**

Trigger a social login with a single line. The SDK generates the cryptographic state and performs the redirect.

```typescript
// Support for 'google', 'github', 'discord'
AuthSphere.redirectToLogin("github");
```

### **3️⃣ Resolve the Handshake**

Inside your callback route (e.g., `/callback`), exchange the transient authorization code for a high-entropy session.

```typescript
async function resolveIdentity() {
  try {
    // Validates PKCE parameters and establishes the session
    const session = await AuthSphere.handleAuthCallback();
    console.log("Identity Established:", session.user.email);
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("Handshake Resolution Failed:", err.message);
  }
}
```

### **4️⃣ Handle Local Credentials**

For applications requiring custom signup flows with integrated verification cycles.

```typescript
// Initial Attempt
try {
  const session = await AuthSphere.loginLocal({ email, password });
} catch (err) {
  if (err.error_code === "EMAIL_NOT_VERIFIED") {
    // The 'sdk_request' ID preserves the original context for the OTP cycle
    const { sdk_request } = err.metadata;
    router.push(`/verify?req=${sdk_request}`);
  }
}
```

---

## 📖 Comprehensive API Reference

### `initAuth(config: Config)`

Configures the global identity client. Required once at app startup.

### `redirectToLogin(provider: Provider)`

Performs a cryptographically protected redirect to the chosen provider.

### `handleAuthCallback()`

The authoritative resolution function. Exchanges the OIDC code for a `Session`.

### `loginLocal(data: LoginData)`

Authenticates using local credentials. Throws specific error codes for "Unverified" or "Suspended" users.

### `verifyOTP(data: OTPData)`

Resolves a pending identity challenge using a 6-digit cryptographic code.

### `getUser()`

Retrieves the active user profile (if any) from the secure persistence layer.

### `isAuthenticated()`

A synchronous check of the current session state.

---

## 🛡️ Security Architecture & Compliance

The AuthSphere SDK is built to strictly adhere to the **IETF Best Current Practices (BCP)** for securing browser-resident applications.

- **PKCE Mandatory**: Every redirect cycle generates a unique, high-entropy `code_verifier`.
- **State Integrity**: Protects against Cross-Site Request Forgery (CSRF) via atomic state validation.
- **XSS Mitigation**: Designed to minimize exposure of sensitive tokens and work seamlessly alongside strict Content Security Policies (CSP).

---

## 🔧 Technical Specifications

| Parameter     | Type      | Required | Description                                              |
| :------------ | :-------- | :------: | :------------------------------------------------------- |
| `publicKey`   | `string`  | **Yes**  | Your project's Identification Key from the dashboard.    |
| `redirectUri` | `string`  | **Yes**  | The URI your app redirects back to after authentication. |
| `baseUrl`     | `string`  |    No    | Your API server URL (Default: Production).               |
| `storage`     | `Storage` |    No    | Persistence layer (Default: `localStorage`).             |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<hr />

<div align="center">
  <p>Engineered with ❤️ by the <b>AuthSphere Team</b></p>
  <a href="https://github.com/madhav9757/AuthSphere">Source Code</a> •
  <a href="https://auth-sphere-gilt.vercel.app">Command Center</a> •
  <a href="https://www.npmjs.com/package/@authspherejs/sdk">NPM Registry</a>
</div>
