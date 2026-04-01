import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const ModernSignup = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState("email"); // email -> details -> final
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorType("email");
      return;
    }
    setErrorType(null);
    setLoading(true);
    setTimeout(() => {
      const userExists = email === "user@company.com";
      setIsLogin(userExists);
      setStep("details");
      setLoading(false);
    }, 800);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && name.trim() === "") {
      setErrorType("name");
      return;
    }
    if (password.length < 6) {
      setErrorType("password");
      return;
    }
    setErrorType(null);
    setLoading(true);
    setTimeout(() => {
      setStep("success");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[90%] p-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <header className="mb-8">
                  <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                    {t("modern.welcome", "Welcome.")}
                  </h1>
                  <p className="text-slate-500 mt-2">
                    {t(
                      "modern.enter_email",
                      "Enter your email to get started.",
                    )}
                  </p>
                </header>

                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-6"
                  aria-label={t("modern.email_form", "Email Form")}
                >
                  <div className="space-y-1">
                    <motion.div
                      animate={
                        errorType === "email"
                          ? { x: [-10, 10, -10, 10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className="relative group"
                    >
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          errorType === "email"
                            ? "text-red-400"
                            : "text-slate-400 group-focus-within:text-indigo-500"
                        }`}
                        aria-hidden="true"
                      />
                      <input
                        autoFocus
                        type="email"
                        id="email-input"
                        required
                        aria-required="true"
                        aria-invalid={errorType === "email" ? "true" : "false"}
                        aria-describedby={
                          errorType === "email" ? "email-error" : undefined
                        }
                        aria-label={t("modern.email_label", "Email Address")}
                        placeholder={t(
                          "modern.email_placeholder",
                          "name@company.com",
                        )}
                        className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-10 outline-none transition-all ${
                          errorType === "email"
                            ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            : "border-slate-100 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        }`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorType === "email") setErrorType(null);
                        }}
                      />
                      {errorType === "email" && (
                        <AlertCircle
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500"
                          aria-hidden="true"
                        />
                      )}
                    </motion.div>
                    {errorType === "email" && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1 ml-1"
                        role="alert"
                      >
                        {t(
                          "modern.invalid_email",
                          "Please enter a valid email.",
                        )}
                      </motion.p>
                    )}
                  </div>

                  <button
                    disabled={loading || !email}
                    aria-live="polite"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-75 transition-all shadow-lg shadow-slate-200"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          aria-hidden="true"
                        />
                        {t("modern.recognizing", "Recognizing...")}
                      </>
                    ) : (
                      <>
                        {t("modern.continue", "Continue")}
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <button
                  onClick={() => setStep("email")}
                  aria-label={t("modern.go_back", "Go Back")}
                  className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />{" "}
                  {t("modern.back", "Back")}
                </button>

                <header className="mb-8">
                  <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                    {isLogin
                      ? t("modern.welcome_back", "Welcome back.")
                      : t("modern.nice_to_meet", "Nice to meet you.")}
                  </h1>
                  <p className="text-slate-500 mt-2">
                    {isLogin
                      ? t(
                          "modern.verify_identity",
                          "Please verify your identity.",
                        )
                      : t(
                          "modern.setup_account",
                          "Let's set up your new account.",
                        )}
                  </p>
                </header>

                <form
                  onSubmit={handleFinalSubmit}
                  className="space-y-4"
                  aria-label={t("modern.details_form", "Details Form")}
                >
                  {!isLogin && (
                    <div className="space-y-1">
                      <motion.div
                        animate={
                          errorType === "name"
                            ? { x: [-10, 10, -10, 10, 0] }
                            : {}
                        }
                        transition={{ duration: 0.4 }}
                        className="relative group"
                      >
                        <User
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                            errorType === "name"
                              ? "text-red-400"
                              : "text-slate-400 group-focus-within:text-indigo-500"
                          }`}
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          id="name-input"
                          required
                          aria-required="true"
                          aria-invalid={errorType === "name" ? "true" : "false"}
                          aria-describedby={
                            errorType === "name" ? "name-error" : undefined
                          }
                          aria-label={t("modern.name_label", "Full Name")}
                          placeholder={t(
                            "modern.name_placeholder",
                            "Your full name",
                          )}
                          className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-10 outline-none transition-all ${
                            errorType === "name"
                              ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                              : "border-slate-100 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          }`}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errorType === "name") setErrorType(null);
                          }}
                        />
                        {errorType === "name" && (
                          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                      </motion.div>
                      {errorType === "name" && (
                        <p
                          id="name-error"
                          className="text-sm text-red-500 mt-1 ml-1"
                          role="alert"
                        >
                          {t("modern.name_required", "Full name is required.")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <motion.div
                      animate={
                        errorType === "password"
                          ? { x: [-10, 10, -10, 10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className="relative group"
                    >
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          errorType === "password"
                            ? "text-red-400"
                            : "text-slate-400 group-focus-within:text-indigo-500"
                        }`}
                        aria-hidden="true"
                      />
                      <input
                        autoFocus
                        type={showPass ? "text" : "password"}
                        id="password-input"
                        required
                        aria-required="true"
                        aria-invalid={
                          errorType === "password" ? "true" : "false"
                        }
                        aria-describedby={
                          errorType === "password" ? "pw-error" : undefined
                        }
                        aria-label={t("modern.password_label", "Password")}
                        placeholder={
                          isLogin
                            ? t("modern.enter_password", "Enter password")
                            : t("modern.create_password", "Create password")
                        }
                        className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-12 outline-none transition-all ${
                          errorType === "password"
                            ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            : "border-slate-100 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        }`}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorType === "password") setErrorType(null);
                        }}
                      />
                      <button
                        type="button"
                        aria-label={
                          showPass
                            ? t("modern.hide_password", "Hide password")
                            : t("modern.show_password", "Show password")
                        }
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </motion.div>
                    {errorType === "password" && (
                      <p
                        id="pw-error"
                        className="text-sm text-red-500 mt-1 ml-1"
                        role="alert"
                      >
                        {t(
                          "modern.password_error",
                          "Password must be at least 6 characters.",
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={loading}
                    aria-live="polite"
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-medium mt-4 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          aria-hidden="true"
                        />
                        {t("modern.processing", "Processing...")}
                      </>
                    ) : isLogin ? (
                      t("modern.sign_in", "Sign in to Dashboard")
                    ) : (
                      t("modern.create_account", "Create my account")
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="step-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
                role="alert"
                aria-live="assertive"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2
                    className="w-10 h-10 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <h1 className="text-2xl font-semibold text-slate-800">
                  {t("modern.all_set", "You're all set.")}
                </h1>
                <p className="text-slate-500 mt-2 mb-8">
                  {t(
                    "modern.redirecting",
                    "Redirecting you to your workspace...",
                  )}
                </p>
                <div
                  className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                  aria-hidden="true"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p
          className="text-center mt-8 text-sm text-slate-400"
          aria-hidden="true"
        >
          {t("modern.secure_footer", "Secure, encrypted, and private.")}
        </p>
      </motion.div>
    </div>
  );
};
