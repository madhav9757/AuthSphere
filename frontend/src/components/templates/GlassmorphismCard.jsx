import React from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

export const GlassmorphismCard = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans py-2.5">
      {/* Dynamic Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop"
          alt="Gradient"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Fluid Decorative Blobs - No external CSS needed */}
      <div className="absolute top-[15%] left-[10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse [animation-delay:4s]" />

      {/* The Glass Card: Fully Fluid Structure */}
      <div className="relative w-full max-w-[92%] md:max-w-[55%] lg:max-w-[32%] p-[10%] md:p-[6%] lg:p-[4%] rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10 transition-all duration-500 hover:bg-white/15">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-[12%]">
          <div className="w-[4.5rem] h-[4.5rem] rounded-[1.25rem] bg-gradient-to-tr from-white/30 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center mb-[6%] shadow-inner">
            <Lock className="w-[1.8rem] h-[1.8rem] text-white" />
          </div>
          <h2 className="text-[1.75rem] font-bold text-white tracking-tight text-center">
            Security Portal
          </h2>
          <p className="text-white/60 mt-[2%] text-[0.85rem] text-center max-w-[85%] uppercase tracking-widest">
            Authorized Access Only
          </p>
        </div>

        {/* Fluid Form */}
        <form className="flex flex-col gap-[1.25rem]">
          {/* Email Field */}
          <div className="flex flex-col gap-[0.4rem]">
            <label className="text-[0.65rem] font-bold text-white/50 uppercase tracking-[0.2em] ml-[2%]">
              Identity
            </label>
            <div className="relative group">
              <Mail className="absolute left-[5%] top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                placeholder="user@network.com"
                className="w-full bg-black/30 text-white placeholder-white/20 border border-white/10 rounded-2xl py-[4.5%] pl-[16%] pr-[5%] focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all backdrop-blur-md text-[0.95rem]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[0.4rem]">
            <label className="text-[0.65rem] font-bold text-white/50 uppercase tracking-[0.2em] ml-[2%]">
              Passkey
            </label>
            <div className="relative group">
              <Lock className="absolute left-[5%] top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/30 text-white placeholder-white/20 border border-white/10 rounded-2xl py-[4.5%] pl-[16%] pr-[5%] focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all backdrop-blur-md text-[0.95rem]"
              />
            </div>
          </div>

          {/* Links Area */}
          <div className="flex items-center justify-between text-[0.75rem] text-white/50 py-[1%] px-[1%]">
            <label className="flex items-center gap-[0.5rem] cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                className="w-[0.9rem] h-[0.9rem] rounded border-white/20 bg-white/5 text-white focus:ring-0 focus:ring-offset-0"
              />
              Maintain Session
            </label>
            <a href="#" className="hover:text-white transition-colors">
              Recovery
            </a>
          </div>

          {/* Action Button */}
          <button className="w-full bg-white text-black font-bold py-[4.5%] rounded-2xl transition-all hover:bg-opacity-90 active:scale-[0.98] flex items-center justify-center gap-[0.5rem] group text-[0.9rem] uppercase tracking-widest mt-[4%]">
            Authenticate
            <ArrowRight className="w-[1rem] h-[1rem] group-hover:translate-x-[20%] transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-[12%] text-center border-t border-white/10 pt-[8%]">
          <p className="text-white/40 text-[0.75rem] tracking-wide">
            New Operative?{" "}
            <a
              href="#"
              className="text-white font-bold hover:text-blue-300 transition-colors uppercase ml-[1%]"
            >
              Enroll
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
