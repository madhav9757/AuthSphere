import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
} from "lucide-react";

const MinimalistLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0b0f19] p-4 font-sans relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full"></div>

      <div className="max-w-[90%] w-full h-full max-h-[90%] flex rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90"></div>

          {/* Noise / glass feel */}
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <div className="w-6 h-6 bg-indigo-600 rounded-md rotate-45"></div>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight">
              Build something <br />
              <span className="text-indigo-200">extraordinary.</span>
            </h1>
          </div>

          <p className="relative z-10 text-indigo-100 text-sm opacity-80 max-w-xs">
            A modern authentication experience crafted for creators who care
            about design & performance.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0d1117]/90 backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider">
                Email
              </label>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all backdrop-blur-md"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider">
                Password
              </label>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all backdrop-blur-md"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-indigo-500" />
                <span>Remember me</span>
              </label>

              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Forgot?
              </a>
            </div>

            {/* BUTTON */}
            <button className="w-full relative overflow-hidden group bg-indigo-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-all"></div>

              <span className="relative z-10">Sign In</span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </button>
          </form>

          {/* SOCIAL */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-[#0d1117] px-3 text-xs text-slate-500 absolute">
                OR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition">
                <Chrome size={18} />
                Google
              </button>

              <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition">
                <Github size={18} />
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MinimalistLogin };
