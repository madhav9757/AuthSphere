import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github, Code2 } from "lucide-react";

export const MinimalDarkSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <div className="min-h-[700px] w-full flex items-center justify-center bg-[#09090b] p-4 font-sans relative overflow-hidden">
            {/* Starfield Background Effect */}
             <div className="absolute inset-0 opacity-20">
                <div className="absolute h-px w-px bg-white top-10 left-10 box-content shadow-[0_0_2px_#fff]"></div>
                <div className="absolute h-[2px] w-[2px] bg-white top-32 left-1/4 box-content shadow-[0_0_2px_#fff] opacity-50"></div>
                <div className="absolute h-px w-px bg-white bottom-20 right-20 box-content shadow-[0_0_2px_#fff]"></div>
                {/* Radial Gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]"></div>
             </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 rounded-2xl mb-6 ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                        <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 mb-3 tracking-tight">Create Account</h1>
                    <p className="text-zinc-500 text-sm">Join the developer community today.</p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    
                    {/* Name Field */}
                    <div className="group space-y-2">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-white transition-colors">Full Name</label>
                        <div className="relative">
                             <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-white" />
                             <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all hover:border-zinc-700"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="group space-y-2">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-white transition-colors">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-white" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all hover:border-zinc-700"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="group space-y-2">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-white transition-colors">Password</label>
                         <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-white" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••••"
                                className="w-full px-4 py-3 pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all hover:border-zinc-700"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-600 text-right">Must be at least 8 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full mt-4 bg-white text-black font-semibold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5">
                        Create Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[#09090b] text-zinc-500 uppercase tracking-wider">Or continue with</span>
                        </div>
                    </div>

                     {/* GitHub Button */}
                    <button className="w-full bg-zinc-900 border border-zinc-800 text-white py-3.5 rounded-xl font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group">
                        <Github className="h-5 w-5 fill-white" />
                        GitHub
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-zinc-600 text-center leading-relaxed mt-4">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-zinc-500 hover:text-white underline transition-colors">
                            Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-zinc-500 hover:text-white underline transition-colors">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

