import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, Check } from "lucide-react";

export const AnimatedSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [focusedField, setFocusedField] = useState(null);

    const features = [
        { icon: "🚀", text: "Lightning-fast setup" },
        { icon: "🔒", text: "Bank-level security" },
        { icon: "🎨", text: "Beautiful UI components" },
        { icon: "📊", text: "Advanced analytics" },
    ];

    return (
        <div className="min-h-[700px] w-full flex items-center justify-center bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 p-4 font-sans relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left Side - Features */}
                <div className="hidden lg:block text-white space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-sm font-medium">Join 50,000+ developers</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight">
                            Build amazing apps in{" "}
                            <span className="bg-linear-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                minutes
                            </span>
                        </h1>
                        <p className="text-xl text-white/80">
                            Everything you need to ship your next project faster than ever before.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-3xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <span className="text-lg font-medium">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 space-y-6 backdrop-blur-xl bg-opacity-95">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl mb-2 shadow-lg">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-600">Start your journey today</p>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-violet-600 hover:bg-violet-50 transition-all group">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-600">GitHub</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-violet-600 hover:bg-violet-50 transition-all group">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-600">Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">Or with email</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative group">
                                <User
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all ${
                                        focusedField === "name" ? "text-violet-600 scale-110" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField("name")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all"
                                />
                                {formData.name && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all ${
                                        focusedField === "email" ? "text-violet-600 scale-110" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all"
                                />
                                {formData.email && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative group">
                                <Lock
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-all ${
                                        focusedField === "password" ? "text-violet-600 scale-110" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition-all"
                                />
                                {formData.password && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        Create Account
                    </button>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="#" className="text-violet-600 hover:text-violet-700 font-semibold">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};
