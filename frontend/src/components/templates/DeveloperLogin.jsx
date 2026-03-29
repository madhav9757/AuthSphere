import React, { useState, useEffect } from "react";
import { Terminal, ChevronRight, Cpu, ShieldCheck } from "lucide-react";

export const DeveloperLogin = () => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(new Date().toUTCString());
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-950 p-[5%] font-mono text-green-500 relative overflow-hidden">
      {/* Ambient CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50"></div>

      {/* Main Terminal Window */}
      <div className="w-full max-w-[95%] md:max-w-[60%] lg:max-w-[40%] border border-green-500/30 rounded-sm bg-black shadow-[0_0_40px_rgba(0,255,0,0.05)] p-[6%] relative flex flex-col gap-[8%]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-green-500/20 pb-[4%] opacity-60">
          <div className="flex gap-[0.5rem]">
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-red-900/40 border border-red-500/20"></div>
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-yellow-900/40 border border-yellow-500/20"></div>
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-green-900/40 border border-green-500/20"></div>
          </div>
          <div className="text-[0.7rem] tracking-widest flex items-center gap-[0.5rem]">
            <Cpu className="w-[0.8rem] h-[0.8rem]" />
            SESSION: 0x7FF8
          </div>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-[6%]">
          <div className="space-y-[1%]">
            <p className="text-[0.75rem] opacity-50 uppercase tracking-tighter">
              Last connection: {timestamp}
            </p>
            <h2 className="text-[1.5rem] font-bold tracking-[0.2rem] text-white flex items-center gap-[1rem]">
              <ShieldCheck className="w-[1.5rem] h-[1.5rem] text-green-500" />
              ROOT_ACCESS
            </h2>
          </div>

          {/* Form Logic */}
          <div className="flex flex-col gap-[10%] pt-[4%]">
            <div className="group border-l-2 border-green-900/50 pl-[4%] focus-within:border-green-400 transition-colors">
              <label className="block text-[0.65rem] uppercase tracking-[0.3rem] opacity-40 mb-[2%]">
                Identity
              </label>
              <div className="flex items-center py-[2%]">
                <span className="mr-[3%] text-green-600 font-bold">#</span>
                <input
                  type="email"
                  placeholder="ssh_user@host"
                  className="bg-transparent border-none w-full text-green-400 placeholder-green-900/50 focus:outline-none text-[1rem]"
                />
              </div>
            </div>

            <div className="group border-l-2 border-green-900/50 pl-[4%] focus-within:border-green-400 transition-colors">
              <label className="block text-[0.65rem] uppercase tracking-[0.3rem] opacity-40 mb-[2%]">
                Passkey
              </label>
              <div className="flex items-center py-[2%]">
                <span className="mr-[3%] text-green-600 font-bold">#</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent border-none w-full text-green-400 placeholder-green-900/50 focus:outline-none text-[1rem]"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-[5%] bg-green-500/5 border border-green-500/40 text-green-500 hover:bg-green-500 hover:text-black transition-all py-[4%] px-[5%] font-bold flex items-center justify-between group overflow-hidden relative">
            <div className="flex items-center gap-[0.8rem]">
              <Terminal className="w-[1rem] h-[1rem]" />
              <span className="tracking-[0.2rem] text-[0.9rem]">
                EXECUTE LOGIN
              </span>
            </div>
            <ChevronRight className="w-[1.2rem] h-[1.2rem] group-hover:translate-x-[20%] transition-transform" />

            {/* Subtle background slide effect */}
            <div className="absolute inset-0 bg-green-500 -translate-x-full group-hover:translate-x-0 transition-transform -z-10"></div>
          </button>

          {/* Status Footer */}
          <div className="text-[0.65rem] opacity-30 pt-[4%] flex justify-between items-center border-t border-green-500/10">
            <div className="flex items-center gap-[0.5rem]">
              <span className="animate-pulse">●</span>
              ENC_MODE: AES-256
            </div>
            <div>
              SEC_LEVEL: ALPHA{" "}
              <span
                className={`${cursorVisible ? "opacity-100" : "opacity-0"}`}
              >
                █
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
