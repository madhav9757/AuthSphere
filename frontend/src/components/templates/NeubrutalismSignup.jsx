import React, { useState } from "react";
import { Mail, Lock, User, Github, Twitter, ArrowRight } from "lucide-react";

export const NeubrutalismSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <div className="min-h-[700px] w-full flex items-center justify-center bg-yellow-300 p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-block bg-black text-yellow-300 px-6 py-3 font-black text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                        SIGN UP
                    </div>
                    <p className="text-black font-bold text-lg">
                        Join the revolution. <br />
                        No BS, just pure functionality.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 space-y-6">
                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-black text-white border-4 border-black px-4 py-3 font-bold hover:bg-white hover:text-black transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                            <Github className="h-5 w-5" />
                            GITHUB
                        </button>
                        <button className="bg-cyan-400 text-black border-4 border-black px-4 py-3 font-bold hover:bg-white transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                            <Twitter className="h-5 w-5" />
                            TWITTER
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-4 border-black border-dashed"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-black font-bold text-sm">OR</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-black text-black mb-2 uppercase">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 border-4 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-black text-black mb-2 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border-4 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-black text-black mb-2 uppercase">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border-4 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 h-5 w-5 border-4 border-black focus:ring-0 focus:ring-offset-0 text-black"
                        />
                        <label htmlFor="terms" className="text-sm font-bold text-black">
                            I agree to sell my soul to the{" "}
                            <span className="underline decoration-4 decoration-pink-400">Terms</span> and{" "}
                            <span className="underline decoration-4 decoration-cyan-400">Privacy Policy</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-pink-400 text-black border-4 border-black py-4 font-black text-lg hover:bg-yellow-300 transition-all active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 group uppercase">
                        Create Account
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </button>

                    {/* Sign In Link */}
                    <p className="text-center text-sm font-bold text-black">
                        Already a member?{" "}
                        <a href="#" className="underline decoration-4 decoration-cyan-400 hover:decoration-pink-400">
                            SIGN IN
                        </a>
                    </p>
                </div>

                {/* Footer Note */}
                <div className="mt-6 bg-black text-yellow-300 border-4 border-black p-4 font-bold text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    ⚡ Join 10,000+ developers building the future
                </div>
            </div>
        </div>
    );
};
