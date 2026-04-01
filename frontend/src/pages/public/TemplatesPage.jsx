import React, { useState } from "react";
import {
  Copy,
  Check,
  Search,
  LayoutTemplate,
  Smartphone,
  ShieldCheck,
  Github,
  Sparkles,
  ChevronRight,
  Terminal,
  Eye,
  Code2,
  Menu,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

// Raw Source Code Imports
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
      "Clean, high-conversion login form centered on a light background. Features social auth buttons and semantic form fields.",
    tags: ["Clean", "Centered", "Social Auth"],
    icon: LayoutTemplate,
    component: MinimalistLogin,
    code: MinimalistLoginRaw,
    category: "login",
  },
  {
    id: "split",
    title: "Split Screen Brand",
    description:
      "Split-view layout for enterprise apps. Showcases branding and value propositions alongside the auth form.",
    tags: ["Enterprise", "Split View", "Testimonial"],
    icon: Smartphone,
    component: SplitScreenLogin,
    code: SplitScreenLoginRaw,
    category: "login",
  },
  {
    id: "card",
    title: "Glassmorphism Card",
    description:
      "Backdrop-blur frosted glass aesthetic. Perfect for Web3, creative portfolios, and design-forward apps.",
    tags: ["Web3", "Glassmorphism", "Creative"],
    icon: ShieldCheck,
    component: GlassmorphismCard,
    code: GlassmorphismCardRaw,
    category: "login",
  },
  {
    id: "github",
    title: "Developer Terminal",
    description:
      "Dark-themed monospace design inspired by CLI terminals. Great for developer tools and technical products.",
    tags: ["Dark Mode", "Monospace", "Developer"],
    icon: Github,
    component: DeveloperLogin,
    code: DeveloperLoginRaw,
    category: "login",
  },
  {
    id: "modern-signup",
    title: "Modern Gradient",
    description:
      "Gradient-based signup with password strength indicator, social auth, and smooth animations.",
    tags: ["Gradient", "Password Strength", "Social Auth"],
    icon: Sparkles,
    component: ModernSignup,
    code: ModernSignupRaw,
    category: "signup",
  },
  {
    id: "stepper-signup",
    title: "Multi-Step",
    description:
      "Progressive signup flow organized into Personal Info, Company Details, and Security steps.",
    tags: ["Multi-Step", "Progressive", "Enterprise"],
    icon: LayoutTemplate,
    component: StepperSignup,
    code: StepperSignupRaw,
    category: "signup",
  },
  {
    id: "neubrutalism-signup",
    title: "Neubrutalism",
    description:
      "Bold thick borders, vibrant colors, and strong shadows for creative agencies and startups.",
    tags: ["Bold", "Creative", "Unique"],
    icon: Sparkles,
    component: NeubrutalismSignup,
    code: NeubrutalismSignupRaw,
    category: "signup",
  },
  {
    id: "animated-signup",
    title: "Animated Split",
    description:
      "Highly animated with floating elements and split-screen feature showcase. Premium feel.",
    tags: ["Animated", "Premium", "Split Screen"],
    icon: Sparkles,
    component: AnimatedSignup,
    code: AnimatedSignupRaw,
    category: "signup",
  },
  {
    id: "minimal-dark-signup",
    title: "Minimal Dark",
    description:
      "Ultra-minimal dark mode with clean typography, subtle borders, and elegant spacing.",
    tags: ["Dark Mode", "Minimal", "Elegant"],
    icon: Github,
    component: MinimalDarkSignup,
    code: MinimalDarkSignupRaw,
    category: "signup",
  },
];

const TemplatesPage = () => {
  const [activeTab, setActiveTab] = useState(templates[0].id);
  const [viewMode, setViewMode] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTemplate =
    templates.find((t) => t.id === activeTab) || templates[0];
  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const loginTemplates = filteredTemplates.filter(
    (t) => t.category === "login",
  );
  const signupTemplates = filteredTemplates.filter(
    (t) => t.category === "signup",
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderNavItem = (template) => {
    const isActive = activeTab === template.id;
    return (
      <button
        key={template.id}
        onClick={() => {
          setActiveTab(template.id);
          setIsMobileMenuOpen(false);
        }}
        className={cn(
          "group w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-150 flex items-center justify-between",
          isActive
            ? "bg-foreground text-background font-medium shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
        )}
      >
        <span className="truncate">{template.title}</span>
        {isActive && <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />}
      </button>
    );
  };

  const renderSectionLabel = (label) => (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3 mt-1">
      {label}
    </p>
  );

  const renderSidebarContent = () => (
    <div className="px-1 py-4 space-y-4">
      {loginTemplates.length > 0 && (
        <div>
          {renderSectionLabel("Login Views")}
          <div className="space-y-0.5">
            {loginTemplates.map((t) => renderNavItem(t))}
          </div>
        </div>
      )}

      {loginTemplates.length > 0 && signupTemplates.length > 0 && (
        <Separator className="mx-2 opacity-40" />
      )}

      {signupTemplates.length > 0 && (
        <div>
          {renderSectionLabel("Signup Views")}
          <div className="space-y-0.5">
            {signupTemplates.map((t) => renderNavItem(t))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[92vh] w-full flex flex-col bg-background overflow-hidden text-foreground">
      {/* Header */}
      <header className="shrink-0 h-14 md:h-12 border-b border-border/60 flex items-center justify-between px-4 md:px-5 bg-background/95 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 -ml-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80 p-4 h-fit mt-14">
              <SheetHeader className="mb-[-20px] text-left">
                <SheetTitle className="flex items-center text-lg">
                  AuthSphere Designs
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className=" h-full pr-4">
                {renderSidebarContent()}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold tracking-tight hidden sm:block">
              AuthSphere
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="h-4 mx-1 opacity-40 hidden md:block"
          />
          <span className="text-[11px] text-muted-foreground font-medium hidden lg:block">
            Explorer <span className="opacity-50">/</span> {templates.length}{" "}
            Designs
          </span>
        </div>

        <div className="relative w-full max-w-[160px] sm:max-w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-[12px] bg-muted/40 border-border/40 rounded-full focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/50"
            placeholder="Search templates..."
          />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar (Desktop only) */}
        <aside className="w-56 shrink-0 border-r border-border/60 bg-muted/5 hidden md:flex flex-col">
          <ScrollArea className="flex-1">
            <div className="px-2">
              {renderSidebarContent()}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-muted/20">
          {/* 1. TOP CONTROL BAR */}
          <div className="shrink-0 h-12 px-4 md:px-6 border-b border-border/50 bg-background flex items-center justify-between z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                {viewMode === "preview" ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Code2 className="h-4 w-4" />
                )}
                <span className="text-[12px] font-medium capitalize hidden xs:block">
                  {viewMode} Mode
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {viewMode === "code" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="h-8 text-[11px] px-2.5 sm:px-3 gap-2 rounded-md border-border/60 bg-background hover:bg-muted"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {copied ? "Copied" : "Copy Source"}
                  </span>
                  {!copied && <span className="sm:hidden">Copy</span>}
                </Button>
              )}
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="h-8 p-1 bg-muted/60 rounded-lg border border-border/40">
                  <TabsTrigger
                    value="preview"
                    className="text-[11px] h-6 px-3 sm:px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="text-[11px] h-6 px-3 sm:px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* 2. CENTRAL VIEWPORT */}
          <div className="flex-1 bg-muted/10 relative overflow-hidden">
            {viewMode === "preview" ? (
              <div className="absolute inset-0 bg-background flex items-center justify-center p-4">
                <div className="w-full h-full px-2 my-10 flex items-center justify-center bg-transparent">
                  <activeTemplate.component />
                </div>
              </div>
            ) : (
              // Polished Code Viewport
              <div className="absolute inset-0 flex p-2 md:p-4">
                <div className="flex-1 w-full rounded-xl bg-background shadow-xl overflow-hidden flex border border-border/40">
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full w-full">
                      <div className="p-4 md:p-6">
                        <pre className="text-[12px] md:text-[13px] leading-relaxed font-mono whitespace-pre text-[#c9d1d9]">
                          <code>{activeTemplate.code}</code>
                        </pre>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. BOTTOM INFORMATION FOOTER */}
          <footer className="shrink-0 h-auto min-h-20 px-4 md:px-8 border-t border-border/50 bg-background/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between py-3 gap-3 md:gap-6 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.05)] relative z-10 transition-all">
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[15px] md:text-[18px] font-bold text-foreground tracking-tight truncate">
                  {activeTemplate.title}
                </h2>
                <Badge
                  variant="secondary"
                  className="text-[9px] uppercase tracking-wider h-4 px-2 font-semibold bg-primary/10 text-primary border-transparent shrink-0"
                >
                  {activeTemplate.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[11px] md:text-[12px] text-muted-foreground line-clamp-1 md:line-clamp-none">
                  {activeTemplate.description}
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 flex-wrap md:justify-end items-center max-h-12 overflow-hidden">
              {activeTemplate.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] md:text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border/50 px-2.5 py-0.5 rounded-full transition-colors hover:text-foreground hover:bg-muted whitespace-nowrap"
                >
                  #{tag.toLowerCase().replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default TemplatesPage;
