import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const StepperSignup = () => {
  const [mode, setMode] = useState("signup"); // signup | login
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  const totalSteps = mode === "signup" ? 3 : 2;

  const isEmailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(form.email),
    [form.email]
  );

  const isPasswordStrong = useMemo(
    () => form.password.length >= 10,
    [form.password]
  );

  const canContinue = () => {
    if (step === 1) return isEmailValid;
    if (step === 2 && mode === "signup") return form.name.length >= 2;
    if (step === totalSteps) return isPasswordStrong;
    return false;
  };

  const nextStep = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (step < totalSteps) setStep(step + 1);
      else setSuccess(true);
    }, 700);
  };

  const steps = {
    1: {
      title: "Your email address",
      subtitle: "We’ll use this to identify and protect your account.",
      field: "email",
      type: "email",
      placeholder: "you@example.com",
      icon: <Mail size={18} />,
      hint: !form.email
        ? "Enter a valid email address"
        : isEmailValid
        ? "Looks good"
        : "That email doesn’t look right",
    },
    2: {
      title:
        mode === "signup"
          ? "Choose your display name"
          : "Enter your password",
      subtitle:
        mode === "signup"
          ? "This will appear on your profile and workspace."
          : "Make sure no one is watching 👀",
      field: mode === "signup" ? "name" : "password",
      type: mode === "signup" ? "text" : "password",
      placeholder:
        mode === "signup" ? "John Doe" : "Your secure password",
      icon: mode === "signup" ? <User size={18} /> : <Lock size={18} />,
    },
    3: {
      title: "Secure your account",
      subtitle: "Use at least 10 characters for strong protection.",
      field: "password",
      type: "password",
      placeholder: "Create a strong password",
      icon: <Lock size={18} />,
      hint: isPasswordStrong
        ? "Strong password"
        : "At least 10 characters required",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-200/40 rounded-full blur-[120px]" />
      </div>

      <motion.div layout className="relative z-10 w-full max-w-[420px] px-6">
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
                  <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold">
                    {mode === "signup" ? "Create account" : "Welcome back"}
                  </span>
                  <h1 className="text-2xl font-semibold text-slate-900 mt-2">
                    {steps[step].title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-2">
                    {steps[step].subtitle}
                  </p>
                </header>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all ${
                        i + 1 <= step
                          ? "bg-indigo-600 w-8"
                          : "bg-slate-200 w-2"
                      }`}
                    />
                  ))}
                </div>

                <form onSubmit={nextStep} className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {steps[step].icon}
                    </div>

                    <input
                      autoFocus
                      required
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
                      className="w-full py-4 pl-12 pr-12 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                    />

                    {steps[step].type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>

                  {steps[step].hint && (
                    <p className="text-xs text-slate-400">
                      {steps[step].hint}
                    </p>
                  )}

                  <button
                    disabled={!canContinue() || loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-40 transition"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        {step === totalSteps
                          ? mode === "signup"
                            ? "Create account"
                            : "Sign in"
                          : "Continue"}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-10 text-center text-xs text-slate-400">
                  {mode === "signup" ? "Already have an account?" : "New here?"}
                  <button
                    onClick={() => {
                      setMode(mode === "signup" ? "login" : "signup");
                      setStep(1);
                    }}
                    className="ml-1 font-semibold text-indigo-600"
                  >
                    {mode === "signup" ? "Sign in" : "Create account"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">
                  Welcome{form.name && `, ${form.name.split(" ")[0]}`}!
                </h2>
                <p className="text-slate-500 mt-2">
                  Your secure workspace is ready.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs tracking-widest uppercase">
          <Sparkles size={14} />
          Intelligent Authentication
        </div>
      </motion.div>
    </div>
  );
};
