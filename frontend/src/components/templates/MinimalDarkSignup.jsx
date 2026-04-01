import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github, Code2, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const MinimalDarkSignup = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.email.includes("@")) newErrors.email = true;
        if (formData.password.length < 8) newErrors.password = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-[#09090b] p-4 font-sans relative overflow-hidden">
            {/* Starfield Background Effect */}
             <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute h-px w-px bg-white top-10 left-10 box-content shadow-[0_0_2px_#fff]"></div>
                <div className="absolute h-[2px] w-[2px] bg-white top-32 left-1/4 box-content shadow-[0_0_2px_#fff] opacity-50"></div>
                <div className="absolute h-px w-px bg-white bottom-20 right-20 box-content shadow-[0_0_2px_#fff]"></div>
                {/* Radial Gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]"></div>
             </div>

            <div className="w-full max-w-[90%] md:max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 rounded-2xl mb-6 ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                        <Code2 className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 mb-3 tracking-tight">
                        {t("minimaldark.title", "Create Account")}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        {t("minimaldark.subtitle", "Join the developer community today.")}
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit} aria-label={t("minimaldark.form_aria", "Sign up form")}>
                    
                    {/* Name Field */}
                    <div className="group space-y-2">
                        <label htmlFor="name" className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors ${errors.name ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`}>
                            {t("minimaldark.name_label", "Full Name")}
                        </label>
                        <motion.div animate={errors.name ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="relative">
                             <User className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${errors.name ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`} aria-hidden="true" />
                             <input
                                id="name"
                                type="text"
                                required
                                aria-required="true"
                                aria-invalid={errors.name ? "true" : "false"}
                                aria-describedby={errors.name ? "name-error" : undefined}
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({...errors, name: false});
                                }}
                                placeholder={t("minimaldark.name_placeholder", "John Doe")}
                                className={`w-full px-4 py-3 pl-10 bg-zinc-900/50 rounded-xl text-white placeholder-zinc-700 outline-none transition-all ${
                                    errors.name ? 'border border-red-500/50 focus:ring-1 focus:ring-red-500/50 text-red-100' : 'border border-zinc-800 focus:border-white/20 focus:ring-1 focus:ring-white/20 hover:border-zinc-700'
                                }`}
                            />
                            {errors.name && <AlertCircle className="absolute right-4 top-3.5 h-4 w-4 text-red-500" aria-hidden="true" />}
                        </motion.div>
                        {errors.name && <p id="name-error" className="text-[10px] text-red-500 ml-1" role="alert">{t("minimaldark.name_req", "Required field")}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="group space-y-2">
                        <label htmlFor="email" className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`}>
                            {t("minimaldark.email_label", "Email Address")}
                        </label>
                         <motion.div animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="relative">
                            <Mail className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`} aria-hidden="true" />
                            <input
                                id="email"
                                type="email"
                                required
                                aria-required="true"
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (errors.email) setErrors({...errors, email: false});
                                }}
                                placeholder={t("minimaldark.email_placeholder", "you@example.com")}
                                className={`w-full px-4 py-3 pl-10 bg-zinc-900/50 rounded-xl text-white placeholder-zinc-700 outline-none transition-all ${
                                    errors.email ? 'border border-red-500/50 focus:ring-1 focus:ring-red-500/50 text-red-100' : 'border border-zinc-800 focus:border-white/20 focus:ring-1 focus:ring-white/20 hover:border-zinc-700'
                                }`}
                            />
                            {errors.email && <AlertCircle className="absolute right-4 top-3.5 h-4 w-4 text-red-500" aria-hidden="true" />}
                        </motion.div>
                        {errors.email && <p id="email-error" className="text-[10px] text-red-500 ml-1" role="alert">{t("minimaldark.email_req", "Invalid email")}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="group space-y-2">
                        <label htmlFor="password" className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors ${errors.password ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`}>
                            {t("minimaldark.password_label", "Password")}
                        </label>
                         <motion.div animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="relative">
                            <Lock className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${errors.password ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-white'}`} aria-hidden="true" />
                            <input
                                id="password"
                                type="password"
                                required
                                aria-required="true"
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby="pw-hint"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({...errors, password: false});
                                }}
                                placeholder="••••••••••"
                                className={`w-full px-4 py-3 pl-10 bg-zinc-900/50 rounded-xl text-white placeholder-zinc-700 outline-none transition-all ${
                                    errors.password ? 'border border-red-500/50 focus:ring-1 focus:ring-red-500/50 text-red-100' : 'border border-zinc-800 focus:border-white/20 focus:ring-1 focus:ring-white/20 hover:border-zinc-700'
                                }`}
                            />
                            {errors.password && <AlertCircle className="absolute right-4 top-3.5 h-4 w-4 text-red-500" aria-hidden="true" />}
                        </motion.div>
                        <p id="pw-hint" className={`text-[10px] text-right ${errors.password ? 'text-red-500' : 'text-zinc-600'}`} role={errors.password ? "alert" : "status"}>
                            {t("minimaldark.password_hint", "Must be at least 8 characters")}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        aria-live="polite"
                        className="w-full mt-4 bg-white text-black font-semibold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5 disabled:opacity-80 disabled:hover:translate-y-0"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                        {loading ? t("minimaldark.creating", "Creating Account...") : t("minimaldark.create", "Create Account")}
                        {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
                    </button>

                    <div className="relative py-4" aria-hidden="true">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[#09090b] text-zinc-500 uppercase tracking-wider">{t("minimaldark.or", "Or continue with")}</span>
                        </div>
                    </div>

                     {/* GitHub Button */}
                    <button type="button" aria-label={t("minimaldark.github_aria", "Sign in with GitHub")} className="w-full bg-zinc-900 border border-zinc-800 text-white py-3.5 rounded-xl font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group focus:ring-2 focus:ring-zinc-600 outline-none">
                        <Github className="h-5 w-5 fill-white" aria-hidden="true" />
                        {t("minimaldark.github", "GitHub")}
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-zinc-600 text-center leading-relaxed mt-4">
                        {t("minimaldark.agree_p1", "By creating an account, you agree to our")}{" "}
                        <a href="#" className="text-zinc-500 hover:text-white underline transition-colors focus:text-white outline-none">
                            {t("minimaldark.terms", "Terms")}
                        </a>{" "}
                        {t("minimaldark.agree_p2", "and")}{" "}
                        <a href="#" className="text-zinc-500 hover:text-white underline transition-colors focus:text-white outline-none">
                            {t("minimaldark.privacy", "Privacy Policy")}
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};
