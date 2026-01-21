# 📦 @authsphere/sdk

The official TypeScript SDK for integrating AuthSphere authentication into your client-side applications. Built with security in mind, it provides seamless OAuth2 flow with PKCE, session management, and type-safe user data.

## ✨ Features

- **🛡️ Secure OAuth2/PKCE**: Automated handling of the most secure frontend auth flow.
- **🔌 Multi-Provider Support**: Easy redirection to Google, GitHub, and Discord.
- **🔄 Session Persistence**: Built-in handling of JWT tokens and user profiles.
- **🏗️ TypeScript Native**: Full type definitions for a better developer experience.
- **🌐 Framework Agnostic**: Works with React, Vue, Svelte, or Vanilla JS.

## 🚀 Installation

```bash
npm install @authsphere/sdk
```

## 🛠️ Usage

### 1. Initialization

Call `initAuth` at the entry point of your application.

```typescript
import AuthSphere from '@authsphere/sdk';

AuthSphere.initAuth({
  publicKey: 'your_project_public_key',
  redirectUri: 'http://localhost:3000/callback',
  baseUrl: 'http://localhost:8000' // Your AuthSphere backend URL
});
```

### 2. Login Redirect

Trigger the login flow when a user clicks a login button.

```typescript
// Support for 'google', 'github', 'discord'
AuthSphere.redirectToLogin('google');
```

### 3. Handle Callback

In your callback route (e.g., `/callback`), handle the code exchange.

```typescript
async function handleCallback() {
  try {
    const session = await AuthSphere.handleAuthCallback();
    console.log('Logged in user:', session.user);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Auth failed:', error);
  }
}
```

### 4. Check Authentication

```typescript
if (AuthSphere.isAuthenticated()) {
  const user = AuthSphere.getUser();
  console.log('Hello,', user.name);
}
```

### 5. Logout

```typescript
AuthSphere.logout();
```

## 🔧 Configuration Options

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `publicKey` | `string` | Yes | Found in your AuthSphere Dashboard. |
| `redirectUri` | `string` | Yes | The URI AuthSphere redirects back to. |
| `baseUrl` | `string` | No | Your backend API URL (Default: `http://localhost:8000`). |
| `onAuthError` | `Function` | No | Callback for handling global auth errors. |

## 📄 License

MIT © AuthSphere Team
