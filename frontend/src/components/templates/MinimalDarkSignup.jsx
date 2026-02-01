import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";

export const MinimalDarkSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <div className="min-h-[700px] w-full flex items-center justify-center bg-zinc-950 p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4">
                        <div className="w-6 h-6 bg-zinc-950 rounded"></div>
                    </div>
                    <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Join Us</h1>
                    <p className="text-zinc-400 text-sm">Create your account in seconds</p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* GitHub Button */}
                    <button className="w-full bg-white text-zinc-950 py-3.5 rounded-lg font-medium hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group">
                        <Github className="h-5 w-5" />
                        Continue with GitHub
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-zinc-950 text-zinc-500 uppercase tracking-wider">Or</span>
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••••"
                            className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                        <p className="text-xs text-zinc-600">Must be at least 8 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-white text-zinc-950 py-3.5 rounded-lg font-medium hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group mt-8">
                        Create Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-zinc-600 text-center leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="text-zinc-400 hover:text-white underline">
                            Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-zinc-400 hover:text-white underline">
                            Privacy Policy
                        </a>
                    </p>

                    {/* Sign In Link */}
                    <div className="pt-6 border-t border-zinc-800">
                        <p className="text-center text-sm text-zinc-400">
                            Already have an account?{" "}
                            <a href="#" className="text-white hover:underline font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
