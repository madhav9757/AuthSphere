import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthSphere from '@authspherejs/sdk';
import { LogOut, Sparkles, ArrowRight, Github, Chrome, MessageSquare, Shield } from 'lucide-react';

// --- Initialize SDK ---
AuthSphere.initAuth({
  publicKey: '86f2a6184bef2c6d9967a12fe75e516d',
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

        <div className="space-y-3">
          {[
            { id: 'google', icon: Chrome, label: 'Google' },
            { id: 'github', icon: Github, label: 'GitHub' },
            { id: 'discord', icon: MessageSquare, label: 'Discord' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => handleLogin(p.id)}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <p.icon size={20} className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-medium text-slate-700">Continue with {p.label}</span>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
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