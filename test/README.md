# 🧪 AuthSphere SDK Demo App

This is a demonstration project built with React and Vite to showcase the seamless integration of the `@authspherejs/sdk`. It provides a practical example of how to implement a full authentication flow from scratch.

## 🚀 Key Features Demonstrated

- **SDK Initialization**: How to properly configure the SDK with a Public Key.
- **Provider Login**: Implementing redirects for Google, GitHub, and Discord.
- **Callback Handling**: Processing the OAuth2 response to establish a secure session.
- **Protected Routes**: Restricting access to dashboard views based on auth status.
- **User Hook**: Accessing user profile data and session state throughout the app.
- **Logout Flow**: Safely clearing sessions and redirecting users.

## 🛠️ Implementation Highlights

### SDK Setup
The SDK is initialized in the main entry point to ensure auth state is available globally.

### Secure Callbacks
The `/callback` route demonstrates the use of `AuthSphere.handleAuthCallback()` which handles the PKCE code exchange automatically.

### Session Management
Once authenticated, the user profile is accessible via the SDK's `getUser()` method, persisting across page reloads.

## 🏁 Getting Started

### Prerequisites

1.  **Run the Backend**: Ensure the AuthSphere backend is running at `http://localhost:8000`.
2.  **Create a Project**: Go to the [Frontend Dashboard](http://localhost:5173), create a project, and get your **Public Key**.

### Installation

1.  Navigate to the test directory:
    ```bash
    cd test
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Update Config:
    Open `src/App.jsx` (or your config file) and replace the `publicKey` with your project's key.

4.  Run the App:
    ```bash
    npm run dev
    ```

## 📸 Common Flow

1. User clicks **"Login with Google"**.
2. App redirects to AuthSphere Auth Hub.
3. User authenticates.
4. AuthSphere redirects back to `http://localhost:5174/callback?code=...`.
5. SDK exchanges code for tokens.
6. User is redirected to `/dashboard`.

---

Built with ❤️ by the AuthSphere Team.
