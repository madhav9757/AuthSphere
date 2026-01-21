import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  BookOpen, Zap, ShieldCheck, Copy, CheckCircle2,
  Menu, X, ChevronRight, Terminal, Search, Key,
  Sparkles, Cpu, RefreshCcw, ExternalLink, Layers, AlertCircle,
  ArrowLeft, ArrowRight, Github, Lock
} from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const sections = [
    { id: "introduction", title: "Introduction", icon: <BookOpen size={18} /> },
    { id: "quick-start", title: "Quick Start", icon: <Zap size={18} /> },
    { id: "authentication", title: "Authentication", icon: <Cpu size={18} /> },
    { id: "session", title: "Sessions", icon: <RefreshCcw size={18} /> },
    { id: "redirects", title: "Redirects", icon: <ExternalLink size={18} /> },
    { id: "security", title: "Security", icon: <ShieldCheck size={18} /> },
  ];

  // Logic to handle "Next/Previous" navigation
  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const nextSection = sections[currentIndex + 1];
  const prevSection = sections[currentIndex - 1];

  const navigateTo = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CodeBlock = ({ code, id, language = "bash" }) => (
    <div className="relative group my-6">
      <div className="absolute left-6 -top-3 px-2 py-1 bg-slate-900 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-800">
        {language}
      </div>
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => copyCode(code, id)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 backdrop-blur-md border border-white/10 transition-all"
        >
          {copied === id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="bg-slate-950 rounded-2xl p-8 pt-10 overflow-x-auto border border-slate-800 shadow-2xl">
        <code className="text-sm font-mono text-indigo-300/90 leading-relaxed">{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-100 dark:selection:bg-indigo-900 font-sans antialiased">

      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="bg-white border border-border p-1 rounded-lg shadow-sm">
              <img src="/assets/logo.png" alt="AuthSphere Logo" className="h-6 w-6 object-contain mix-blend-multiply" />
            </div>
            <span className="font-bold tracking-tight text-foreground">AuthSphere</span>
            <Badge variant="outline" className="hidden sm:inline-flex ml-2 font-mono text-[10px] text-muted-foreground border-border uppercase">v2.4.0-stable</Badge>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search documentation (⌘K)"
                className="bg-muted/50 border border-transparent rounded-full py-2 pl-9 pr-4 text-xs w-64 focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-border transition-all outline-none"
              />
            </div>
            <Separator orientation="vertical" className="h-4" />
            <ModeToggle />
            <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={20} /></a>
            <Button size="sm" asChild className="bg-primary hover:bg-indigo-600 rounded-full px-6 transition-all duration-300 shadow-lg shadow-primary/10">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <ModeToggle />
            <button className="p-2 text-muted-foreground" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto flex relative">

        {/* 2. SIDEBAR NAVIGATION */}
        <aside className={`
          fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none 
          md:sticky md:top-16 md:h-[calc(100vh-64px)] md:z-0 md:block w-full md:w-72 border-r border-border px-8 py-10 transition-all
          ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"}
        `}>
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Fundamental Docs</p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => navigateTo(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-100/50 dark:shadow-none"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
              >
                <span className={activeSection === s.id ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-950 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/5">
            <Lock size={80} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
            <div className="relative z-10">
              <p className="text-xs font-medium text-indigo-400 mb-1">Production Ready?</p>
              <p className="text-sm font-bold mb-4 leading-tight">Switch your keys to the Live Environment.</p>
              <Button size="sm" variant="secondary" className="w-full bg-white text-slate-950 hover:bg-indigo-50 transition-colors font-bold">
                Get Live Keys
              </Button>
            </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 px-6 md:px-16 lg:px-24 py-16 max-w-5xl overflow-hidden animate-in fade-in duration-500">

          {/* SECTION: INTRODUCTION */}
          {activeSection === "introduction" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge variant="outline" className="mb-4 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10">Docs / Introduction</Badge>
              <h1 className="text-5xl font-black tracking-tight text-foreground mb-6 italic">Modern Identity.</h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                AuthSphere is a headless authentication engine designed for speed. We handle the heavy lifting of OAuth 2.0, PKCE, and session persistence so you can ship features faster.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="p-2 bg-background border border-border text-indigo-600 dark:text-indigo-400 w-fit rounded-lg mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">Secure by Default</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Built-in PKCE flows and automated token rotation cycles protect your users from replay attacks.</p>
                </div>
                <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="p-2 bg-background border border-border text-violet-600 dark:text-violet-400 w-fit rounded-lg mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Layers size={20} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">Zero Layout Shift</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Our SDK caches session states locally to ensure instant rendering without annoying auth flickers.</p>
                </div>
              </div>
            </article>
          )}

          {/* SECTION: QUICK START */}
          {activeSection === "quick-start" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Quick Start</h1>
              <p className="text-muted-foreground mb-12 text-lg">Integrate AuthSphere into your application in less than three minutes.</p>

              <div className="space-y-12">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none">1</span>
                    Install the SDK
                  </h3>
                  <CodeBlock id="install" code="npm install @authsphere/sdk" language="terminal" />
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none">2</span>
                    Initialize client
                  </h3>
                  <CodeBlock id="init" code={`import AuthSphere from '@authsphere/sdk'\n\nAuthSphere.initAuth({\n  publicKey: 'pub_live_f28sh92...', \n  redirectUri: 'https://yourapp.com/callback'\n})`} language="typescript" />
                </div>
              </div>
            </article>
          )}

          {/* SECTION: AUTHENTICATION */}
          {activeSection === "authentication" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Authentication</h1>
              <p className="text-muted-foreground mb-8 text-lg">Trigger login flows for any of our 20+ supported social providers.</p>

              <CodeBlock id="auth-flow" code={`// Start a Google OAuth flow\nconst handleLogin = async () => {\n  await AuthSphere.loginWith('google', {\n    scopes: ['email', 'profile'],\n    prompt: 'select_account'\n  });\n};`} language="javascript" />

              <div className="mt-8 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                  <Terminal size={16} /> Pro Tip
                </h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
                  You can pass custom state parameters to `loginWith` to persist application context through the redirect cycle.
                </p>
              </div>
            </article>
          )}

          {/* SECTION: SESSIONS */}
          {activeSection === "session" && (activeSection === "session" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Session Management</h1>
              <p className="text-muted-foreground mb-8 text-lg">AuthSphere handles the persistence of JWTs in secure, encrypted storage.</p>

              <h3 className="text-xl font-bold mb-4 text-foreground">Get Current User</h3>
              <CodeBlock id="get-user" code={`const { user, isAuthenticated } = AuthSphere.useAuth();\n\nif (isAuthenticated) {\n  console.log('Welcome back,', user.name);\n}`} language="typescript" />

              <h3 className="text-xl font-bold mt-12 mb-4 text-foreground">Logout</h3>
              <CodeBlock id="logout" code={`await AuthSphere.logout({\n  returnTo: window.location.origin\n});`} language="typescript" />
            </article>
          ))}

          {/* SECTION: REDIRECTS */}
          {activeSection === "redirects" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Redirect URIs</h1>
              <p className="text-muted-foreground mb-8 text-lg">Security starts with strict whitelist validation. Configure your URIs in the dashboard.</p>

              <div className="p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex gap-4 text-rose-800 dark:text-rose-400 text-sm mb-10">
                <AlertCircle className="shrink-0" size={20} />
                <p className="font-medium">Strict HTTPS Enforcement: Production environments must use TLS/SSL. HTTP is only permitted for localhost development.</p>
              </div>

              <div className="grid gap-4">
                {["http://localhost:3000/callback", "https://app.yourdomain.com/auth"].map((uri, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 font-mono text-sm text-indigo-600 dark:text-indigo-400 flex justify-between items-center group">
                    {uri}
                    <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none">Whitelisted</Badge>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* SECTION: SECURITY */}
          {activeSection === "security" && (
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold mb-8 tracking-tight text-foreground">Security Best Practices</h1>
              <div className="grid gap-4">
                {[
                  { t: "Never Expose Secret Keys", c: "Your Secret Key should only ever exist in server-side environment variables.", tag: "Critical", color: "text-rose-600 dark:text-rose-400", borderColor: "border-rose-100 dark:border-rose-900/30" },
                  { t: "Rotate Tokens Frequently", c: "Use our built-in refresh token rotation to minimize impact of stolen credentials.", tag: "High", color: "text-amber-600 dark:text-amber-400", borderColor: "border-amber-100 dark:border-amber-900/30" },
                  { t: "Content Security Policy", c: "Add auth.authsphere.com to your CSP connect-src directives.", tag: "Best Practice", color: "text-indigo-600 dark:text-indigo-400", borderColor: "border-indigo-100 dark:border-indigo-900/30" }
                ].map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${item.borderColor} hover:border-indigo-500/30 transition-colors bg-card shadow-sm flex items-start justify-between gap-4 group`}>
                    <div>
                      <h4 className="font-bold text-foreground mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.t}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.c}</p>
                    </div>
                    <Badge variant="outline" className={`${item.color} font-bold text-[10px] uppercase tracking-tighter`}>{item.tag}</Badge>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* 4. NAVIGATION FOOTER (Next/Prev) */}
          <div className="mt-24 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSection ? (
              <button
                onClick={() => navigateTo(prevSection.id)}
                className="flex flex-col items-start p-6 rounded-2xl border border-border hover:border-indigo-500/30 hover:bg-muted/30 transition-all text-left group"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ArrowLeft size={12} /> Previous</span>
                <span className="font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection ? (
              <button
                onClick={() => navigateTo(nextSection.id)}
                className="flex flex-col items-end p-6 rounded-2xl border border-border hover:border-indigo-500/30 hover:bg-muted/30 transition-all text-right group"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">Next <ArrowRight size={12} /></span>
                <span className="font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{nextSection.title}</span>
              </button>
            ) : <div />}
          </div>

          <footer className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex gap-8 text-xs text-muted-foreground font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Status</a>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">© 2026 AUTH-SPHERE.IDENTITY.PLATFORM</p>
          </footer>

        </main>
      </div>
    </div>
  );
};

const Separator = ({ orientation, className }) => (
  <div className={`${className} bg-border ${orientation === "vertical" ? "w-[1px] h-full" : "h-[1px] w-full"}`} />
);

export default Docs;