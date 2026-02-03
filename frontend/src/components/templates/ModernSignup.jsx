import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ModernSignup = () => {
  const [step, setStep] = useState('email'); // email -> details -> final
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Mock "Check Email" logic
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return; 
    
    setLoading(true);
    setTimeout(() => {
      // Simulate checking if user exists
      const userExists = email === "[EMAIL_ADDRESS]"; 
      setIsLogin(userExists);
      setStep('details');
      setLoading(false);
    }, 800);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('success');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 md:p-10">
          
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <header className="mb-8">
                  <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Welcome.</h1>
                  <p className="text-slate-500 mt-2">Enter your email to get started.</p>
                </header>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      autoFocus
                      type="email" 
                      required
                      placeholder="name@company.com"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    disabled={loading || !email}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-200"
                  >
                    {loading ? "Recognizing..." : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <button 
                  onClick={() => setStep('email')}
                  className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <header className="mb-8">
                  <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                    {isLogin ? "Welcome back." : "Nice to meet you."}
                  </h1>
                  <p className="text-slate-500 mt-2">
                    {isLogin ? "Please verify your identity." : "Let's set up your new account."}
                  </p>
                </header>

                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="Your full name"
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      autoFocus
                      type={showPass ? "text" : "password"} 
                      required
                      placeholder={isLogin ? "Enter password" : "Create password"}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-medium mt-4 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {loading ? "Processing..." : (isLogin ? "Sign in to Dashboard" : "Create my account")}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-800">You're all set.</h1>
                <p className="text-slate-500 mt-2 mb-8">Redirecting you to your workspace...</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
        
        <p className="text-center mt-8 text-sm text-slate-400">
          Secure, encrypted, and private.
        </p>
      </motion.div>
    </div>
  );
};
