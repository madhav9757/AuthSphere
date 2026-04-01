import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export const StepperSignup = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("signup"); // signup | login
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  const totalSteps = mode === "signup" ? 3 : 2;

  const isEmailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(form.email),
    [form.email],
  );

  const isPasswordStrong = useMemo(
    () => form.password.length >= 10,
    [form.password],
  );

  const canContinue = () => {
    if (step === 1) return isEmailValid;
    if (step === 2 && mode === "signup") return form.name.length >= 2;
    if (step === totalSteps) return isPasswordStrong;
    return false;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!canContinue()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (step < totalSteps) setStep(step + 1);
      else setSuccess(true);
    }, 700);
  };

  const steps = {
    1: {
      title: t("stepper.email_title", "Your email address"),
      subtitle: t("stepper.email_subtitle", "We’ll use this to identify and protect your account."),
      field: "email",
      type: "email",
      placeholder: t("stepper.email_placeholder", "you@example.com"),
      icon: <Mail size={18} aria-hidden="true" />,
      hint: !form.email
        ? t("stepper.hint_email_req", "Enter a valid email address")
        : isEmailValid
          ? t("stepper.hint_email_ok", "Looks good")
          : t("stepper.hint_email_bad", "That email doesn’t look right"),
    },
    2: {
      title:
        mode === "signup" ? t("stepper.name_title", "Choose your display name") : t("stepper.login_pw_title", "Enter your password"),
      subtitle:
        mode === "signup"
          ? t("stepper.name_subtitle", "This will appear on your profile and workspace.")
          : t("stepper.login_pw_subtitle", "Make sure no one is watching 👀"),
      field: mode === "signup" ? "name" : "password",
      type: mode === "signup" ? "text" : "password",
      placeholder: mode === "signup" ? t("stepper.name_placeholder", "John Doe") : t("stepper.pw_placeholder", "Your secure password"),
      icon: mode === "signup" ? <User size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />,
      hint: mode === "signup" ? null : (form.password.length < 6 ? t("stepper.hint_pw_short", "Minimum 6 characters") : null)
    },
    3: {
      title: t("stepper.secure_title", "Secure your account"),
      subtitle: t("stepper.secure_subtitle", "Use at least 10 characters for strong protection."),
      field: "password",
      type: "password",
      placeholder: t("stepper.secure_placeholder", "Create a strong password"),
      icon: <Lock size={18} aria-hidden="true" />,
      hint: isPasswordStrong
        ? t("stepper.hint_pw_strong", "Strong password")
        : t("stepper.hint_pw_req", "At least 10 characters required"),
    },
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#f9fafb] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px]" />
      </div>

      <motion.div layout className="relative z-10 w-full max-w-[90%] md:max-w-md px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.2rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key={step + mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <header className="mb-10">
                  <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold" aria-live="polite">
                    {mode === "signup" ? t("stepper.create_acc_label", "Create account") : t("stepper.welcome_back_label", "Welcome back")}
                  </span>
                  <h1 className="text-2xl font-semibold text-slate-900 mt-2">
                    {steps[step].title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-2">
                    {steps[step].subtitle}
                  </p>
                </header>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-8" aria-hidden="true">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all ${
                        i + 1 <= step ? "bg-indigo-600 w-8" : "bg-slate-200 w-2"
                      }`}
                    />
                  ))}
                </div>

                <form onSubmit={nextStep} className="space-y-6" aria-label={t("stepper.form_aria", "Progressive Authentication Form")}>
                  <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="relative">
                    <label htmlFor={steps[step].field} className="sr-only">
                      {steps[step].title}
                    </label>
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${shake ? 'text-red-500' : 'text-slate-400'}`}>
                      {steps[step].icon}
                    </div>

                    <input
                      id={steps[step].field}
                      autoFocus
                      required
                      aria-required="true"
                      aria-invalid={shake ? "true" : "false"}
                      aria-describedby={steps[step].hint ? "step-hint" : undefined}
                      type={
                        steps[step].type === "password" && showPassword
                          ? "text"
                          : steps[step].type
                      }
                      placeholder={steps[step].placeholder}
                      value={form[steps[step].field]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [steps[step].field]: e.target.value,
                        })
                      }
                      className={`w-full py-4 pl-12 pr-12 rounded-xl border outline-none transition ${shake ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 bg-red-50' : 'border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                    />

                    {steps[step].type === "password" && (
                      <button
                        type="button"
                        aria-label={showPassword ? t("stepper.hide_pw", "Hide password") : t("stepper.show_pw", "Show password")}
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${shake ? 'text-red-500' : 'text-slate-400'}`}
                      >
                        {showPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </motion.div>

                  {steps[step].hint && (
                    <p id="step-hint" className={`text-xs ${shake ? 'text-red-500 font-medium' : 'text-slate-400'}`} role={shake ? "alert" : "status"}>
                      {shake && <AlertCircle className="w-3 h-3 inline mr-1 -mt-0.5" />}
                      {steps[step].hint}
                    </p>
                  )}

                  <button
                    disabled={!canContinue() || loading}
                    aria-live="polite"
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-40 transition shadow-lg shadow-slate-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        {t("stepper.processing", "Processing...")}
                      </>
                    ) : (
                      <>
                        {step === totalSteps
                          ? mode === "signup"
                            ? t("stepper.btn_create", "Create account")
                            : t("stepper.btn_signin", "Sign in")
                          : t("stepper.btn_continue", "Continue")}
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-10 text-center text-xs text-slate-400">
                  {mode === "signup" ? t("stepper.already_have", "Already have an account?") : t("stepper.new_here", "New here?")}
                  <button
                    onClick={() => {
                      setMode(mode === "signup" ? "login" : "signup");
                      setStep(1);
                      setForm({ email: "", name: "", password: "" }); // Reset
                    }}
                    className="ml-1 font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline"
                  >
                    {mode === "signup" ? t("stepper.link_signin", "Sign in") : t("stepper.link_create", "Create account")}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
                role="alert"
                aria-live="assertive"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold">
                  {t("stepper.welcome", "Welcome")}{form.name && `, ${form.name.split(" ")[0]}`}!
                </h2>
                <p className="text-slate-500 mt-2">
                  {t("stepper.workspace_ready", "Your secure workspace is ready.")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs tracking-widest uppercase" aria-hidden="true">
          <Sparkles size={14} />
          {t("stepper.intelligent", "Intelligent Authentication")}
        </div>
      </motion.div>
    </div>
  );
};
