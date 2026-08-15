import React, { useState } from "react";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

export const GlassmorphismCard = () => {
  const { t } = useTranslation();
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
    <div className="h-full w-full flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans py-2.5">
      {/* Dynamic Background Image */}
      <div className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop"
          alt="Gradient"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Fluid Decorative Blobs - No external CSS needed */}
      <div
        className="absolute top-[15%] left-[10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse [animation-delay:4s]"
        aria-hidden="true"
      />

      {/* The Glass Card: Fully Fluid Structure */}
      <div className="relative w-full max-w-[92%] md:max-w-[55%] lg:max-w-[32%] p-[10%] md:p-[6%] lg:p-[4%] rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10 transition-all duration-500 hover:bg-white/15">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-[12%]">
          <div className="w-[4.5rem] h-[4.5rem] rounded-[1.25rem] bg-gradient-to-tr from-white/30 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center mb-[6%] shadow-inner">
            <Lock
              className="w-[1.8rem] h-[1.8rem] text-white"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-[1.75rem] font-bold text-white tracking-tight text-center">
            {t("glass.title", "Security Portal")}
          </h2>
          <p className="text-white/60 mt-[2%] text-[0.85rem] text-center max-w-[85%] uppercase tracking-widest">
            {t("glass.subtitle", "Authorized Access Only")}
          </p>
        </div>

        {/* Fluid Form */}
        <form
          className="flex flex-col gap-[1.25rem]"
          onSubmit={handleSubmit}
          aria-label={t("glass.form_aria", "Security Access Component")}
        >
          {/* Email Field */}
          <div className="flex flex-col gap-[0.4rem]">
            <label
              htmlFor="identity"
              className="text-[0.65rem] font-bold text-white/50 uppercase tracking-[0.2em] ml-[2%]"
            >
              {t("glass.email_label", "Identity")}
            </label>
            <motion.div
              animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <Mail
                className="absolute left-[5%] top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-white/40 group-focus-within:text-white transition-colors"
                aria-hidden="true"
              />
              <input
                id="identity"
                type="email"
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder={t("glass.email_placeholder", "user@network.com")}
                className={`w-full bg-black/30 text-white placeholder-white/20 border rounded-2xl py-[4.5%] pl-[16%] pr-[5%] focus:outline-none focus:bg-black/40 transition-all backdrop-blur-md text-[0.95rem] ${
                  errors.email
                    ? "border-red-500"
                    : "border-white/10 focus:border-white/40"
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
              />
              {errors.email && (
                <AlertCircle
                  className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[1.1rem] h-[1.1rem] text-red-500"
                  aria-hidden="true"
                />
              )}
            </motion.div>
            {errors.email && (
              <p
                id="email-error"
                className="text-xs text-red-500 ml-[2%]"
                role="alert"
              >
                {t("glass.email_invalid", "Invalid access identity")}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[0.4rem]">
            <label
              htmlFor="passkey"
              className="text-[0.65rem] font-bold text-white/50 uppercase tracking-[0.2em] ml-[2%]"
            >
              {t("glass.password_label", "Passkey")}
            </label>
            <motion.div
              animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <Lock
                className="absolute left-[5%] top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-white/40 group-focus-within:text-white transition-colors"
                aria-hidden="true"
              />
              <input
                id="passkey"
                type="password"
                required
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "pw-error" : undefined}
                placeholder="••••••••"
                className={`w-full bg-black/30 text-white placeholder-white/20 border rounded-2xl py-[4.5%] pl-[16%] pr-[5%] focus:outline-none focus:bg-black/40 transition-all backdrop-blur-md text-[0.95rem] ${
                  errors.password
                    ? "border-red-500"
                    : "border-white/10 focus:border-white/40"
                }`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password)
                    setErrors({ ...errors, password: false });
                }}
              />
              {errors.password && (
                <AlertCircle
                  className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[1.1rem] h-[1.1rem] text-red-500"
                  aria-hidden="true"
                />
              )}
            </motion.div>
            {errors.password && (
              <p
                id="pw-error"
                className="text-xs text-red-500 ml-[2%]"
                role="alert"
              >
                {t("glass.password_invalid", "Passkey rejected")}
              </p>
            )}
          </div>

          {/* Links Area */}
          <div className="flex items-center justify-between text-[0.75rem] text-white/50 py-[1%] px-[1%]">
            <label className="flex items-center gap-[0.5rem] cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                aria-label={t("glass.remember", "Maintain Session")}
                className="w-[0.9rem] h-[0.9rem] rounded border-white/20 bg-white/5 text-white focus:ring-0 focus:ring-offset-0"
              />
              {t("glass.remember", "Maintain Session")}
            </label>
            <a href="#" className="hover:text-white transition-colors">
              {t("glass.recovery", "Recovery")}
            </a>
          </div>

          {/* Action Button */}
          <button
            disabled={loading}
            aria-live="polite"
            className="w-full bg-white text-black font-bold py-[4.5%] rounded-2xl transition-all hover:bg-opacity-90 active:scale-[0.98] flex items-center justify-center gap-[0.5rem] group text-[0.9rem] uppercase tracking-widest mt-[4%] disabled:opacity-70"
          >
            {loading ? (
              <Loader2
                className="w-[1.2rem] h-[1.2rem] animate-spin"
                aria-hidden="true"
              />
            ) : null}
            {loading
              ? t("glass.authenticating", "Authenticating...")
              : t("glass.authenticate", "Authenticate")}

            {!loading && (
              <ArrowRight
                className="w-[1rem] h-[1rem] group-hover:translate-x-[20%] transition-transform"
                aria-hidden="true"
              />
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-[12%] text-center border-t border-white/10 pt-[8%]">
          <p className="text-white/40 text-[0.75rem] tracking-wide">
            {t("glass.new_operative", "New Operative?")}{" "}
            <a
              href="#"
              className="text-white font-bold hover:text-blue-300 transition-colors uppercase ml-[1%]"
            >
              {t("glass.enroll", "Enroll")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
