import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AuthSphere, { AuthError } from '@authspherejs/sdk';
import { LogOut, Github, Shield, CheckCircle2, AlertCircle, KeyRound, ArrowRight, BookOpen } from 'lucide-react';
import { Button, Input, Card, AuthLayout } from './components/UI';

// --- Init ---
AuthSphere.initAuth({
  publicKey: "1b2eb92b0fff434e40146da67219a346",
  projectId: "6974743656f9c58eb6ae4203",
  redirectUri: window.location.origin + '/callback',
  baseUrl: 'http://localhost:8000'
});

// --- Pages ---
const Callback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    if (params.get('error') === 'email_not_verified') {
      navigate(`/verify-otp?email=${params.get('email')}${params.get('sdk_request') ? `&sdk_request=${params.get('sdk_request')}` : ''}`);
      return;
    }

    AuthSphere.handleAuthCallback().then(() => navigate('/dashboard')).catch(e => console.error(e));
  }, []);

  return <AuthLayout title="Authenticating..." />;
};

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sdkReq = params.get('sdk_request');
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthSphere.loginLocal(data);
      if (res && res.redirect) {
        window.location.href = res.redirect;
      }
    } catch (err) {
      if (err instanceof AuthError && err.message.includes('not verified')) {
        navigate(`/verify-otp?email=${data.email}&sdk_request=${err.sdk_request || sdkReq}`);
      } else setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Enter your credentials to continue">
      <Card>
        <form onSubmit={submit} className="space-y-1">
          {error && <div className="p-3 mb-4 text-xs font-medium text-red-600 bg-red-50 rounded-lg flex items-center gap-2"><AlertCircle size={14} />{error}</div>}
          <Input label="Email" type="email" placeholder="m@example.com" onChange={e => setData({ ...data, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="••••••••" onChange={e => setData({ ...data, password: e.target.value })} required />
          <Button type="submit" className="w-full mt-2" loading={loading}>Continue</Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-zinc-100" />
          <span className="relative px-3 bg-white text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Or</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => AuthSphere.redirectToLogin('google')} className="w-full h-11">
            <img src="https://authjs.dev/img/providers/google.svg" className="w-4 h-4" alt="G" />
          </Button>
          <Button variant="outline" onClick={() => AuthSphere.redirectToLogin('github')} className="w-full h-11" icon={Github} />
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          New here? <button onClick={() => navigate(`/signup${sdkReq ? `?sdk_request=${sdkReq}` : ''}`)} className="text-zinc-900 font-semibold hover:underline">Create account</button>
        </p>
      </Card>
    </AuthLayout>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sdkReq = params.get('sdk_request');
  const [data, setData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthSphere.register({ ...data, sdk_request: sdkReq });
      navigate(`/verify-otp?email=${data.email}${sdkReq ? `&sdk_request=${sdkReq}` : ''}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join AuthSphere today">
      <Card>
        <form onSubmit={submit}>
          {error && <div className="p-3 mb-4 text-xs font-medium text-red-600 bg-red-50 rounded-lg"><AlertCircle size={14} className="inline mr-2" />{error}</div>}
          <Input label="Username" onChange={e => setData({ ...data, username: e.target.value })} required />
          <Input label="Email" type="email" onChange={e => setData({ ...data, email: e.target.value })} required />
          <Input label="Password" type="password" onChange={e => setData({ ...data, password: e.target.value })} required />
          <Button type="submit" className="w-full mt-2" loading={loading}>Register</Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account? <button onClick={() => navigate('/login')} className="text-zinc-900 font-semibold hover:underline">Sign in</button>
        </p>
      </Card>
    </AuthLayout>
  );
};

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email');
  const sdkReq = params.get('sdk_request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef([]);

  const handleInput = (idx, val) => {
    if (val.length > 1) val = val[val.length - 1];
    const n = [...otp]; n[idx] = val; setOtp(n);
    if (val && idx < 5) refs.current[idx + 1].focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthSphere.verifyOTP({ email, otp: otp.join(''), sdk_request: sdkReq });

      // If the backend returned a redirect URL (typical for cross-origin OAuth flows)
      // If the backend returned a redirect URL (typical for cross-origin OAuth flows)
      if (res && res.redirect) {
        // SPA Optimization: If same origin, use router
        try {
          const url = new URL(res.redirect);
          if (url.origin === window.location.origin) {
            navigate(url.pathname + url.search);
            return;
          }
          window.location.href = res.redirect;
          return;
        } catch (e) {
          window.location.href = res.redirect;
          return;
        }
      }

      if (!sdkReq) navigate('/login'); else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify Email" subtitle={`Enter code sent to ${email}`}>
      <Card className="text-center">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <KeyRound size={20} className="text-zinc-400" />
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((d, i) => (
              <input key={i} ref={el => refs.current[i] = el} value={d} onChange={e => handleInput(i, e.target.value)}
                className="w-12 h-14 text-center text-xl font-bold border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 outline-none transition-all" />
            ))}
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <Button type="submit" className="w-full" loading={loading} disabled={otp.includes('')}>Verify</Button>
        </form>
      </Card>
    </AuthLayout>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = AuthSphere.getUser();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-zinc-100">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold"><Shield size={18} /> AuthSphere</div>
          <Button variant="ghost" size="sm" onClick={() => { AuthSphere.logout(); navigate('/login'); }} icon={LogOut}>Logout</Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 overflow-hidden border-4 border-zinc-100 italic">
            {user.picture ? <img src={user.picture} alt="" /> : user.username[0]}
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Hey, {user.username.split(' ')[0]}!</h2>
          <p className="text-zinc-500 text-sm mb-8">You're securely logged in via {user.provider}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-8">
            <Card className="p-6 text-left flex items-start gap-4">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Verified Account</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
              </div>
            </Card>
            <Card className="p-6 text-left group cursor-pointer hover:border-zinc-900 transition-all">
              <div className="flex justify-between items-start">
                <BookOpen className="text-zinc-400 group-hover:text-zinc-900" size={20} />
                <ArrowRight className="text-zinc-300 group-hover:text-zinc-900" size={16} />
              </div>
              <h4 className="font-semibold text-sm mt-3">Documentation</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Learn how to integrate</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}