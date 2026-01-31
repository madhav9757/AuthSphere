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
  ChevronDown, Settings2, BarChart3
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
    { id: "frameworks", title: "Frameworks", icon: Layers },
    { id: "authentication", title: "Authentication", icon: ShieldCheck },
    { id: "configuration", title: "Configuration", icon: Settings2 },
    { id: "api-reference", title: "API Reference", icon: FileJson },
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
      <div className="absolute left-4 -top-2.5 px-2 py-0.5 bg-card rounded text-xs font-mono text-muted-foreground border shadow-sm">
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
      <pre className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-5 pt-8 overflow-x-auto border border-zinc-800 shadow-sm">
        <code className="text-sm font-mono leading-relaxed text-zinc-50">{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen">

      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg border flex items-center justify-center bg-primary/5">
              <img src="/assets/logo.png" alt="AuthSphere" className="h-5 w-5 object-contain dark:invert" />
            </div>
            <span className="font-bold tracking-tight">AuthSphere</span>
            <Badge variant="outline" className="hidden sm:inline-flex ml-2 text-[10px] h-5">v2.4.0</Badge>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <AnimatedThemeToggler />
            <Button size="sm" variant="ghost" asChild className="gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
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
          fixed inset-0 z-40 bg-background/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none
          md:sticky md:top-16 md:h-[calc(100vh-64px)] md:block w-full md:w-64 border-r p-6 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-4 px-3 tracking-wider">Documentation</p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => navigateTo(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
            <div className="mb-10 p-6 rounded-2xl border bg-gradient-to-br from-background to-muted/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-500 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Personalized Guide</h3>
                  <p className="text-sm text-muted-foreground">The examples below are tailored to your project configuration.</p>
                </div>
              </div>

              {projects.length > 0 ? (
                <div className="flex items-center gap-3 w-full md:w-auto bg-background p-1.5 rounded-lg border shadow-sm">
                  <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap px-2">Project:</span>
                  <Select
                    value={selectedProject?._id}
                    onValueChange={(val) => setSelectedProject(projects.find(p => p._id === val))}
                  >
                    <SelectTrigger className="w-full md:w-[200px] bg-transparent border-0 h-8 focus:ring-0">
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
                <Button size="sm" variant="default" asChild className="shadow-md">
                  <Link to="/dashboard">Create First Project</Link>
                </Button>
              )}
            </div>
          )}

          {/* INTRODUCTION */}
          {activeSection === "introduction" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">docs / intro</Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Identity for Humans</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  AuthSphere is the comprehensive identity platform for modern applications.
                  From simple social logins to complex enterprise SSO, we handle the infrastructure so you can build the product.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-10">
                {[
                  { icon: ShieldCheck, title: "Universal Auth", desc: "Connect Google, GitHub, Microsoft, and 20+ other providers with a single API." },
                  { icon: Lock, title: "Zero-Trust Security", desc: "Automated token rotation, PKCE flows, and brute-force protection out of the box." },
                  { icon: BarChart3, title: "Real-time Analytics", desc: "Track active users, login trends, and provider adoption in your dashboard." }, // Updated content
                  { icon: Settings2, title: "Fine-Grained Control", desc: "Customize token lifetimes, MFA policies, and allowed domains per project." } // Updated content
                ].map((item, i) => (
                  <Card key={i} className="bg-card hover:bg-muted/50 transition-colors cursor-default">
                    <CardHeader className="p-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="leading-relaxed mt-2">{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </article>
          )}

          {/* QUICK START */}
          {activeSection === "quick-start" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Quick Start</h1>
                <p className="text-lg text-muted-foreground">
                  Get up and running in under 5 minutes.
                </p>
              </div>

              <div className="space-y-12">
                <div className="relative pl-8 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  <h3 className="text-xl font-bold mb-3">1. Install the SDK</h3>
                  <p className="text-muted-foreground mb-4">Add the AuthSphere core SDK to your web application.</p>
                  <CodeBlock id="install" code="npm install @authspherejs/sdk" language="terminal" />
                </div>

                <div className="relative pl-8 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  <h3 className="text-xl font-bold mb-3">2. Configure Metadata</h3>
                  <p className="text-muted-foreground mb-4">
                    In your <Link to={`/projects/${projectId}/settings`} className="text-primary hover:underline font-medium">Project Settings</Link>,
                    ensure your <b>Allowed Origins</b> and <b>Redirect URIs</b> explicitly match your local environment.
                  </p>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm flex gap-3 items-start">
                    <Info className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <strong>Important:</strong> Security policies block all requests from unknown origins. Add <code>http://localhost:3000</code> (or your port) to test locally.
                    </div>
                  </div>
                </div>

                <div className="relative pl-8 border-l-2 border-muted">
                  <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                  <h3 className="text-xl font-bold mb-3">3. Initialize</h3>
                  <p className="text-muted-foreground mb-4">Initialize the client with your Public Key (Client ID).</p>
                  <CodeBlock
                    id="init"
                    code={`import { AuthSphere } from '@authspherejs/sdk'\n\n// Initialize inside your app entry point\nAuthSphere.init({\n  publicKey: '${publicKey}',\n})`}
                    language="javascript"
                  />
                </div>
              </div>
            </article>
          )}

          {/* FRAMEWORKS */}
          {activeSection === "frameworks" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Framework Integration</h1>
              <p className="text-lg text-muted-foreground">
                First-class support for the modern web ecosystem.
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">React / Next.js</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Wrap your application root with our <code>AuthSphereProvider</code> to enable hooks.
                  </p>
                  <CodeBlock
                    id="react-provider"
                    code={`// App.jsx or app/layout.tsx\nimport { AuthSphereProvider } from '@authspherejs/react';\n\nexport default function Root() {\n  return (\n    <AuthSphereProvider \n      publicKey="${publicKey}" \n      redirectUri="http://localhost:3000/callback"\n    >\n      <YourApp />\n    </AuthSphereProvider>\n  );\n}`}
                    language="tsx"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Using Hooks</h3>
                  <p className="text-muted-foreground mb-4">Access user state anywhere in your component tree.</p>
                  <CodeBlock
                    id="react-hook"
                    code={`import { useAuthSphere } from '@authspherejs/react';\n\nfunction UserProfile() {\n  const { user, loginWith, logout, isLoading } = useAuthSphere();\n\n  if (isLoading) return <Skeleton />;\n\n  if (!user) {\n    return <button onClick={() => loginWith('google')}>Login with Google</button>;\n  }\n\n  return (\n    <div>\n      <p>Welcome, {user.name}!</p>\n      <button onClick={logout}>Sign Out</button>\n    </div>\n  );\n}`}
                    language="tsx"
                  />
                </div>
              </div>
            </article>
          )}

          {/* AUTHENTICATION */}
          {activeSection === "authentication" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Authentication Flows</h1>
              <p className="text-lg text-muted-foreground">
                AuthSphere manages the complexity of OAuth 2.0 and OIDC protocols.
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Social Login</h2>
                <p className="text-muted-foreground">
                  Triggering a login redirects the user to the provider's consent screen. After approval,
                  they are returned to your <code>redirectUri</code> with a session established.
                </p>
                <CodeBlock
                  id="auth-flow"
                  code={`// Basic Login\nawait AuthSphere.loginWith('google');\n\n// Login with specific scopes\nawait AuthSphere.loginWith('github', {\n  scopes: ['repo', 'user:email']\n});`}
                  language="javascript"
                />
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <strong>Note:</strong> Make sure "Google" or "GitHub" is enabled in your <Link to={`/projects/${projectId}/settings`} className="underline hover:text-foreground">Project Providers</Link> settings.
                </div>
              </section>
            </article>
          )}

          {/* CONFIGURATION */}
          {activeSection === "configuration" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Configuration & Sessions</h1>
              <p className="text-lg text-muted-foreground">
                Control how sessions behave and persist across your user's journey.
              </p>

              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Token Lifecycle</h2>
                  <p className="text-muted-foreground mb-4">
                    AuthSphere uses a dual-token architecture (Access + Refresh) for maximum security and user experience.
                    You can configure these lifetimes in your dashboard.
                  </p>
                  <ul className="grid gap-4 md:grid-cols-2">
                    <li className="p-4 border rounded-xl bg-card">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-amber-500" /> Access Token
                      </h4>
                      <p className="text-sm text-muted-foreground">Short-lived (Default: 15 min). Used to authorize API requests. Rotated frequently to limit exposure.</p>
                    </li>
                    <li className="p-4 border rounded-xl bg-card">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <RefreshCcw className="h-4 w-4 text-blue-500" /> Refresh Token
                      </h4>
                      <p className="text-sm text-muted-foreground">Long-lived (Default: 7 days). Securely stored and used to silently obtain new access tokens.</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Manual Refresh</h2>
                  <p className="text-muted-foreground mb-4">
                    The SDK typically handles refreshing automatically, but you can force a refresh if needed (e.g., after changing user permissions).
                  </p>
                  <CodeBlock
                    id="refresh"
                    code={`const { accessToken } = await AuthSphere.refreshToken();`}
                    language="javascript"
                  />
                </div>
              </section>
            </article>
          )}


          {/* ERROR HANDLING */}
          {activeSection === "errors" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Error Handling</h1>
              <p className="text-lg text-muted-foreground">
                Robust error codes to help you build resilient UI experiences.
              </p>

              <div className="border rounded-xl divide-y overflow-hidden shadow-sm bg-card">
                <div className="grid grid-cols-3 p-4 bg-muted/50 font-medium text-sm">
                  <div className="col-span-1">Error Code</div>
                  <div className="col-span-2">Description & Resolution</div>
                </div>
                {[
                  { code: "AUTH_CANCELLED", desc: "User closed the popup or cancelled the provider consent." },
                  { code: "PROVIDER_DISABLED", desc: `The requested provider is not enabled in Project ID: ${projectId}. Enable it in the dashboard.` },
                  { code: "DOMAIN_NOT_ALLOWED", desc: "Request origin does not match the 'Allowed Origins' list in settings." },
                  { code: "INVALID_GRANT", desc: "Refresh token is invalid or expired. Prompt user to login again." },
                  { code: "RATE_LIMITED", desc: "Too many authentication attempts. Default limit is 60 req/min." }
                ].map((err, i) => (
                  <div key={i} className="grid grid-cols-3 p-4 text-sm group hover:bg-muted/30 transition-colors">
                    <div className="col-span-1 font-mono text-destructive font-semibold">{err.code}</div>
                    <div className="col-span-2 text-muted-foreground">{err.desc}</div>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Security Posture</h1>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Production Ready
                </h3>
                <p className="text-emerald-700/80 dark:text-emerald-300/80">
                  AuthSphere is built on industry-standard protocols including OAuth 2.0 and OIDC. We enforce
                  strict security headers, utilize httpOnly cookies where possible, and encrypt sensitive data at rest.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">MFA Support (Beta)</h4>
                  <p className="text-sm text-muted-foreground">
                    You can enable Multi-Factor Authentication in the "Security Policies" section. This enforces
                    an additional verification step for all users.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Email Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Toggle "Require Email Verification" in settings to prevent unverified users from accessing your application.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* NAVIGATION FOOTER */}
          <div className="mt-20 pt-10 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSection ? (
              <button
                onClick={() => navigateTo(prevSection.id)}
                className="flex flex-col items-start p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left group"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Previous
                </span>
                <span className="font-bold text-lg">{prevSection.title}</span>
              </button>
            ) : <div />}

            {nextSection && (
              <button
                onClick={() => navigateTo(nextSection.id)}
                className="flex flex-col items-end p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all text-right group"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                  Next <ArrowLeft className="h-3.5 w-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-bold text-lg">{nextSection.title}</span>
              </button>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Docs;
