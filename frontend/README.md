# 🌌 AuthSphere Command Center (Frontend)

The AuthSphere Frontend is a premium, high-performance developer command center built with **React 19**. It serves as the primary visual interface for platform engineers to orchestrate identity, manage cryptographic keys, and monitor technical telemetry across infinite projects.

- **Live Deployment:** [auth-sphere-gilt.vercel.app](https://auth-sphere-gilt.vercel.app/)

---

## 🎨 The Design Philosophy: Atomic Glassmorphism

AuthSphere is built on the belief that developer tools should be as stunning as consumer-facing products. Our UI is designed using a custom-built **Atomic Design System** with a "Glassmorphism" aesthetic.

- **Visual Hierarchy**: Uses depth-layering, background blurs, and semi-transparent surfaces to create an immersive management experience.
- **Micro-Interactions**: Powered by **Framer Motion**, every transition, hover state, and data update is executed with sub-second, hardware-accelerated animations.
- **Dark-Mode Native**: Optimized specifically for developers who inhabit high-density code environments, reducing eye strain and improving technical focus.

---

## ✨ Key Capabilities & Modules

### **🚀 1. Project Orchestration Engine**

Manage multiple identity environments (Development, Staging, Production) from a single authenticated session.

- **Rapid Deployment**: Provision new identity vaults with isolated RSA keys in seconds.
- **Context Switching**: Seamlessly jump between project contexts with persistent navigation state.

### **🎨 2. Identity Branding Architect**

A sophisticated, real-time email template designer that gives you total control over the user's "Inbox Experience."

- **Live Visual Lab**: Edit project logos, primary branding colors, and support links with a side-by-side desktop/mobile preview.
- **Dynamic Variable Injection**: Test how OTP (One-Time Password) codes and user-specific metadata appear in your templates.
- **Deliverability Auditing**: Ensure your emails look perfect across all major mail clients (Gmail, Outlook, iOS Mail).

### **🛡️ 3. Cryptographic Security Vault**

A dedicated surface for managing the lifecycle of your project's security credentials.

- **RSA Key Lifecycle**: Generate and rotate 2048-bit RSA Private and Public key pairs used for token signing (RS256).
- **Secret Management**: Securely configure and update Social Provider credentials (Google, GitHub, Discord) with field-level obfuscation.
- **Key Rotation History**: Monitor the age of your project keys and trigger emergency rotations with a single click.

### **📊 4. Live Technical Telemetry**

A real-time, terminal-like monitoring stream that visualizes the "Heartbeat" of your identity infrastructure.

- **WebSocket Synchronization**: Connects directly to the backend telemetry engine to stream events (Login, Auth Exchange, Verify) as they occur.
- **Error Diagnostics**: Instantly identify failed handshakes or invalid PKCE challenges without digging through server logs.
- **Traffic Patterns**: Monitor sign-up velocity and provider distribution through high-fidelity data visualization.

### **🛡️ 5. Advanced User Management (Identity Vault)**

A powerful interface for managing your end-user population with extreme precision.

- **Enforced Suspension**: Instantly block or unblock users. Blocking a user immediately kills all active sessions and prevents all future login attempts.
- **Verification Overrides**: Manually verify users or trigger re-verification flows via the UI.
- **Session Geolocation**: View device fingerprints and IP-based geolocation data for every user session to detect suspicious activity.

---

## 🛠️ Performance Tech Stack

- **Framework**: [React 19](https://react.dev/) (Utilizing Concurrent Rendering and modern hooks).
- **Fluid Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom design tokens.
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/) for accessible, unstyled foundations.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Customized for Atomic Glassmorphism).
- **State Optimization**: [Zustand](https://github.com/pmndrs/zustand) for lightweight, high-performance global state.
- **Motion Engine**: [Framer Motion](https://www.framer.com/motion/) for fluid UI orchestrations.
- **Navigation**: [React Router 7](https://reactrouter.com/).

---

## 🏁 Installation & Development Setup

### **Prerequisites**

- **Node.js**: v20 or higher.
- **API Engine**: Production (default) or a local backend running at `http://localhost:8000`.

### **Quick Setup**

1. **Enter the Workspace**:
   ```bash
   cd frontend
   ```
2. **Sync Dependencies**:
   ```bash
   npm install
   ```
3. **Configure the Environment**:
   If bridging to a local backend, create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. **Ignite the Server**:
   ```bash
   npm run dev
   ```
   _The Command Center will be active at `http://localhost:5173`._

---

Designed with 🌌 for elite developers by the AuthSphere Team.
