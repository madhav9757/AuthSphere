import React, { useState } from "react";
import {
  Command,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

export const SplitScreenLogin = () => {
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
    <div className="w-full h-full lg:grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.7)] bg-white text-slate-900 font-sans">
      {/* Left: Branding & Editorial Image */}
      <div
        className="hidden lg:flex flex-col justify-between bg-black relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop"
            alt="Abstract Art"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 pr-44 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 text-white font-medium tracking-wide/10 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Command className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">
              {t("split.badge", "AuthSphere Enterprise")}
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl text-white font-serif leading-tight">
              {t("split.quote", '"Secure access for the modern web."')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/80">
                <CheckCircle2
                  className="h-5 w-5 text-emerald-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-light">
                  {t("split.feature1", "End-to-end encrypted sessions")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <CheckCircle2
                  className="h-5 w-5 text-emerald-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-light">
                  {t("split.feature2", "99.99% Uptime SLA guaranteed")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <CheckCircle2
                  className="h-5 w-5 text-emerald-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-light">
                  {t("split.feature3", "GDPR & SOC2 Compliant")}
                </span>
              </div>
            </div>
          </div>

          <div className="text-white/40 text-xs tracking-widest uppercase">
            {t("split.copyright", "© 2026 AuthSphere Inc.")}
          </div>
        </div>
      </div>

      {/* Right: Modern Form */}
      <div className="flex flex-col items-center justify-center py-12 px-8 sm:px-16 lg:px-24 bg-white relative">
        <div className="absolute top-0 right-0 p-8">
          <a
            href="#"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            aria-label={t("split.help_aria", "Need help logging in?")}
          >
            {t("split.help", "Need help?")}
          </a>
        </div>

        <div className="w-full max-w-[80%] space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {t("split.welcome", "Welcome back")}
            </h1>
            <p className="text-slate-500">
              {t(
                "split.instruction",
                "Please enter your details to access your dashboard.",
              )}
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            aria-label={t("split.form_aria", "Sign in form")}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="email"
              >
                {t("split.email_label", "Email address")}
              </label>

              <motion.div
                animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <input
                  className={`flex h-11 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                    errors.email
                      ? "border-red-400 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:ring-blue-600"
                  }`}
                  id="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder={t("split.email_placeholder", "name@company.com")}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: false });
                  }}
                />
                {errors.email && (
                  <AlertCircle
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-red-500 mt-1"
                  role="alert"
                >
                  {t("split.email_invalid", "Valid email required")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="password"
                >
                  {t("split.password_label", "Password")}
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {t("split.forgot_password", "Forgot password?")}
                </a>
              </div>

              <motion.div
                animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <input
                  className={`flex h-11 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                    errors.password
                      ? "border-red-400 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:ring-blue-600"
                  }`}
                  id="password"
                  type="password"
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "pw-error" : undefined}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password)
                      setErrors({ ...errors, password: false });
                  }}
                />
                {errors.password && (
                  <AlertCircle
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
              {errors.password && (
                <p
                  id="pw-error"
                  className="text-xs text-red-500 mt-1"
                  role="alert"
                >
                  {t("split.password_invalid", "Min 6 characters required")}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              aria-live="polite"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-75 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 w-full shadow-lg shadow-blue-600/20 group"
            >
              {loading ? (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              {loading
                ? t("split.signing_in", "Signing In...")
                : t("split.sign_in", "Sign In")}

              {!loading && (
                <ArrowRight
                  className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              )}
            </button>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <span className="w-full border-t border-slate-200" />
              </div>
              <div
                className="relative flex justify-center text-xs uppercase"
                aria-hidden="true"
              >
                <span className="bg-white px-2 text-slate-500">
                  {t("split.or_continue", "Or continue with")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                aria-label={t("split.google_signin", "Sign in with Google")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t("split.google", "Google")}
              </button>
              <button
                type="button"
                aria-label={t("split.github_signin", "Sign in with GitHub")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("split.github", "GitHub")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
