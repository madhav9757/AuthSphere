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
  ChevronDown, Settings2, BarChart3, User, KeyRound,
  Users, Trash2, Mail
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
    { id: "local-auth", title: "Local Authentication", icon: User },
    { id: "authentication", title: "Social Login", icon: Globe },
    { id: "frameworks", title: "Framework Integration", icon: Layers },
    { id: "session-management", title: "Session Management", icon: KeyRound },
    { id: "configuration", title: "Configuration", icon: Settings2 },
    { id: "user-management", title: "User Management", icon: Users },
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
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
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
            <div className="mb-10 p-6 rounded-2xl border bg-linear-to-br from-background to-muted/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-500 shadow-sm">
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
                  { icon: Mail, title: "Email Verification", desc: "Enforce email checks before allowing login. Automatic OTP delivery and lifecycle." },
                  { icon: Lock, title: "Zero-Trust Security", desc: "Automated token rotation, PKCE flows, and brute-force protection out of the box." },
                  { icon: BarChart3, title: "Real-time Analytics", desc: "Track active users, login trends, and provider adoption in your dashboard." },
                  { icon: Settings2, title: "Developer Management", desc: "Manage end-users, toggle verification, and monitor sessions per project." }
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
                    code={`import { AuthSphere } from '@authspherejs/sdk'\n\n// Initialize inside your app entry point\nAuthSphere.initAuth({\n  publicKey: '${publicKey}',\n})`}
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

          {/* SESSION MANAGEMENT */}
          {activeSection === "session-management" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Session Management</h1>
                <p className="text-lg text-muted-foreground">
                  Manage user sessions, tokens, and profiles locally within your app.
                </p>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold mb-3">Check Authentication</h3>
                  <p className="text-muted-foreground mb-4">Check if a valid session exists on the client.</p>
                  <CodeBlock
                    id="is-authenticated"
                    code={`const isLoggedIn = AuthSphere.isAuthenticated();\n\nif (!isLoggedIn) {\n  navigate('/login');\n}`}
                    language="javascript"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Get User Profile</h3>
                  <p className="text-muted-foreground mb-4">Retrieve the currently logged-in user's details.</p>
                  <CodeBlock
                    id="get-user"
                    code={`const user = AuthSphere.getUser();\n\nconsole.log(user.email);\nconsole.log(user.username);\nconsole.log(user.picture);`}
                    language="javascript"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Logout</h3>
                  <p className="text-muted-foreground mb-4">Clear all local session data and tokens.</p>
                  <CodeBlock
                    id="logout"
                    code={`AuthSphere.logout();\nwindow.location.href = '/login';`}
                    language="javascript"
                  />
                </div>
              </div>
            </article>
          )}

          {/* LOCAL AUTHENTICATION */}
          {activeSection === "local-auth" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Local Authentication</h1>
                <p className="text-lg text-muted-foreground">
                  Secure email/password authentication with built-in OTP verification.
                </p>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold mb-3">User Registration</h3>
                  <p className="text-muted-foreground mb-4">Register new users with their email, password, and optional profile data.</p>
                  <CodeBlock
                    id="register"
                    code={`await AuthSphere.register({\n  email: 'user@example.com',\n  password: 'securePassword123',\n  username: 'John Doe'\n});`}
                    language="javascript"
                  />
                  <div className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0" />
                    <p>After registration, an OTP is automatically sent to the user's email for verification.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Login Flow</h3>
                  <p className="text-muted-foreground mb-4">Authenticate users locally. If their email isn't verified, the SDK will return a specific error allowing you to redirect them to the verification page.</p>
                  <CodeBlock
                    id="login-local"
                    code={`try {\n  await AuthSphere.loginLocal({\n    email: 'user@example.com',\n    password: 'securePassword123'\n  });\n} catch (err) {\n  if (err.error_code === 'EMAIL_NOT_VERIFIED') {\n    // Redirect to OTP entry page with the sdk_request ID\n    const sdkRequest = err.sdk_request;\n    navigate(\`/verify-otp?email=\${email}&sdk_request=\${sdkRequest}\`);\n  }\n}`}
                    language="javascript"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">OTP Verification</h3>
                  <p className="text-muted-foreground mb-4">Verify the user's email address using the 6-digit code sent to them.</p>
                  <CodeBlock
                    id="verify-otp"
                    code={`await AuthSphere.verifyOTP({\n  email: 'user@example.com',\n  otp: '123456',\n  sdk_request: 'REQ_ID' // Optional: for auto-login after verification\n});`}
                    language="javascript"
                  />
                </div>
              </div>
            </article>
          )}

          {/* SOCIAL LOGIN */}
          {activeSection === "authentication" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">Social Login</h1>
              <p className="text-lg text-muted-foreground">
                AuthSphere manages the complexity of OAuth 2.0 and OIDC protocols for third-party providers.
              </p>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">One-Click Authentication</h2>
                <p className="text-muted-foreground">
                  Triggering a login redirects the user to the provider's consent screen. After approval,
                  they are returned to your <code>redirectUri</code> with a session established.
                </p>
                <CodeBlock
                  id="auth-flow"
                  code={`// Basic Social Login (google, github, discord, microsoft)\nAuthSphere.redirectToLogin('google');`}
                  language="javascript"
                />
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <strong>Note:</strong> Social logins automatically verify the user's email if the provider confirms it.
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


          {/* USER MANAGEMENT */}
          {activeSection === "user-management" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
                <p className="text-lg text-muted-foreground">
                  Administrative control over your project's user base.
                </p>
              </div>

              <section className="space-y-6">
                <div className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Dashboard Controls
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Navigate to your project in the AuthSphere dashboard and click <strong>"Manage All Users"</strong>.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span><strong>Verification Override:</strong> Manually verify or unverify users regardless of their OTP status.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </div>
                      <span><strong>Permanent Deletion:</strong> Hard delete users from your project database to comply with GDPR/deletion requests.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Management API</h2>
                  <p className="text-muted-foreground mb-4">
                    Programmatically manage users using your <strong>Private Key</strong>.
                    <Badge variant="secondary" className="ml-2">Experimental</Badge>
                  </p>
                  <CodeBlock
                    id="mgmt-api"
                    code={`// Delete User\nfetch('http://localhost:8000/api/v1/projects/${projectId}/users/USER_ID', {\n  method: 'DELETE',\n  headers: { 'Authorization': 'Bearer YOUR_DEV_TOKEN' }\n});\n\n// Toggle Verification\nfetch('http://localhost:8000/api/v1/projects/${projectId}/users/USER_ID/verify', {\n  method: 'PATCH',\n  headers: { 'Authorization': 'Bearer YOUR_DEV_TOKEN' }\n});`}
                    language="javascript"
                  />
                </div>
              </section>
            </article>
          )}

          {/* API REFERENCE */}
          {activeSection === "api-reference" && (
            <article className="space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to build custom authentication experiences.
              </p>

              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-primary" />
                    Core initialization
                  </h2>
                  <p className="text-muted-foreground mb-4">Initialize the SDK once at the root of your application.</p>
                  <CodeBlock
                    id="ref-init"
                    code={`AuthSphere.initAuth({\n  publicKey: string,\n  redirectUri?: string,\n  baseUrl?: string,\n})`}
                    language="typescript"
                  />
                </section>

                <section>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Methods
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-mono text-primary font-bold">redirectToLogin(provider: string)</h4>
                      <p className="text-sm text-muted-foreground mt-1">Redirects the user to a social provider's login page.</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-primary font-bold">loginLocal(credentials)</h4>
                      <p className="text-sm text-muted-foreground mt-1">Authenticates with email/password. Returns access token or verification requirement.</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-primary font-bold">handleAuthCallback()</h4>
                      <p className="text-sm text-muted-foreground mt-1">Processes the authorization code from the URL and establishes a session.</p>
                    </div>
                  </div>
                </section>
              </div>
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
                  { code: "EMAIL_NOT_VERIFIED", desc: "User is not verified. Redirect to /verify-otp with the provided sdk_request identifier." },
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

              <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
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
