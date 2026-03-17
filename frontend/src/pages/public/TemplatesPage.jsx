import React, { useState } from "react";
import {
  Copy,
  Check,
  Eye,
  Code2,
  Search,
  LayoutTemplate,
  Smartphone,
  ShieldCheck,
  Github,
  Sparkles,
  Phone,
  Tablet,
  Monitor,
} from "lucide-react";

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Template Imports - Login
import { MinimalistLogin } from "@/components/templates/MinimalistLogin";
import { SplitScreenLogin } from "@/components/templates/SplitScreenLogin";
import { GlassmorphismCard } from "@/components/templates/GlassmorphismCard";
import { DeveloperLogin } from "@/components/templates/DeveloperLogin";

// Template Imports - Signup
import { ModernSignup } from "@/components/templates/ModernSignup";
import { StepperSignup } from "@/components/templates/StepperSignup";
import { NeubrutalismSignup } from "@/components/templates/NeubrutalismSignup";
import { AnimatedSignup } from "@/components/templates/AnimatedSignup";
import { MinimalDarkSignup } from "@/components/templates/MinimalDarkSignup";

// Raw Source Code Imports (for code view)
import MinimalistLoginRaw from "@/components/templates/MinimalistLogin.jsx?raw";
import SplitScreenLoginRaw from "@/components/templates/SplitScreenLogin.jsx?raw";
import GlassmorphismCardRaw from "@/components/templates/GlassmorphismCard.jsx?raw";
import DeveloperLoginRaw from "@/components/templates/DeveloperLogin.jsx?raw";
import ModernSignupRaw from "@/components/templates/ModernSignup.jsx?raw";
import StepperSignupRaw from "@/components/templates/StepperSignup.jsx?raw";
import NeubrutalismSignupRaw from "@/components/templates/NeubrutalismSignup.jsx?raw";
import AnimatedSignupRaw from "@/components/templates/AnimatedSignup.jsx?raw";
import MinimalDarkSignupRaw from "@/components/templates/MinimalDarkSignup.jsx?raw";

const templates = [
  {
    id: "minimal",
    title: "Minimalist SaaS",
    description:
      "A clean, high-conversion login form centered on a light background. Features social auth buttons and semantic form fields. Ideal for SaaS dashboards and modern web apps.",
    tags: ["Clean", "Centered", "Social Auth"],
    icon: LayoutTemplate,
    component: MinimalistLogin,
    code: MinimalistLoginRaw,
  },
  {
    id: "split",
    title: "Split Screen Brand",
    description:
      "A split-view layout reserved for enterprise applications. Showcases branding, testimonials, and value propositions on one side while keeping the authentication form focused on the other.",
    tags: ["Enterprise", "Split View", "Testimonial"],
    icon: Smartphone,
    component: SplitScreenLogin,
    code: SplitScreenLoginRaw,
  },
  {
    id: "card",
    title: "Glassmorphism Card",
    description:
      "Trendy, modern UI using backdrop-blur effects to create a frosted glass look. Perfect for Web3, creative portfolios, and design-forward applications.",
    tags: ["Web3", "Glassmorphism", "Creative"],
    icon: ShieldCheck,
    component: GlassmorphismCard,
    code: GlassmorphismCardRaw,
  },
  {
    id: "github",
    title: "Developer Terminal",
    description:
      "A dark-themed, monospace design inspired by CLI terminals. Features blinking cursors and syntax highlighting colors. Great for developer tools and technical products.",
    tags: ["Dark Mode", "Monospace", "Developer"],
    icon: Github,
    component: DeveloperLogin,
    code: DeveloperLoginRaw,
  },
  {
    id: "modern-signup",
    title: "Modern Gradient Signup",
    description:
      "Beautiful gradient-based signup form with password strength indicator, social authentication, and smooth animations. Perfect for modern SaaS applications.",
    tags: ["Gradient", "Password Strength", "Social Auth"],
    icon: Sparkles,
    component: ModernSignup,
    code: ModernSignupRaw,
  },
  {
    id: "stepper-signup",
    title: "Multi-Step Signup",
    description:
      "Progressive signup flow with visual stepper, organized into Personal Info, Company Details, and Security steps. Ideal for collecting detailed user information.",
    tags: ["Multi-Step", "Progressive", "Enterprise"],
    icon: LayoutTemplate,
    component: StepperSignup,
    code: StepperSignupRaw,
  },
  {
    id: "neubrutalism-signup",
    title: "Neubrutalism Signup",
    description:
      "Bold, eye-catching design with thick borders, vibrant colors, and strong shadows. Perfect for creative agencies and design-forward startups.",
    tags: ["Bold", "Creative", "Unique"],
    icon: Sparkles,
    component: NeubrutalismSignup,
    code: NeubrutalismSignupRaw,
  },
  {
    id: "animated-signup",
    title: "Animated Split Signup",
    description:
      "Highly animated signup with floating background elements, split-screen layout showcasing features, and interactive field states. Premium feel for high-end products.",
    tags: ["Animated", "Premium", "Split Screen"],
    icon: Sparkles,
    component: AnimatedSignup,
    code: AnimatedSignupRaw,
  },
  {
    id: "minimal-dark-signup",
    title: "Minimal Dark Signup",
    description:
      "Ultra-minimal dark mode signup with clean typography, subtle borders, and elegant spacing. Perfect for developer tools and sophisticated applications.",
    tags: ["Dark Mode", "Minimal", "Elegant"],
    icon: Github,
    component: MinimalDarkSignup,
    code: MinimalDarkSignupRaw,
  },
];

const TemplatesPage = () => {
  const [activeTab, setActiveTab] = useState(templates[0].id);
  const [viewMode, setViewMode] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const activeTemplate =
    templates.find((t) => t.id === activeTab) || templates[0];
  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[95vh] w-[90vw] mx-auto flex flex-col">
      {/* Header */}
      <header className="shrink-0 h-14 border-b border-border flex items-center justify-between px-6 bg-background">
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          AuthSphere Templates
        </h1>
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-muted/40 border-border rounded-md"
            placeholder="Search templates..."
          />
        </div>
      </header>

      {/* Main area — fills remaining viewport height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-border p-5 overflow-y-auto bg-background">
          <div className="space-y-6">
            {/* Login */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                Login
              </p>
              <nav className="space-y-0.5">
                {filteredTemplates
                  .filter((t) => !t.id.includes("signup"))
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setActiveTab(template.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                        activeTab === template.id
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      {template.title}
                    </button>
                  ))}
              </nav>
            </div>

            {/* Signup */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                Signup
              </p>
              <nav className="space-y-0.5">
                {filteredTemplates
                  .filter((t) => t.id.includes("signup"))
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setActiveTab(template.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                        activeTab === template.id
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      {template.title}
                    </button>
                  ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Content — scrollable */}
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {/* Title row */}
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {activeTemplate.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {activeTemplate.description}
              </p>
              <div className="flex gap-1.5 mt-3">
                {activeTemplate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="h-8 p-0.5 bg-muted rounded-md">
                  <TabsTrigger
                    value="preview"
                    className="text-[11px] h-7 px-3 rounded-sm"
                  >
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="text-[11px] h-7 px-3 rounded-sm"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {viewMode === "code" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="h-8 text-[11px] gap-1.5 rounded-md"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          </div>

          {/* Preview / Code window */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Toolbar */}
            <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4">
              <div className="flex gap-10">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
            </div>

            {/* Body */}
            {viewMode === "preview" ? (
              <div className="p-8 flex items-center justify-center min-h-[800px] bg-muted/10">
                <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-sm border border-border">
                  <activeTemplate.component />
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[800px] w-full">
                <div className="p-6">
                  <pre className="text-xs font-mono leading-relaxed text-muted-foreground">
                    <code>{activeTemplate.code}</code>
                  </pre>
                </div>
              </ScrollArea>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TemplatesPage;
