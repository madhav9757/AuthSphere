import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import api from '@/api/axios';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Github, Chrome, Disc, Loader2, Sparkles, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`;
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/developers/login', {
        email,
        password
      });

      if (data.success) {
        toast.success('Login successful!');
        window.location.href = '/dashboard'; // Force full reload to update auth context
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none dark:invert"></div>
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card className="border-border shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white border border-border/50 p-3 rounded-2xl shadow-sm">
                <img src="/assets/logo.png" alt="AuthSphere Logo" className="h-14 w-14 object-contain mix-blend-multiply" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground italic">Welcome back.</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Enterprise identity, simplified for you.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6">
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                type="button"
                className="rounded-xl border-border bg-background hover:bg-muted font-bold transition-all"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                type="button"
                className="rounded-xl border-border bg-background hover:bg-muted font-bold transition-all"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl border-border bg-background hover:bg-muted font-bold transition-all"
              onClick={() => handleSocialLogin('discord')}
              type="button"
            >
              <Disc className="mr-2 h-4 w-4 text-[#5865F2]" />
              Continue with Discord
            </Button>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-card px-3 text-muted-foreground">
                  Or use security key
                </span>
              </div>
            </div>

            {/* Local Login Form */}
            <form onSubmit={handleLocalLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Link to="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-tighter">Forgot Password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground font-medium pt-2">
              New to AuthSphere?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
          SECURED BY AUTH-SPHERE CRYPTO-CORE V2
        </p>
      </div >
    </div >
  );
};

export default Login;