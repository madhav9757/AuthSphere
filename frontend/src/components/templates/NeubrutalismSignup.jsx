import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Github,
  Twitter,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

export const NeubrutalismSignup = () => {
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
    if (formData.password.length < 6) newErrors.password = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-yellow-300 p-[5%] font-sans">
      <div className="w-full max-w-[95%] md:max-w-[50%] lg:max-w-[35%] flex flex-col">
        {/* Header Section */}
        <div className="mb-[8%]">
          <div className="inline-block bg-black text-yellow-300 px-[6%] py-[3%] font-black text-[1.5rem] border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-[4%]">
            {t("neubrutalism.badge", "SIGN UP")}
          </div>
          <p className="text-black font-bold text-[1.1rem]">
            {t("neubrutalism.hero1", "Join the revolution.")} <br />
            {t("neubrutalism.hero2", "No BS, just pure functionality.")}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-[10%] flex flex-col gap-[5%]">
          {/* Social Buttons Grid */}
          <div className="grid grid-cols-2 gap-[5%]">
            <button
              className="bg-black text-white border-[3px] border-black py-[12%] font-bold hover:bg-white hover:text-black transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[8%] text-[0.8rem]"
              aria-label={t("neubrutalism.github_aria", "Sign in with GitHub")}
            >
              <Github className="w-[1.2rem] h-[1.2rem]" aria-hidden="true" />
              {t("neubrutalism.github", "GITHUB")}
            </button>
            <button
              className="bg-cyan-400 text-black border-[3px] border-black py-[12%] font-bold hover:bg-white transition-all active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[8%] text-[0.8rem]"
              aria-label={t(
                "neubrutalism.twitter_aria",
                "Sign in with Twitter",
              )}
            >
              <Twitter className="w-[1.2rem] h-[1.2rem]" aria-hidden="true" />
              {t("neubrutalism.twitter", "TWITTER")}
            </button>
          </div>

          {/* Fluid Divider */}
          <div className="relative py-[4%]">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t-[3px] border-black border-dashed"></div>
            </div>
            <div className="relative flex justify-center" aria-hidden="true">
              <span className="bg-white px-[5%] text-black font-bold text-[0.75rem]">
                {t("neubrutalism.or", "OR")}
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-[4%]"
            onSubmit={handleSubmit}
            aria-label={t("neubrutalism.form_aria", "Sign up form")}
          >
            {["name", "email", "password"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  htmlFor={field}
                  className="block text-[0.75rem] font-black text-black mb-[2%] uppercase"
                >
                  {field === "name"
                    ? t("neubrutalism.label_name", "Your Name")
                    : field === "email"
                      ? t("neubrutalism.label_email", "Email")
                      : t("neubrutalism.label_password", "Password")}
                </label>

                <motion.div
                  animate={errors[field] ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {field === "name" && (
                    <User
                      className={`absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem] ${errors[field] ? "text-red-500" : "text-black"}`}
                      aria-hidden="true"
                    />
                  )}
                  {field === "email" && (
                    <Mail
                      className={`absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem] ${errors[field] ? "text-red-500" : "text-black"}`}
                      aria-hidden="true"
                    />
                  )}
                  {field === "password" && (
                    <Lock
                      className={`absolute left-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem] ${errors[field] ? "text-red-500" : "text-black"}`}
                      aria-hidden="true"
                    />
                  )}

                  <input
                    id={field}
                    type={
                      field === "password"
                        ? "password"
                        : field === "email"
                          ? "email"
                          : "text"
                    }
                    required
                    aria-required="true"
                    aria-invalid={errors[field] ? "true" : "false"}
                    aria-describedby={
                      errors[field] ? `${field}-error` : undefined
                    }
                    value={formData[field]}
                    onChange={(e) => {
                      setFormData({ ...formData, [field]: e.target.value });
                      if (errors[field])
                        setErrors({ ...errors, [field]: false });
                    }}
                    placeholder={
                      field === "password"
                        ? "••••••••"
                        : field === "name"
                          ? t("neubrutalism.placeholder_name", "Enter Name")
                          : t("neubrutalism.placeholder_email", "Enter Email")
                    }
                    className={`w-full pl-[15%] pr-[5%] py-[5%] border-[3px] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold ${
                      errors[field]
                        ? "border-red-500 bg-red-50 placeholder-red-300"
                        : "border-black bg-white placeholder-gray-400"
                    }`}
                  />
                  {errors[field] && (
                    <AlertCircle
                      className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[1.2rem] h-[1.2rem] text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
                {errors[field] && (
                  <p
                    id={`${field}-error`}
                    className="text-xs font-bold text-red-500 mt-2"
                    role="alert"
                  >
                    {field === "password"
                      ? t("neubrutalism.error_pw", "Min 6 chars")
                      : t("neubrutalism.error_req", "Required")}
                  </p>
                )}
              </div>
            ))}

            {/* Checkbox Section */}
            <div className="flex items-start gap-[5%] mt-[2%] mb-4">
              <input
                type="checkbox"
                id="terms"
                required
                aria-required="true"
                className="mt-[1%] h-[1.2rem] w-[1.2rem] border-[3px] border-black focus:ring-0 text-black cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[0.8rem] font-bold text-black leading-tight"
              >
                {t("neubrutalism.agree", "I agree to the")}{" "}
                <a
                  href="#"
                  className="underline decoration-[2px] decoration-pink-400 hover:text-pink-600 transition-colors"
                >
                  {t("neubrutalism.terms", "Terms")}
                </a>{" "}
                {t("neubrutalism.and", "and")}{" "}
                <a
                  href="#"
                  className="underline decoration-[2px] decoration-cyan-400 hover:text-cyan-600 transition-colors"
                >
                  {t("neubrutalism.privacy", "Privacy")}
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              aria-live="polite"
              className="w-full bg-pink-400 text-black border-[4px] border-black py-[6%] font-black text-[1.1rem] hover:bg-yellow-300 transition-all active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-[4%] group uppercase mt-[4%] disabled:opacity-80 disabled:hover:bg-pink-400"
            >
              {loading ? (
                <Loader2
                  className="w-[1.4rem] h-[1.4rem] animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              {loading
                ? t("neubrutalism.creating", "CREATING...")
                : t("neubrutalism.create_account", "Create Account")}
              {!loading && (
                <ArrowRight
                  className="w-[1.4rem] h-[1.4rem] group-hover:translate-x-[20%] transition-transform"
                  aria-hidden="true"
                />
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-[0.8rem] font-bold text-black pt-[2%]">
            {t("neubrutalism.already_member", "Already a member?")}{" "}
            <a
              href="#"
              className="underline decoration-[3px] decoration-cyan-400 hover:decoration-pink-400 transition-colors"
            >
              {t("neubrutalism.sign_in", "SIGN IN")}
            </a>
          </p>
        </div>

        {/* Bottom Notification */}
        <div
          className="mt-[8%] bg-black text-yellow-300 border-[4px] border-black p-[5%] font-bold text-[0.8rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
          aria-live="polite"
        >
          {t(
            "neubrutalism.banner",
            "⚡ Join 10,000+ developers building the future",
          )}
        </div>
      </div>
    </div>
  );
};
