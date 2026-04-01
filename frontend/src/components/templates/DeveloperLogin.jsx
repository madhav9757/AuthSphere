import React, { useState, useEffect } from "react";
import { Terminal, ChevronRight, Cpu, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const DeveloperLogin = () => {
  const { t } = useTranslation();
  const [cursorVisible, setCursorVisible] = useState(true);
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identity: "", passkey: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTimestamp(new Date().toUTCString());
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.identity.includes("@")) newErrors.identity = true;
    if (formData.passkey.length < 6) newErrors.passkey = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-950 p-[5%] font-mono text-green-500 relative overflow-hidden">
      {/* Ambient CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50" aria-hidden="true"></div>

      {/* Main Terminal Window */}
      <div className="w-full max-w-[95%] md:max-w-[60%] lg:max-w-[40%] border border-green-500/30 rounded-sm bg-black shadow-[0_0_40px_rgba(0,255,0,0.05)] p-[6%] relative flex flex-col gap-[8%]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-green-500/20 pb-[4%] opacity-60" aria-hidden="true">
          <div className="flex gap-[0.5rem]">
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-red-900/40 border border-red-500/20"></div>
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-yellow-900/40 border border-yellow-500/20"></div>
            <div className="w-[0.75rem] h-[0.75rem] rounded-full bg-green-900/40 border border-green-500/20"></div>
          </div>
          <div className="text-[0.7rem] tracking-widest flex items-center gap-[0.5rem]">
            <Cpu className="w-[0.8rem] h-[0.8rem]" />
            {t("developer.session", "SESSION: 0x7FF8")}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-[6%]">
          <div className="space-y-[1%]">
            <p className="text-[0.75rem] opacity-50 uppercase tracking-tighter" aria-live="polite">
              {t("developer.last_connection", "Last connection:")} {timestamp}
            </p>
            <h2 className="text-[1.5rem] font-bold tracking-[0.2rem] text-white flex items-center gap-[1rem]">
              <ShieldCheck className="w-[1.5rem] h-[1.5rem] text-green-500" aria-hidden="true" />
              {t("developer.root_access", "ROOT_ACCESS")}
            </h2>
          </div>

          {/* Form Logic */}
          <form className="flex flex-col gap-[10%] pt-[4%]" onSubmit={handleSubmit} aria-label={t("developer.form_aria", "Terminal Authentication Form")}>
            <div className={`group border-l-2 pl-[4%] transition-colors relative ${errors.identity ? 'border-red-500' : 'border-green-900/50 focus-within:border-green-400'}`}>
              <label htmlFor="identity" className={`block text-[0.65rem] uppercase tracking-[0.3rem] mb-[2%] ${errors.identity ? 'text-red-500 opacity-80' : 'opacity-40'}`}>
                {t("developer.identity", "Identity")}
              </label>
              <motion.div animate={errors.identity ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex items-center py-[2%]">
                <span className={`mr-[3%] font-bold ${errors.identity ? 'text-red-500' : 'text-green-600'}`} aria-hidden="true">#</span>
                <input
                  id="identity"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.identity ? "true" : "false"}
                  aria-describedby={errors.identity ? "identity-error" : undefined}
                  autoComplete="off"
                  placeholder="ssh_user@host"
                  className={`bg-transparent border-none w-full focus:outline-none text-[1rem] ${errors.identity ? 'text-red-400 placeholder-red-900/50' : 'text-green-400 placeholder-green-900/50'}`}
                  value={formData.identity}
                  onChange={(e) => {
                    setFormData({...formData, identity: e.target.value});
                    if (errors.identity) setErrors({...errors, identity: false});
                  }}
                />
                {errors.identity && <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />}
              </motion.div>
              {errors.identity && <p id="identity-error" className="absolute -bottom-4 left-[6%] text-[10px] text-red-500 uppercase tracking-widest" role="alert">{t("developer.identity_error", "INVALID_IDENTITY")}</p>}
            </div>

            <div className={`group border-l-2 pl-[4%] transition-colors relative ${errors.passkey ? 'border-red-500' : 'border-green-900/50 focus-within:border-green-400'}`}>
              <label htmlFor="passkey" className={`block text-[0.65rem] uppercase tracking-[0.3rem] mb-[2%] ${errors.passkey ? 'text-red-500 opacity-80' : 'opacity-40'}`}>
                {t("developer.passkey", "Passkey")}
              </label>
              <motion.div animate={errors.passkey ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex items-center py-[2%]">
                <span className={`mr-[3%] font-bold ${errors.passkey ? 'text-red-500' : 'text-green-600'}`} aria-hidden="true">#</span>
                <input
                  id="passkey"
                  type="password"
                  required
                  aria-required="true"
                  aria-invalid={errors.passkey ? "true" : "false"}
                  aria-describedby={errors.passkey ? "passkey-error" : undefined}
                  autoComplete="off"
                  placeholder="••••••••"
                  className={`bg-transparent border-none w-full focus:outline-none text-[1rem] ${errors.passkey ? 'text-red-400 placeholder-red-900/50' : 'text-green-400 placeholder-green-900/50'}`}
                  value={formData.passkey}
                  onChange={(e) => {
                    setFormData({...formData, passkey: e.target.value});
                    if (errors.passkey) setErrors({...errors, passkey: false});
                  }}
                />
                {errors.passkey && <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />}
              </motion.div>
              {errors.passkey && <p id="passkey-error" className="absolute -bottom-4 left-[6%] text-[10px] text-red-500 uppercase tracking-widest" role="alert">{t("developer.passkey_error", "ACCESS_DENIED")}</p>}
            </div>

            {/* Action Button */}
            <button 
              disabled={loading}
              aria-live="polite"
              className="w-full mt-[5%] bg-green-500/5 border border-green-500/40 text-green-500 hover:bg-green-500 hover:text-black transition-all py-[4%] px-[5%] font-bold flex items-center justify-between group overflow-hidden relative disabled:opacity-50"
            >
              <div className="flex items-center gap-[0.8rem]">
                {loading ? <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" aria-hidden="true" /> : <Terminal className="w-[1rem] h-[1rem]" aria-hidden="true" />}
                <span className="tracking-[0.2rem] text-[0.9rem]">
                  {loading ? t("developer.executing", "EXECUTING...") : t("developer.execute_login", "EXECUTE LOGIN")}
                </span>
              </div>
              {!loading && <ChevronRight className="w-[1.2rem] h-[1.2rem] group-hover:translate-x-[20%] transition-transform" aria-hidden="true" />}

              {/* Subtle background slide effect */}
              <div className="absolute inset-0 bg-green-500 -translate-x-full group-hover:translate-x-0 transition-transform -z-10" aria-hidden="true"></div>
            </button>
          </form>

          {/* Status Footer */}
          <div className="text-[0.65rem] opacity-30 pt-[4%] flex justify-between items-center border-t border-green-500/10" aria-hidden="true">
            <div className="flex items-center gap-[0.5rem]">
              <span className="animate-pulse">●</span>
              {t("developer.enc_mode", "ENC_MODE: AES-256")}
            </div>
            <div>
              {t("developer.sec_level", "SEC_LEVEL: ALPHA")}{" "}
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
