<div align="center">
  
  <img 
  src="assets/Gemini_Generated_Image_swlzriswlzriswlz.png" 
  alt="AuthSphere Logo" 
  width="120" 
  style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1), transform: scale(3.5);" 
/>

# AuthSphere

### The enterprise-grade identity orchestration engine for modern platforms.

[![Version](https://img.shields.io/badge/version-2.5.0-blue?style=flat-square&logo=github)](https://github.com/madhav9757/AuthSphere)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

  <p align="center">
    <a href="#-ecosystem">Ecosystem</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-sdk-integration">SDK Integration</a> •
    <a href="#-local-development">Setup</a> •
    <a href="#-security-specs">Security</a>
  </p>

---

</div>

## 📖 Overview

**AuthSphere** is a production-ready authentication-as-a-service infrastructure designed for high-scale developer platforms. It abstracts the complexities of **OAuth 2.0**, **OpenID Connect (OIDC)**, and **PKCE flows** into a unified interface, allowing teams to deploy secure identity management in minutes rather than months.

Built with a **zero-trust** philosophy, AuthSphere ensures that every identity interaction is cryptographically verified and fully auditable.

---

## 🏗️ Ecosystem

AuthSphere is architected as a modular monorepo, providing a full-stack experience from infrastructure to client-side SDKs.

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4><a href="./backend">📡 Core Engine (`/backend`)</a></h4>
      <p>The high-performance API backbone. Handles protocol negotiation, JWT issuance (RS256), and identity orchestration.</p>
      <ul>
        <li>Node.js / Express Architecture</li>
        <li>MongoDB Persistence</li>
        <li>OIDC & PKCE Handshaking</li>
        <li>Argon2id Password Hardening</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4><a href="./frontend">🎨 Dev Dashboard (`/frontend`)</a></h4>
      <p>A premium command center for developer teams to manage projects, monitor logs, and configure security policies.</p>
      <ul>
        <li>React 19 / Tailwind CSS 4</li>
        <li>Email Template Customization Engine</li>
        <li>Real-time Technical Telemetry</li>
        <li>Multi-Project Management</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4><a href="./package">📦 Universal SDK (`/package`)</a></h4>
      <p>Lightweight, TypeScript-first SDK for establishing secure handshakes from client environments.</p>
      <ul>
        <li>PKCE Flow Support</li>
        <li>Automated Token Rotation</li>
        <li>Built-in Identity Verification Flows</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4><a href="./test">🧪 Integration Test (`/test`)</a></h4>
      <p>A reference implementation showcasing best practices for SDK integration and session handling.</p>
      <ul>
        <li>React Example Application</li>
        <li>E2E Verification Flow Demo</li>
        <li>Profile Management Sample</li>
      </ul>
    </td>
  </tr>
</table>

---

## ✨ Key Features

<div align="left">
  <table>
    <tr>
      <td><b>🛡️ Standardized Security</b></td>
      <td>Native implementation of OAuth2/OIDC with PKCE (Proof Key for Code Exchange). Argon2id for password storage and AES-256-GCM for project secrets.</td>
    </tr>
    <tr>
      <td><b>🔌 Provider Bridge</b></td>
      <td>Unified abstraction for social providers (Google, GitHub, Discord) with standardized identity claim normalization and stateless session propagation.</td>
    </tr>
    <tr>
      <td><b>📧 Brand Orchestration</b></td>
      <td>Full-fidelity email customization engine. Design your own templates with custom branding, colors, and secondary security metadata toggles.</td>
    </tr>
    <tr>
      <td><b>📊 Deep Observability</b></td>
      <td>Immutable audit logging and technical telemetry. Monitor login success rates, geographical distribution, and provider-specific performance.</td>
    </tr>
    <tr>
      <td><b>🎨 Premium Developer Experience</b></td>
      <td>A stunning dark-mode dashboard with atomic UI elements, glassmorphism, and framer-motion micro-interactions for high-productivity management.</td>
    </tr>
  </table>
</div>

---

## ⚡ SDK Integration

Integrating AuthSphere into your stack is straightforward. Our SDK manages the heavy lifting of cryptographic state management.

### 1. Installation

```bash
npm install @authsphere/sdk
```

### 2. Initialization & Global Handshake

```javascript
import { AuthSphere } from "@authsphere/sdk";

// Initialize the global singleton
AuthSphere.init({
  publicKey: "YOUR_PROJECT_PUBLIC_KEY",
  baseUrl: "https://api.authsphere.io/v1",
  options: {
    debug: process.env.NODE_ENV === "development",
    tokenRenewalThreshold: 60, // seconds before expiry
  },
});
```

### 3. Execution

```javascript
// Trigger a social login handshake
AuthSphere.authorize("google");

// Or handle a local credential exchange
const { user, tokens } = await AuthSphere.loginLocal(email, password);
```

---

## 🚀 Local Development

Follow these steps to spin up the entire cluster in your local environment.

<details>
<summary><b>Step 1: Prerequisites</b></summary>
<ul>
  <li>Node.js (v20+)</li>
  <li>MongoDB (v6.0+)</li>
  <li>Patience & Caffeine ☕</li>
</ul>
</details>

<details>
<summary><b>Step 2: Backend Infrastructure</b></summary>
```bash
cd backend
npm install
cp .env.example .env # Configure your DB and SMTP keys
npm run dev
```
</details>

<details>
<summary><b>Step 3: Frontend Dashboard</b></summary>
```bash
cd frontend
npm install
npm run dev
```
Check the dashboard at `http://localhost:5173`
</details>

<details>
<summary><b>Step 4: Package & Demo</b></summary>
```bash
cd package && npm run build
cd ../test && npm run dev
```
</details>

---

## 🧪 Security Specs

AuthSphere is built on a foundation of industry-hardened cryptographic primitives.

| Spec                 | Protocol / Standard | Technical Implementation                    |
| :------------------- | :------------------ | :------------------------------------------ |
| **Authentication**   | OAuth 2.0 / OIDC    | RFC 6749, RFC 7636 (PKCE)                   |
| **Password Hashing** | Argon2id            | Parallelism: 1, Memory: 64MB, Iterations: 3 |
| **Token Signing**    | RSA-SHA256 (RS256)  | 2048-bit Private/Public Key Pairs           |
| **Data Encryption**  | AES-256-GCM         | Encrypted storage for Project Secrets       |
| **Transport**        | TLS 1.3             | Strict HSTS and Origin verification         |

---

<div align="center">
  <p>Built with ❤️ by <b>Madhav</b> and the AuthSphere open-source community.</p>
  <p>Licensed under the <a href="./LICENSE">MIT License</a>.</p>
</div>
