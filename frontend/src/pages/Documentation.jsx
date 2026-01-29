import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  BookOpen, Zap, ShieldCheck, Copy, CheckCircle2,
  Menu, X, Terminal, Github, RefreshCcw, ExternalLink,
  ArrowLeft, Layers, AlertCircle, Code2, Cpu, Globe, Lock,
  FileJson, TerminalSquare, Info,
  ChevronDown, Settings2
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { getProjects } from "@/api/ProjectAPI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Docs = () => {
  const { user } = React.useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
          const res = await getProjects();
          if (res.success && res.data.length > 0) {
            setProjects(res.data);
            setSelectedProject(res.data[0]);
          }
        } catch (error) {
          console.error("Failed to fetch projects for docs", error);
        } finally {
          setProjectsLoading(false);
        }
      };
      fetchProjects();
    }
  }, [user]);

  const publicKey = selectedProject?.publicKey || "YOUR_PUBLIC_KEY";
  const projectId = selectedProject?._id || "YOUR_PROJECT_ID";

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const sections = [
    { id: "introduction", title: "Introduction", icon: BookOpen },
    { id: "quick-start", title: "Quick Start", icon: Zap },
    { id: "react-integration", title: "React Integration", icon: Code2 },
    { id: "authentication", title: "Authentication", icon: ShieldCheck },
    { id: "api-reference", title: "API Reference", icon: FileJson },
    { id: "cli", title: "CLI Tool", icon: TerminalSquare },
    { id: "session", title: "Sessions", icon: RefreshCcw },
    { id: "security", title: "Security", icon: Lock },
    { id: "errors", title: "Error Handling", icon: AlertCircle },
  ];

  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const nextSection = sections[currentIndex + 1];
  const prevSection = sections[currentIndex - 1];

  const navigateTo = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CodeBlock = ({ code, id, language = "bash" }) => (
    <div className="relative group my-4">
      <div className="absolute left-4 -top-2.5 px-2 py-0.5 bg-card rounded text-xs font-mono text-muted-foreground border">
        {language}
      </div>
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => copyCode(code, id)}
          className="p-1.5 bg-muted hover:bg-muted/80 rounded text-muted-foreground border transition-all"
        >
          {copied === id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="bg-muted/50 rounded-lg p-4 pt-6 overflow-x-auto border">
        <code className="text-sm font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen">

      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg border flex items-center justify-center">
              <img src="/assets/logo.png" alt="AuthSphere" className="h-6 w-6 object-contain dark:invert" />
            </div>
            <span className="font-bold">AuthSphere</span>
            <Badge variant="outline" className="hidden sm:inline-flex ml-2 text-xs">v2.4.0</Badge>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <AnimatedThemeToggler />
            <Button size="sm" variant="ghost" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <AnimatedThemeToggler />
            <button className="p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">

        {/* SIDEBAR */}
        <aside className={`
          fixed inset-0 z-40 bg-background/90 md:bg-transparent
          md:sticky md:top-16 md:h-[calc(100vh-64px)] md:block w-full md:w-64 border-r p-6 transition-transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-4 px-3">Documentation</p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => navigateTo(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <s.icon className="h-4 w-4" />
                {s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-6 md:px-12 py-12 max-w-4xl min-w-0">

          {/* PROJECT SELECTOR FOR LOGGED IN USERS */}
          {user && (
            <div className="mb-10 p-6 rounded-2xl border bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Settings2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Personalized Documentation</h3>
                  <p className="text-sm text-muted-foreground italic">We've injected your real API keys into the snippets below.</p>
                </div>
              </div>

              {projects.length > 0 ? (
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Active Project:</span>
                  <Select
                    value={selectedProject?._id}
                    onValueChange={(val) => setSelectedProject(projects.find(p => p._id === val))}
                  >
                    <SelectTrigger className="w-full md:w-[240px] bg-background">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/dashboard">Create a Project</Link>
                </Button>
              )}
            </div>
          )}

          {/* INTRODUCTION */}
          {activeSection === "introduction" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <Badge variant="outline">Documentation / Introduction</Badge>
              <h1 className="text-4xl font-bold tracking-tight">Modern Identity Infrastructure</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AuthSphere is the identity layer for modern internet companies. We provide a headless, developer-first
                authentication engine that handles the heavy lifting of security, session persistence, and multi-provider
                OAuth so you can focus on building your core product.
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-10">
                {[
                  { icon: ShieldCheck, title: "Hardened Security", desc: "PKCE-compliant flows with automated token rotation." },
                  { icon: Cpu, title: "Edge Auth", desc: "Global auth persistence with sub-30ms verification." },
                  { icon: Globe, title: "Multi-Provider", desc: "One API for Google, GitHub, Discord, LinkedIn, GitLab, Twitch, Bitbucket, and Microsoft." }
                ].map((item, i) => (
                  <Card key={i} className="bg-muted/30 border-none shadow-none">
                    <CardHeader className="p-4">
                      <item.icon className="h-5 w-5 text-primary mb-2" />
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <Separator />

              <h2 className="text-2xl font-bold mt-8">Core Concepts</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0 mt-1">1</div>
                  <p><strong>Headless UI:</strong> We don't force a UI on you. Use our SDK to build the exact login experience you want.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0 mt-1">2</div>
                  <p><strong>Stateless Sessions:</strong> Transparently manage JWTs and refresh tokens using secure, encrypted browser storage.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0 mt-1">3</div>
                  <p><strong>Identity Unification:</strong> Automatically merge user identities across different providers based on verified emails.</p>
                </li>
              </ul>
            </article>
          )}

          {/* QUICK START */}
          {activeSection === "quick-start" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Quick Start Guide</h1>
              <p className="text-lg text-muted-foreground">
                Get AuthSphere running in your application in less than 5 minutes.
              </p>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-sm font-bold">1</span>
                    Install the SDK
                  </h3>
                  <p className="text-muted-foreground mb-4">First, add our lightweight SDK to your project dependencies.</p>
                  <CodeBlock id="install" code="npm install @authspherejs/sdk" language="terminal" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-sm font-bold">2</span>
                    Configure Redirect URIs
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Go to your <Link to="/dashboard" className="text-primary hover:underline font-medium">Dashboard</Link>,
                    select your project, and add your development URL (e.g., <code>http://localhost:3000</code>) to the
                    Allowed Redirect URIs list.
                  </p>
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex gap-3">
                    <Info className="h-5 w-5 shrink-0" />
                    Production environments MUST use HTTPS. Localhost is the only exception for HTTP.
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-sm font-bold">3</span>
                    Initialize the Client
                  </h3>
                  <p className="text-muted-foreground mb-4">Initialize the SDK at the root of your application with your Public Key.</p>
                  <CodeBlock
                    id="init"
                    code={`import { AuthSphere } from '@authspherejs/sdk'\n\nAuthSphere.init({\n  publicKey: '${publicKey}', // Found in Dashboard\n  domain: 'auth.authsphere.com'\n})`}
                    language="typescript"
                  />
                </div>
              </div>
            </article>
          )}

          {/* REACT INTEGRATION */}
          {activeSection === "react-integration" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">React Integration</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                While the core SDK is vanilla JS, we provide a first-class React experience via context hooks.
              </p>

              <h2 className="text-2xl font-bold mt-8">The AuthProvider Pattern</h2>
              <p className="text-muted-foreground">Wrap your app in the provider to access authentication state anywhere.</p>

              <CodeBlock
                id="react-provider"
                code={`import { AuthSphereProvider } from '@authspherejs/react';\n\nfunction Root() {\n  return (\n    <AuthSphereProvider publicKey="${publicKey}" redirectUri={window.location.origin}>\n      <App />\n    </AuthSphereProvider>\n  );\n}`}
                language="tsx"
              />

              <h2 className="text-2xl font-bold mt-10">Using the Hook</h2>
              <p className="text-muted-foreground">Access state and methods with a single line of code.</p>

              <CodeBlock
                id="react-hook"
                code={`import { useAuthSphere } from '@authspherejs/react';\n\nfunction Profile() {\n  const { user, isAuthenticated, isLoading, logout } = useAuthSphere();\n\n  if (isLoading) return <Loader />;\n  if (!isAuthenticated) return <LoginButton />;\n\n  return (\n    <div>\n      <img src={user.picture} />\n      <h1>{user.name}</h1>\n      <button onClick={() => logout()}>Logout</button>\n    </div>\n  );\n}`}
                language="tsx"
              />
            </article>
          )}

          {/* AUTHENTICATION */}
          {activeSection === "authentication" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Executing Authentication</h1>
              <p className="text-lg text-muted-foreground">
                AuthSphere manages the complex dance of OAuth 2.0 and PKCE redirects for you.
              </p>

              <h2 className="text-xl font-semibold mt-10">Triggering Login</h2>
              <p className="text-muted-foreground">Simply specify the provider and optional scopes.</p>
              <CodeBlock
                id="auth-flow"
                code={`// Social Login\nawait AuthSphere.loginWith('google', {\n  scopes: ['email', 'profile'],\n  prompt: 'select_account'\n});\n\n// Passwordless Magic Link\nawait AuthSphere.loginWithMagicLink({\n  email: 'user@example.com',\n  callbackUrl: 'https://app.com/verify'\n});`}
                language="javascript"
              />

              <div className="p-6 rounded-xl border bg-primary/5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  What happens under the hood?
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 pl-4">
                  When <code>loginWith</code> is called, the SDK generates a cryptographically secure <b>Code Verifier</b> and a <b>State</b> parameter.
                  These are stored in temporary secure storage. After the provider redirects back, the SDK automatically
                  completes the exchange, verifies the payload, and clears the temporary state.
                </p>
              </div>
            </article>
          )}

          {/* API REFERENCE */}
          {activeSection === "api-reference" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>

              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-bold font-mono text-primary">.init(config)</h3>
                  <p className="text-sm text-muted-foreground my-2">Initializes the SDK instance globally.</p>
                  <div className="bg-muted p-4 rounded-lg text-xs font-mono">
                    publicKey: string // Required. Your app public key.<br />
                    redirectUri: string // Optional. Defaults to window.location.origin.<br />
                    storage: 'local' | 'session' // Optional. Defaults to 'local'.
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-mono text-primary">.getUser()</h3>
                  <p className="text-sm text-muted-foreground my-2">Returns the currently authenticated user object or null.</p>
                  <CodeBlock id="ref-getuser" code={`const user = await AuthSphere.getUser();\n// { sub, name, email, picture, ... }`} language="javascript" />
                </section>

                <section>
                  <h3 className="text-xl font-bold font-mono text-primary">.isAuthenticated()</h3>
                  <p className="text-sm text-muted-foreground my-2">Synchronous check for a valid session. Uses sub-millisecond local check.</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-mono text-primary">.logout(options)</h3>
                  <p className="text-sm text-muted-foreground my-2">Clears local sessions and optionally signals the remote server.</p>
                </section>
              </div>
            </article>
          )}

          {/* CLI */}
          {activeSection === "cli" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">CLI Tooling</h1>
              <p className="text-lg text-muted-foreground">
                Manage your AuthSphere infrastructure directly from the terminal.
              </p>

              <CodeBlock id="cli-install" code="npm install -g @authsphere/cli" language="terminal" />

              <h3 className="text-xl font-bold mt-10">Common Commands</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-muted/20">
                  <code className="text-sm font-bold text-primary">authsphere login</code>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Authenticates your CLI with your developer account.</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/20">
                  <code className="text-sm font-bold text-primary">authsphere projects use "{projectId}"</code>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Sets the active context for subsequent commands.</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/20">
                  <code className="text-sm font-bold text-primary">authsphere logs --tail</code>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Stream real-time authentication events to your terminal.</p>
                </div>
              </div>
            </article>
          )}

          {/* SESSIONS */}
          {activeSection === "session" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Session Persistence</h1>
              <p className="text-lg text-muted-foreground">
                AuthSphere automatically handles JWT rotation and secure cookie management.
              </p>

              <div className="p-4 border-l-4 border-amber-500 bg-amber-500/5 text-sm text-balance">
                <p className="font-bold text-amber-700 dark:text-amber-400">Security Warning:</p>
                <p className="text-muted-foreground mt-1 line-height-relaxed">
                  Avoid storing sensitive business logic in the JWT. While JWTs are signed, their payload is easily readable by anyone.
                  Always use the <b>sub</b> ID to perform database queries on your backend.
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-10">Token Refreshing</h2>
              <p className="text-muted-foreground leading-relaxed">
                By default, access tokens expire every 15 minutes. The SDK will automatically use the
                Refresh Token to get a new Access Token in the background, ensuring zero friction for the user.
              </p>

              <CodeBlock
                id="session-check"
                code={`// Manually trigger a token silent refresh\nawait AuthSphere.refreshToken();`}
                language="javascript"
              />
            </article>
          )}

          {/* ERRORS */}
          {activeSection === "errors" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Standard Error Codes</h1>
              <p className="text-lg text-muted-foreground">
                Predictable error handling for a smoother developer experience.
              </p>

              <div className="rounded-xl border divide-y overflow-hidden mt-8">
                {[
                  { code: "AUTH_DOMAIN_NOT_ALLOWED", desc: "The current domain is not in the whitelist for this project." },
                  { code: "OAUTH_CALLBACK_ERROR", desc: "Provider failed to authenticate user (e.g. user cancelled)." },
                  { code: "TOKEN_EXPIRED", desc: "The refresh token is no longer valid. Re-authentication required." },
                  { code: "PKCE_MISMATCH", desc: "Internal security error. Potential CSRF attempt detected." }
                ].map((err, i) => (
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 bg-muted/10 group hover:bg-muted/20 transition-colors">
                    <code className="text-sm font-bold text-destructive shrink-0">{err.code}</code>
                    <p className="text-sm text-muted-foreground">{err.desc}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <article className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Enterprise-Grade Security</h1>
              <p className="text-lg text-muted-foreground">
                We take security seriously so you don't have to build it from scratch.
              </p>

              <div className="space-y-4 mt-8">
                {[
                  {
                    title: "Automated Token Rotation",
                    desc: "Every time a refresh token is used, a new one is issued and the old one is invalidated.",
                    tag: "Standard",
                    variant: "default"
                  },
                  {
                    title: "Brute Force Protection",
                    desc: "Intelligent rate-limiting and temporary account lockouts after 5 failed attempts.",
                    tag: "Integrated",
                    variant: "secondary"
                  },
                  {
                    title: "Device Fingerprinting",
                    desc: "Notify users when logins occur from unrecognized devices or suspicious IP addresses.",
                    tag: "Advanced",
                    variant: "outline"
                  }
                ].map((item, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.desc}</CardDescription>
                        </div>
                        <Badge variant={item.variant} className="shrink-0">{item.tag}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </article>
          )}

          {/* NAVIGATION FOOTER */}
          <div className="mt-20 pt-10 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSection ? (
              <button
                onClick={() => navigateTo(prevSection.id)}
                className="flex flex-col items-start p-5 rounded-xl border hover:bg-muted/50 transition-all text-left group"
              >
                <span className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Previous
                </span>
                <span className="font-semibold">{prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection && (
              <button
                onClick={() => navigateTo(nextSection.id)}
                className="flex flex-col items-end p-5 rounded-xl border hover:bg-muted/50 transition-all text-right group"
              >
                <span className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  Next <ArrowLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-semibold">{nextSection.title}</span>
              </button>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Docs;
