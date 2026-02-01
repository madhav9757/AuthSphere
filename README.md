# 🌌 AuthSphere

AuthSphere is a comprehensive, enterprise-ready authentication platform designed to simplify identity management for developers. It provides a secure, scalable, and easy-to-integrate solution for handling user authentication, social logins, and project management.

## 🏗️ Project Architecture

The AuthSphere ecosystem consists of four main components:

- **[`/backend`](./backend)**: The core API server built with Express and MongoDB. It handles OAuth2 flows, PKCE validation, session management, and project configurations.
- **[`/frontend`](./frontend)**: A premium developer dashboard built with React 19 and Tailwind CSS. This is where developers manage their projects, API keys, and view user analytics.
- **[`/package`](./package)**: The official [`@authspherejs/sdk`](https://www.npmjs.com/package/@authspherejs/sdk) written in TypeScript. It provides a seamless way for developers to integrate AuthSphere into their client-side applications with built-in PKCE support.
- **[`/test`](./test)**: A demonstration React application showcasing the implementation and capabilities of the AuthSphere SDK.

## ✨ Key Features

- **🛡️ Secure by Design**: Built-in support for OAuth2 with PKCE (Proof Key for Code Exchange).
- **📧 Email Verification**: Automated OTP-based verification flow for local and social signups.
- **🔌 Multi-Provider Support**: Easily enable Google, GitHub, and Discord authentication.
- **👤 User Management**: Full developer control to delete users or toggle verification status.
- **📊 Developer Dashboard**: Manage multiple projects, rotate API keys, and monitor user logins.
- **📦 Lightweight SDK**: A type-safe TypeScript SDK for effortless integration.
- **🎨 Premium UI/UX**: Dark-mode first design with smooth animations and responsive layouts.

## 📦 Installation

Social authentication is as simple as:

```bash
npm install @authspherejs/sdk
```

## 🚀 Quick Start

To get the entire ecosystem running locally, follow these steps:

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 3. Package Setup (SDK)
```bash
cd package
npm install
npm run build
```

### 4. Frontend Setup (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

### 5. Run Demo App
```bash
cd test
npm install
npm run dev
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
- **Frontend**: React 19, Vite, Tailwind CSS 4, Radix UI, Lucide Icons.
- **SDK**: TypeScript, Fetch API, PKCE.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the AuthSphere Team.
