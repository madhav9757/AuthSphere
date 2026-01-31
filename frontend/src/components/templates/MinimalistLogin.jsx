import React from "react";
import { Mail, Lock, Github, Chrome, ArrowRight } from "lucide-react";

export const MinimalistLogin = () => {
    return (
        <div className="min-h-[600px] w-full flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center space-y-2">
                    <div className="h-10 w-10 bg-black rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-sm text-gray-500">
                        Enter your email to sign in to your account
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none" htmlFor="pass">
                                Password
                            </label>
                            <a href="#" className="text-xs text-gray-500 hover:text-black hover:underline">Forgot?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                id="pass"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 w-full bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20">
                        Sign In <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 text-gray-700">
                        <Github className="h-4 w-4" /> Github
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 text-gray-700">
                        <Chrome className="h-4 w-4" /> Google
                    </button>
                </div>
            </div>
        </div>
    );
};
