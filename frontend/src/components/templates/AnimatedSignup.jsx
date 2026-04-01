import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Asterisk,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useTranslation } from "react-i18next";

export const AnimatedSignup = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // { name: true, email: true, password: true }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.includes("@")) newErrors.email = true;
    if (formData.password.length < 6) newErrors.password = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Success logic here
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Left Side: Dynamic Visual Zone (40% width on Desktop) */}
      <div
        className="h-[30%] lg:h-full lg:w-[40%] bg-black relative flex items-center justify-center p-[5%] overflow-hidden"
        aria-hidden="true"
      >
        {/* Abstract Shape: A simple rotating percentage-based element */}
        <div className="absolute w-[60%] h-[60%] border border-white/20 rounded-full animate-spin [animation-duration:20s]"></div>
        <div className="absolute w-[40%] h-[40%] border-[1px] border-white/40 rounded-full animate-spin [animation-duration:10s] direction-reverse"></div>

        <div className="relative z-10 text-center lg:text-left">
          <Asterisk className="text-yellow-400 w-[3rem] h-[3rem] mb-[5%] animate-pulse mx-auto lg:mx-0" />
          <h1 className="text-white text-[2.5rem] lg:text-[4rem] font-light leading-tight tracking-tighter">
            {t("animated.start", "START")} <br />
            <span className="font-serif italic text-yellow-400">
              {t("animated.something", "Something")}
            </span>{" "}
            <br />
            {t("animated.new", "NEW.")}
          </h1>
        </div>

        {/* Bottom percentage-based label */}
        <div className="absolute bottom-[5%] left-[5%] text-white/30 text-[0.7rem] uppercase tracking-[0.5rem] hidden lg:block">
          {t("animated.edition", "© Edition 2026")}
        </div>
      </div>

      {/* Right Side: The Form (60% width on Desktop) */}
      <div className="h-[70%] lg:h-full lg:w-[60%] flex items-center justify-center p-[8%] bg-gray-50">
        <div className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[60%] space-y-[8%]">
          <div className="space-y-[2%]">
            <h2 className="text-[1.5rem] font-bold text-black uppercase tracking-widest">
              {t("animated.create_account", "Create Account")}
            </h2>
            <div className="h-[2px] w-[10%] bg-black" aria-hidden="true"></div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-[6%]"
            aria-label={t("animated.form_label", "Account Registration Form")}
          >
            {/* Fluid Input Groups */}
            {[
              {
                id: "name",
                label: t("animated.label_identity", "Identity"),
                icon: User,
                placeholder: t("animated.placeholder_name", "Your Name"),
                type: "text",
                errorMsg: t("animated.error_name", "Required field"),
              },
              {
                id: "email",
                label: t("animated.label_contact", "Contact"),
                icon: Mail,
                placeholder: t("animated.placeholder_email", "Email Address"),
                type: "email",
                errorMsg: t("animated.error_email", "Invalid email"),
              },
              {
                id: "password",
                label: t("animated.label_security", "Security"),
                icon: Lock,
                placeholder: t("animated.placeholder_password", "Password"),
                type: "password",
                errorMsg: t("animated.error_password", "Min 6 characters"),
              },
            ].map((field) => (
              <motion.div
                key={field.id}
                animate={errors[field.id] ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`group relative border-b-[1px] transition-colors pb-[2%] ${
                  errors[field.id]
                    ? "border-red-500"
                    : "border-black/10 focus-within:border-black"
                }`}
              >
                <label
                  htmlFor={field.id}
                  className={`block text-[0.6rem] uppercase tracking-widest mb-[1%] transition-colors ${
                    errors[field.id]
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-black"
                  }`}
                >
                  {field.label}
                </label>
                <div className="flex items-center">
                  <input
                    id={field.id}
                    type={field.type}
                    required
                    aria-required="true"
                    aria-invalid={errors[field.id] ? "true" : "false"}
                    aria-describedby={
                      errors[field.id] ? `${field.id}-error` : undefined
                    }
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-none outline-none text-[1.1rem] py-[1%] placeholder:text-gray-300 text-black"
                    value={formData[field.id]}
                    onChange={(e) => {
                      setFormData({ ...formData, [field.id]: e.target.value });
                      if (errors[field.id])
                        setErrors({ ...errors, [field.id]: false });
                    }}
                  />
                  {errors[field.id] ? (
                    <AlertCircle
                      className="w-[1.2rem] h-[1.2rem] text-red-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <field.icon
                      className="w-[1.2rem] h-[1.2rem] text-gray-300 group-focus-within:text-black transition-colors"
                      aria-hidden="true"
                    />
                  )}
                </div>
                {errors[field.id] && (
                  <p
                    id={`${field.id}-error`}
                    className="absolute -bottom-5 left-0 text-[0.6rem] text-red-500 uppercase tracking-widest font-bold"
                    role="alert"
                  >
                    {field.errorMsg}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Simple Action Area */}
            <div className="flex flex-col sm:flex-row items-center gap-[5%] pt-[4%]">
              <button
                type="submit"
                disabled={loading}
                aria-live="polite"
                className="w-full sm:w-[60%] bg-black text-white py-[4%] lg:py-[3%] group flex items-center justify-center gap-[5%] hover:bg-yellow-400 hover:text-black disabled:opacity-75 disabled:hover:bg-black disabled:hover:text-white transition-all duration-500"
              >
                <span className="uppercase font-bold tracking-widest text-[0.9rem]">
                  {loading
                    ? t("animated.processing", "Processing...")
                    : t("animated.join_now", "Join Now")}
                </span>
                {loading ? (
                  <Loader2
                    className="w-[1rem] h-[1rem] animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    className="w-[1rem] h-[1rem] group-hover:translate-x-[50%] transition-transform"
                    aria-hidden="true"
                  />
                )}
              </button>

              <a
                href="#"
                className="text-[0.7rem] uppercase tracking-widest text-gray-400 hover:text-black transition-colors mt-[4%] sm:mt-0"
              >
                {t("animated.have_account", "I have an account")}
              </a>
            </div>
          </form>

          {/* Minimal Footer */}
          <p className="text-[0.65rem] text-gray-400 leading-relaxed max-w-[80%]">
            {t(
              "animated.terms",
              "By joining, you agree to our minimal terms. We promise not to clutter your inbox or your headspace.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
