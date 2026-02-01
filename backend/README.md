# 🗄️ AuthSphere Backend

The AuthSphere Backend is a robust Node.js and Express server that powers the AuthSphere ecosystem. It manages user authentication, project configurations, and OAuth2/PKCE flows.

## 🚀 Key Features

- **Project Management**: API for creating and managing developer projects.
- **OAuth2 Engine**: Implements the Authorization Code Flow with PKCE for secure client-side authentication.
- **Social Providers**: Integrated with Google, GitHub, and Discord for one-click logins.
- **Session Management**: Securely handles user sessions using JWTs and secure cookies.
- **Email Verification**: Built-in OTP generation, email delivery via SMTP, and verification enforcement.
- **User Management**: Administrative APIs to delete project users or manually toggle verification status.
- **Database**: Uses MongoDB (via Mongoose) for persistent storage of projects, users, and sessions.
- **Security**: Implements CORS, bcrypt for password hashing, and token rotation.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment.
- **Express**: Web framework for the API.
- **MongoDB & Mongoose**: Database and ODM.
- **JSON Web Tokens (JWT)**: For stateless authentication.
- **Axios**: For making requests to social provider APIs.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A running MongoDB instance (Local or Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` root and populate it with the following:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_long_random_string
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=another_long_random_string
   REFRESH_TOKEN_EXPIRY=10d
   
   # Social Providers (Optional)
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
   
   DISCORD_CLIENT_ID=your_id
   DISCORD_CLIENT_SECRET=your_secret
   DISCORD_REDIRECT_URI=http://localhost:8000/auth/discord/callback
   ```

### Running the Server

- **Development Mode** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

## 🛤️ API Endpoints

### Project APIs
- `GET /api/v1/projects`: List all developer projects.
- `POST /api/v1/projects`: Create a new project.
- `GET /api/v1/projects/:projectId`: Get project details.
- `PATCH /api/v1/projects/:projectId`: Update project settings.
- `GET /api/v1/projects/:projectId/users`: List all end-users for a project.
- `DELETE /api/v1/projects/:projectId/users/:userId`: Permanent user deletion.
- `PATCH /api/v1/projects/:projectId/users/:userId/verify`: Toggle user verification.

### Auth Hub APIs
- `POST /api/v1/auth/exchange`: Exchange PKCE code for a session token.
- `GET /api/v1/auth/session`: Validate and retrieve session data.
- `POST /api/v1/auth/verify-otp`: Verify 6-digit OTP for email verification.
- `GET /auth/:provider`: Initiate social provider redirect.
- `GET /auth/:provider/callback`: Handle social provider callback.

## 🛡️ Security

- **PKCE**: Mandatory for all client-side authentication flows.
- **JWT**: Used for secure, verifiable session identification.
- **Password Hashing**: User passwords (if any) are hashed with Bcrypt.

---

Built with ❤️ by the AuthSphere Team.
