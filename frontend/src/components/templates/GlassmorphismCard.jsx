import React from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

export const GlassmorphismCard = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full">
         <img 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop" 
            alt="Gradient" 
            className="w-full h-full object-cover opacity-80"
         />
         <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Floating Blobs (Decoration) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* The Glass Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] z-10 transition-all hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] hover:bg-white/15">
        
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-white/40 to-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 shadow-inner">
                <Lock className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-sm">Welcome Back</h2>
            <p className="text-white/70 mt-2 text-sm">Enter your credentials to access the vault.</p>
        </div>

        <form className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                    <input 
                        type="email" 
                        placeholder="name@example.com"
                        className="w-full bg-black/20 text-white placeholder-white/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-black/20 text-white placeholder-white/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-white/70">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-white/30 bg-white/10 text-pink-500 focus:ring-0 focus:ring-offset-0" />
                    Remember me
                </label>
                <a href="#" className="hover:text-white hover:underline transition-colors">Forgot password?</a>
            </div>

            <button className="w-full bg-linear-to-r from-pink-500/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group backdrop-blur-md border border-white/10">
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <a href="#" className="text-white font-medium hover:underline hover:text-pink-200 transition-colors">Sign up</a>
            </p>
        </div>
      </div>
    </div>
  );
};
