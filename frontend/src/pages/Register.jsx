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
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Github, Chrome, Disc, Loader2, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, username, password, confirmPassword } = formData;

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/developers/register', {
        email,
        username,
        password,
      });

      if (data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none dark:invert"></div>
      <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-lg relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
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
            <CardTitle className="text-3xl font-black tracking-tight text-foreground italic">Start building.</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Join 10k+ developers securing their future with AuthSphere.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6">
            {/* Social Registration */}
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

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-card px-3 text-muted-foreground">
                  Or manual onboarding
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="modern_dev"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Work Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jessica@studio.io"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" name="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" name="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirm</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 transition-all py-6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full md:col-span-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 shadow-lg shadow-indigo-500/20 transition-all mt-2 active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Provisioning Account...
                  </>
                ) : (
                  'Create Secure Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-center text-sm text-muted-foreground font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6 text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
          <span>GDPR Ready</span>
          <span>AES-256</span>
          <span>SOC2 Type II</span>
        </div>
      </div>
    </div>
  );
};

export default Register;