import React from "react";
import { Command, ArrowRight, CheckCircle2 } from "lucide-react";

export const SplitScreenLogin = () => {
    return (
        <div className="w-full min-h-[700px] lg:grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.7)] bg-white text-slate-900 font-sans">

            {/* Left: Branding & Editorial Image */}
            <div className="hidden lg:flex flex-col justify-between bg-black relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" 
                      alt="Abstract Art" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-12 pr-44 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-2 text-white font-medium tracking-wide/10 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        <Command className="h-4 w-4" /> 
                        <span className="text-sm">AuthSphere Enterprise</span>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-4xl text-white font-serif leading-tight">
                            "Secure access for the modern web."
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-light">End-to-end encrypted sessions</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-light">99.99% Uptime SLA guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-light">GDPR & SOC2 Compliant</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-white/40 text-xs tracking-widest uppercase">
                        © 2024 AuthSphere Inc.
                    </div>
                </div>
            </div>

            {/* Right: Modern Form */}
            <div className="flex flex-col items-center justify-center py-12 px-8 sm:px-16 lg:px-24 bg-white relative">
               <div className="absolute top-0 right-0 p-8">
                  <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    Need help?
                  </a>
               </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="text-slate-500">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">
                                Email address
                            </label>
                            <input
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                id="email"
                                placeholder="name@company.com"
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                id="password"
                                type="password"
                            />
                        </div>

                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 w-full shadow-lg shadow-blue-600/20 group">
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>
                            <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

