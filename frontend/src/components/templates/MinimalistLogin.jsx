import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

export const MinimalistLogin = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = true;
    if (formData.password.length < 6) newErrors.password = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0b0f19] p-4 font-sans relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" aria-hidden="true"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full" aria-hidden="true"></div>

      <div className="max-w-[90%] w-full h-full max-h-[90%] flex rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden" aria-hidden="true">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90"></div>

          {/* Noise / glass feel */}
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <div className="w-6 h-6 bg-indigo-600 rounded-md rotate-45"></div>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight">
              {t("minimalist.hero_title", "Build something")} <br />
              <span className="text-indigo-200">{t("minimalist.hero_accent", "extraordinary.")}</span>
            </h1>
          </div>

          <p className="relative z-10 text-indigo-100 text-sm opacity-80 max-w-xs">
            {t("minimalist.hero_desc", "A modern authentication experience crafted for creators who care about design & performance.")}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0d1117]/90 backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {t("minimalist.welcome", "Welcome Back")}
            </h2>
            <p className="text-slate-400 text-sm">
              {t("minimalist.subtitle", "Enter your credentials to continue")}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} aria-label={t("minimalist.form_label", "Login Form")}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs text-slate-400 uppercase tracking-wider">
                {t("minimalist.email_label", "Email")}
              </label>

              <motion.div
                animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative group"
              >
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder={t("minimalist.email_placeholder", "name@company.com")}
                  className={`w-full bg-white/5 border text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all backdrop-blur-md ${errors.email ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/40' : 'border-white/10 focus:ring-2 focus:ring-indigo-500/40'}`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: false});
                  }}
                />
                {errors.email && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" aria-hidden="true" />}
              </motion.div>
              {errors.email && <p id="email-error" className="text-xs text-red-400" role="alert">{t("minimalist.error_email", "Invalid email address")}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs text-slate-400 uppercase tracking-wider">
                {t("minimalist.password_label", "Password")}
              </label>

              <motion.div
                animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative group"
              >
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} aria-hidden="true" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border text-white rounded-xl py-3 pl-11 pr-12 outline-none transition-all backdrop-blur-md ${errors.password ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/40' : 'border-white/10 focus:ring-2 focus:ring-indigo-500/40'}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: false});
                  }}
                />

                <button
                  type="button"
                  aria-label={showPassword ? t("minimalist.hide_password", "Hide password") : t("minimalist.show_password", "Show password")}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </motion.div>
              {errors.password && <p id="password-error" className="text-xs text-red-400" role="alert">{t("minimalist.error_password", "Minimum 6 characters")}</p>}
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-indigo-500 bg-white/5 border-white/10" aria-label={t("minimalist.remember_me", "Remember me")} />
                <span>{t("minimalist.remember_me", "Remember me")}</span>
              </label>

              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                {t("minimalist.forgot", "Forgot?")}
              </a>
            </div>

            {/* BUTTON */}
            <button 
              disabled={loading}
              aria-live="polite"
              className="w-full relative overflow-hidden group bg-indigo-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-75"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-all" aria-hidden="true"></div>
              
              <span className="relative z-10">
                {loading ? t("minimalist.signing_in", "Signing In...") : t("minimalist.sign_in", "Sign In")}
              </span>
              
              {loading ? (
                <Loader2 className="w-5 h-5 relative z-10 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-5 h-5 relative z-10" aria-hidden="true" />
              )}
            </button>
          </form>

          {/* SOCIAL */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/10 w-full" aria-hidden="true"></div>
              <span className="bg-[#0d1117] px-3 text-xs text-slate-500 absolute">
                {t("minimalist.or", "OR")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition" aria-label={t("minimalist.social_google", "Sign in with Google")}>
                <Chrome size={18} aria-hidden="true" />
                {t("minimalist.google", "Google")}
              </button>

              <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition" aria-label={t("minimalist.social_github", "Sign in with GitHub")}>
                <Github size={18} aria-hidden="true" />
                {t("minimalist.github", "GitHub")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
