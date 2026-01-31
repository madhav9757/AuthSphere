import React from "react";
import { User, Key } from "lucide-react";

export const GlassmorphismCard = () => {
    return (
        <div className="min-h-[600px] w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative font-sans">

            {/* Background Shapes */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Card */}
            <div className="relative w-full max-w-sm p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white/30 p-4 rounded-full mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">Hello Again!</h2>
                    <p className="text-white/80 text-sm mt-1">Welcome back to the future</p>
                </div>

                <form className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                        />
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                        />
                        <Key className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    </div>

                    <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl shadow-lg hover:bg-opacity-90 transition transform hover:-translate-y-0.5 active:translate-y-0">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="#" className="text-white/70 text-sm hover:text-white hover:underline transition-colors">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};
