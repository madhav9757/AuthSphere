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
import { Separator } from "@/components/ui/separator";
import { Github, Chrome, Disc, Loader2, ArrowLeft } from "lucide-react";

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
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-lg border bg-card flex items-center justify-center">
                <img src="/assets/logo.png" alt="AuthSphere" className="h-8 w-8 object-contain dark:invert" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your AuthSphere account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'google', logo: 'https://authjs.dev/img/providers/google.svg', label: 'Google' },
                { id: 'github', logo: 'https://authjs.dev/img/providers/github.svg', label: 'GitHub' },
                { id: 'discord', logo: 'https://authjs.dev/img/providers/discord.svg', label: 'Discord' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSocialLogin(p.id)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border bg-card hover:bg-muted/50 transition-all gap-1 group"
                  title={`Sign in with ${p.label}`}
                >
                  <img src={p.logo} alt={p.label} className="h-5 w-5 grayscale group-hover:grayscale-0 transition-grayscale" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Local Login Form */}
            <form onSubmit={handleLocalLogin} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
