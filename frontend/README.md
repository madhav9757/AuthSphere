# 🌌 AuthSphere Frontend Dashboard

The AuthSphere Frontend is a premium, high-performance developer dashboard built with React 19. It allows developers to manage their authentication projects, view user analytics, and configure social login providers.

## ✨ Key Features

- **🚀 Project Management**: Create and configure multiple authentication environments with ease.
- **🎨 Branding Orchestration**: A real-time email template editor with live desktop/mobile preview and deliverability testing.
- **🛡️ API Key Hub**: Generate and rotate 2048-bit RSA Public and Private keys securely.
- **🛡️ Session Audit**: Detailed management of developer sessions with device/location fingerprinting.
- **📊 User Analytics**: High-density monitoring of sign-ups, active sessions, and provider distribution.
- **⚙️ Provider Configuration**: Standardized configuration suite for Google, GitHub, and Discord.
- **📖 Documentation Engine**: Built-in interactive documentation with copy-paste code samples for all flows.
- **✨ Premium UI**: Breathtaking dark-mode experience with glassmorphism, framer-motion, and atomic UI components.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend running at `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment (Optional):
   The frontend is pre-configured to talk to `localhost:8000`. You can adjust this in `src/config/api.js` if necessary.

4. Run Development Server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/src/components`: Reusable UI components (buttons, cards, inputs).
- `/src/pages`: Main page views (Dashboard, ProjectDetail, Docs).
- `/src/hooks`: Custom React hooks for auth and data fetching.
- `/src/services`: API abstraction layer using Axios.
- `/src/layouts`: Dashboard and Auth layouts.

---

Built with ❤️ by the AuthSphere Team.
