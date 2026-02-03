import React from "react";
import { Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck } from "lucide-react";

export const MinimalistLogin = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden font-sans">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row m-4 shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
        
        {/* Left Side: Brand/Visuals */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-linear-to-br from-white/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-black h-5 w-5" />
            </div>
            <span className="text-white font-bold tracking-widest text-xl">NEXUS</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-light text-white leading-tight">
              Design is not just what it <span className="font-serif italic">looks like.</span>
            </h1>
            <p className="text-gray-400 max-w-sm">
              Experience the next generation of secure authentication with our encrypted portal.
            </p>
          </div>

          <div className="flex gap-4 text-xs text-gray-500 uppercase tracking-tighter">
            <span>Security Verified</span>
            <span>•</span>
            <span>v2.0.4</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="group space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-400 group-focus-within:text-black transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input
                  type="email"
                  placeholder="hello@nexus.com"
                  className="w-full bg-transparent border-b border-gray-200 py-3 pl-7 text-sm focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase text-gray-400 group-focus-within:text-black transition-colors">
                  Password
                </label>
                <button className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-gray-200 py-3 pl-7 text-sm focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>

            <button className="w-full group relative flex items-center justify-center bg-black text-white py-4 rounded-xl font-semibold overflow-hidden transition-all active:scale-[0.98]">
              <span className="relative z-10 flex items-center gap-2 group-hover:mr-2 transition-all">
                Continue to Portal <ArrowRight className="h-4 w-4" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-gray-100" />
              <span className="absolute bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Fast Login
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                <Chrome className="h-4 w-4" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                <Github className="h-4 w-4" /> Github
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="font-bold text-black hover:underline underline-offset-4">Create one for free</a>
          </p>
        </div>
      </div>
    </div>
  );
};