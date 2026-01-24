# 📦 @authspherejs/sdk

[![npm version](https://img.shields.io/npm/v/@authspherejs/sdk.svg?style=flat-square)](https://www.npmjs.com/package/@authspherejs/sdk)
[![license](https://img.shields.io/npm/l/@authspherejs/sdk.svg?style=flat-square)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@authspherejs/sdk?style=flat-square)](https://bundlephobia.com/package/@authspherejs/sdk)

**AuthSphere SDK** is the official TypeScript engine for integrating secure, enterprise-grade authentication into your client-side applications. It handles the complexities of OAuth2 + PKCE so you can focus on building your product.

---

## ✨ Features

- **🛡️ Secure by Design**: Built-in OAuth2 with PKCE (Proof Key for Code Exchange) to prevent authorization code injection.
- **🔌 Multi-Provider**: Seamless support for Google, GitHub, and Discord out of the box.
- **🔄 Session Management**: Automated JWT handling, token persistence, and secure logout flows.
- **🏗️ Type Safe**: Written in TypeScript with full IDE support and auto-completion.
- **🌐 Universal**: Light-weight and frame-work agnostic. Works with React, Vue, Svelte, or Vanilla JS.

---

## 🚀 Installation

```bash
npm install @authspherejs/sdk
```

---

## 🛠️ Quick Start

### 1. Initialize the SDK
Initialize the client at the root of your application.

```typescript
import AuthSphere from '@authspherejs/sdk';

AuthSphere.initAuth({
  publicKey: 'your_project_public_key',
  redirectUri: 'http://localhost:3000/callback',
  baseUrl: 'http://localhost:8000' // Your AuthSphere backend URL
});
```

### 2. Implementation Flow

#### Trigger Login
```typescript
// Support for 'google', 'github', 'discord'
const login = (provider: 'google' | 'github' | 'discord') => {
  AuthSphere.redirectToLogin(provider);
};
```

#### Handle Callback
Create a route for your `redirectUri` (e.g., `/callback`) and process the exchange.

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

#### Access User State
```typescript
if (AuthSphere.isAuthenticated()) {
  const user = AuthSphere.getUser();
  console.log(`Welcome, ${user.username}!`);
}
```

#### Logout
```typescript
AuthSphere.logout();
```

---

## 🔧 Configuration Options

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `publicKey` | `string` | **Yes** | Your project's Identification Key from the dashboard. |
| `redirectUri` | `string` | **Yes** | The URI your app redirects back to after auth. |
| `baseUrl` | `string` | No | Your API server URL (Default: `http://localhost:8000`). |
| `onAuthError` | `Function`| No | Global hook for handling authentication errors. |

---

## 🛡️ Security Note

This SDK implements the **Authorization Code Flow with PKCE**, which is the current industry standard for securing public clients (like SPAs and Mobile Apps). It ensures that even if an authorization code is intercepted, it cannot be exchanged for a token without the original client's cryptographically generated "code verifier".

---

## 📄 License

MIT © [AuthSphere Team](https://github.com/madhav9757/AuthSphere)
