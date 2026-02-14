# 🗄️ AuthSphere Core Engine (Backend)

The AuthSphere Backend is a high-availability, zero-trust identity orchestrator built on the **Node.js** and **Express** stack. It serves as the authoritative source of truth for the entire AuthSphere ecosystem, managing complex OIDC (OpenID Connect) handshakes, cryptographic key lifecycles, and multi-tenant project isolation.

- **Live API Gateway:** [auth-sphere-6s2v.vercel.app](https://auth-sphere-6s2v.vercel.app/)

---

## 🛡️ The Zero-Trust Engine Architecture

AuthSphere is engineered for maximum security with zero compromises on developer velocity. Our backend architecture is designed around the principle that every request must be authenticated and every identity token must be verifiable.

### **1. Cryptographic Identity Signing**

Every identity token (JWT) issued by AuthSphere is signed using **RSA-2048 (RS256)**.

- **Asymmetric Signing**: We use a private key stored in an encrypted vault for signing.
- **Public Verification**: A matching public key is provided to developers, allowing for "Offline Verification." Your server can verify a user's identity without ever having to make a network request to AuthSphere.

### **2. Protocol Fidelity: OIDC & PKCE**

We implement the full **Authorization Code Flow with PKCE (RFC 7636)**.

- **Proof-Key Security**: This protocol ensures that authorization codes cannot be intercepted and used by malicious actors, providing the "Gold Standard" for securing Single Page Applications (SPAs) and Mobile Apps.

### **3. Identity Hardening with Argon2id**

Local credentials (email/password) are never stored in plain text. We utilize **Argon2id**, the winner of the Password Hashing Competition.

- **Memory-Hard Performance**: Unlike older algorithms like Bcrypt, Argon2id is intentionally designed to be memory-intensive, making it nearly impossible to crack using specialized hardware like GPUs or ASICs.

### **4. Field-Level Authenticated Encryption**

Sensitive project configurations — such as Client Secrets for Google/GitHub or SMTP passwords — are stored using **AES-256-GCM**.

- **Authenticated Encryption**: This ensures not only the confidentiality of the data but its integrity as well. If the encrypted data is tampered with in the database, the decryption will fail.

---

## 🚀 Key Features & Capabilities

- **Logical Project Isolation**: AuthSphere provides total multi-tenant separation. A developer's project data is cryptographically and logically siloed, ensuring no cross-contamination.
- **Branding Orchestration Hub**: A sophisticated engine that manages the delivery of user-facing emails. It injects project-specific branding (logos, colors, legal links) into HTML templates in real-time.
- **Social Provider Bridge**: A unified adapter system for **Google, GitHub, and Discord**. We normalize the disparate payloads from these providers into a standardized "Identity Claim."
- **Immutable Audit Logging**: Every critical event — from user registration to project key rotation — is logged in an immutable database with fingerprinting (IP, User-Agent, Location).
- **Verification Lifecycle**: Atomic 6-digit OTP (One-Time Password) generation and verification system that maintains state across redirects via SDK-preserving handshakes.

---

## 🛠️ Deep Tech Stack

- **Runtime**: Node.js (v20+ LTS)
- **Web Framework**: Express.js with high-performance middleware.
- **Persistence**: MongoDB with Mongoose ODM (Object Document Mapper).
- **Security Primitives**: Node's native `crypto` library utilizing `OpenSSL 3.0`.
- **Identity Transport**: JSON Web Tokens (JWT) adhering to RFC 7519.
- **Email Delivery**: Specialized SMTP orchestration via Nodemailer and Resend integration.

---

## 🛤️ API Architecture & Endpoint Map (V1)

### **👥 Project & User Intelligence**

- `GET /api/v1/projects`: Retrieve a list of all identity environments managed by the developer.
- `POST /api/v1/projects`: Provision a new identity vault with isolated keys.
- `PATCH /api/v1/projects/:id`: Update security policies, OIDC callback URIs, or branding metadata.
- `GET /api/v1/projects/:id/users`: A high-throughput stream of project-specific end-users.
- `DELETE /api/v1/projects/:id/users/:uId`: Permanent identity expunging (GDPR/CCPA compliant).
- `PATCH /api/v1/projects/:id/users/:uId/block`: Toggle the account suspension state for a specific user.

### **🔐 The Authentication Hub**

- `POST /api/v1/auth/exchange`: The authoritative PKCE-secured code exchange endpoint.
- `POST /api/v1/auth/register`: Local identity creation with automated verification email trigger.
- `POST /api/v1/auth/login-local`: Secure email/password authentication using Argon2id validation.
- `POST /api/v1/auth/verify-otp`: Resolution endpoint for 6-digit identity challenges.
- `GET /auth/:provider`: Initiation point for social identity handshakes (Google/GitHub/Discord).

### **📡 System Integrity & Telemetry**

- `GET /api/v1/logs/:projectId`: Access the high-fidelity audit trail for a specific project.
- `POST /api/v1/webhooks/test`: Dispatch test identity payloads to configured developer endpoints.

---

## 🏁 Installation & Production Deployment

### **Prerequisites**

- **Node.js**: v20 or higher (required for latest cryptographic support).
- **Database**: MongoDB (Local instance or Atlas cluster).
- **Environment**: A valid `.env` file based on `.env.example`.

### **Quick Setup**

1. **Enter the Workspace**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure the Environment**:
   ```bash
   cp .env.example .env
   ```
   _Note: Generate high-entropy strings for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` using `openssl rand -hex 64`._
4. **Launch the Engine**:
   - **Performance Mode**: `npm start`
   - **Developer Mode**: `npm run dev`

---

Built for 🔐 security and 🚀 scale by the AuthSphere Engineering Team.
