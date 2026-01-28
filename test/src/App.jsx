import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthSphere from '@authspherejs/sdk';
import { LogOut, Sparkles, ArrowRight, Github, Chrome, MessageSquare, Shield } from 'lucide-react';

// --- Initialize SDK ---
AuthSphere.initAuth({
  publicKey: '1b2eb92b0fff434e40146da67219a346',
  redirectUri: window.location.origin + '/callback',
  baseUrl: 'http://localhost:8000'
});

// --- Shared Components ---
const Button = ({ children, onClick, variant = 'primary', icon: Icon }) => {
  const base = "flex items-center justify-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-200 active:scale-[0.98]";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:border-slate-400 hover:shadow-sm",
    ghost: "text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2"
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- Callback Page ---
const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const handle = async () => {
      try {
        await AuthSphere.handleAuthCallback();
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    };
    handle();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {!error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-light tracking-wide italic">Authenticating...</p>
        </div>
      ) : (
        <div className="max-w-sm text-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Oops!</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/login')}>Try Again</Button>
        </div>
      )}
    </div>
  );
};

// --- Login Page ---
const Login = () => {
  const handleLogin = (provider) => AuthSphere.redirectToLogin(provider);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-900 font-sans">
      <div className="w-full max-w-[400px] p-8">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-6 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Sparkles className="text-indigo-600" size={28} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Choose a provider to continue</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'google', logo: 'https://authjs.dev/img/providers/google.svg', label: 'Google' },
            { id: 'github', logo: 'https://authjs.dev/img/providers/github.svg', label: 'GitHub' },
            { id: 'discord', logo: 'https://authjs.dev/img/providers/discord.svg', label: 'Discord' },
            { id: 'linkedin', logo: 'https://authjs.dev/img/providers/linkedin.svg', label: 'LinkedIn' },
            { id: 'gitlab', logo: 'https://authjs.dev/img/providers/gitlab.svg', label: 'GitLab' },
            { id: 'twitch', logo: 'https://authjs.dev/img/providers/twitch.svg', label: 'Twitch' },
            { id: 'bitbucket', logo: 'https://authjs.dev/img/providers/bitbucket.svg', label: 'Bitbucket' },
            { id: 'microsoft', logo: 'https://authjs.dev/img/providers/microsoft.svg', label: 'Microsoft' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => handleLogin(p.id)}
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all group gap-3 text-center"
            >
              <div className="h-10 w-10 p-1">
                <img
                  src={p.logo}
                  alt={p.label}
                  className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-indigo-600 truncate w-full">
                {p.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-12 tracking-widest uppercase font-medium">
          Powered by AuthSphere
        </p>
      </div>
    </div>
  );
};

// --- Dashboard (Protected) ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(AuthSphere.getUser());

  useEffect(() => {
    if (!AuthSphere.isAuthenticated()) navigate('/login');
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      <nav className="max-w-5xl mx-auto h-24 flex items-center justify-between px-8">
        <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <Shield className="text-indigo-600" /> AuthSphere
        </div>
        <Button variant="ghost" onClick={() => { AuthSphere.logout(); navigate('/login'); }} icon={LogOut}>
          Logout
        </Button>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <header className="mb-16">
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
            Hi, {user.username.split(' ')[0]}
          </h2>
          <p className="text-slate-500 mt-2">Your session is secure and active.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              {user.picture ? (
                <img src={user.picture} alt="" className="w-12 h-12 rounded-full ring-2 ring-indigo-500/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase">Profile Details</span>
                <p className="text-sm font-semibold text-slate-900">{user.username}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <p className="font-medium text-slate-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">User ID</label>
                <p className="font-mono text-xs text-slate-500 truncate">{user.id || user._id}</p>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">System Status</span>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium">PKCE Handshake Verified</p>
              </div>
            </div>
            <button className="text-sm text-indigo-600 font-semibold hover:underline mt-8 text-left">
              Explore Documentation →
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- App Root ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}