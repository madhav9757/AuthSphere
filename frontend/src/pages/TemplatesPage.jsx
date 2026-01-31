import React, { useState } from "react";
import { Copy, Check, LayoutTemplate, ShieldCheck, Github, Smartphone, FileCode2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Template Imports
import { MinimalistLogin } from "@/components/templates/MinimalistLogin";
import { SplitScreenLogin } from "@/components/templates/SplitScreenLogin";
import { GlassmorphismCard } from "@/components/templates/GlassmorphismCard";
import { DeveloperLogin } from "@/components/templates/DeveloperLogin";

// --- TEMPLATE DATA with Full Source Code ---
const templates = [
    {
        id: "minimal",
        title: "Minimalist SaaS",
        description: "A clean, high-conversion login form centered on a light background. Features social auth buttons and semantic form fields. Ideal for SaaS dashboards and modern web apps.",
        tags: ["Clean", "Centered", "Social Auth"],
        icon: LayoutTemplate,
        component: MinimalistLogin,
        code: `import React from "react";
import { Mail, Lock, Github, Chrome, ArrowRight } from "lucide-react";

export const MinimalistLogin = () => {
    return (
        <div className="min-h-[600px] w-full flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center space-y-2">
                    <div className="h-10 w-10 bg-black rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-sm text-gray-500">
                        Enter your email to sign in to your account
                    </p>
                </div>
                {/* Form fields... see full source */}
            </div>
        </div>
    );
};`
    },
    {
        id: "split",
        title: "Split Screen Brand",
        description: "A split-view layout reserved for enterprise applications. showcases branding, testimonials, and value propositions on one side while keeping the authentication form focused on the other.",
        tags: ["Enterprise", "Split View", "Testimonial"],
        icon: Smartphone,
        component: SplitScreenLogin,
        code: `import React from "react";
import { Command, Shield } from "lucide-react";

export const SplitScreenLogin = () => {
  return (
    <div className="w-full h-[600px] lg:grid lg:grid-cols-2 rounded-xl overflow-hidden shadow-2xl bg-white text-zinc-950 font-sans">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
         {/* Branding Content */}
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
          {/* Login Form */}
      </div>
    </div>
  );
};`
    },
    {
        id: "card",
        title: "Glassmorphism Card",
        description: "Trendy, modern UI using backdrop-blur effects to create a frosted glass look. Perfect for Web3, creative portfolios, and design-forward applications.",
        tags: ["Web3", "Glassmorphism", "Creative"],
        icon: ShieldCheck,
        component: GlassmorphismCard,
        code: `import React from "react";
import { User, Key } from "lucide-react";

export const GlassmorphismCard = () => {
  return (
    <div className="min-h-[600px] w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative font-sans">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="relative w-full max-w-sm p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
         {/* Form Content */}
      </div>
    </div>
  );
};`
    },
    {
        id: "github",
        title: "Developer Terminal",
        description: "A dark-themed, monospace design inspired by CLI terminals. Features blinking cursors and syntax highlighting colors. Great for developer tools and technical products.",
        tags: ["Dark Mode", "Monospace", "Developer"],
        icon: Github,
        component: DeveloperLogin,
        code: `import React, { useState, useEffect } from "react";
import { Terminal, ChevronRight } from "lucide-react";

export const DeveloperLogin = () => {
  return (
    <div className="min-h-[600px] w-full flex items-center justify-center bg-zinc-950 p-4 font-mono text-green-500">
      <div className="w-full max-w-lg border border-green-500/30 rounded bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)] p-6">
        {/* Terminal Interface */}
      </div>
    </div>
  );
};`
    },
];

const TemplatesPage = () => {
    const [activeTab, setActiveTab] = useState(templates[0].id);
    const [copied, setCopied] = useState(false);

    const activeTemplate = templates.find((t) => t.id === activeTab) || templates[0];

    const handleCopyCode = () => {
        navigator.clipboard.writeText(activeTemplate.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen space-y-12">

            {/* Header */}
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight">Authentication Templates</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Beautifully designed, ready-to-use authentication components. Copy and paste into your apps.
                </p>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col space-y-8">

                {/* Tab Navigation / Slider */}
                <div className="flex items-center overflow-x-auto pb-4 gap-2 no-scrollbar border-b">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => setActiveTab(template.id)}
                            className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === template.id
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }
                `}
                        >
                            <template.icon className="h-4 w-4" />
                            {template.title}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Preview Canvas (Span 2) */}
                    <div className="lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeTemplate.id}>
                        <div className="rounded-xl border bg-background shadow-sm overflow-hidden relative group">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="backdrop-blur-md bg-background/50">
                                    Live Preview
                                </Badge>
                            </div>
                            {/* Render Live Component */}
                            <activeTemplate.component />
                        </div>
                    </div>

                    {/* Right: Details & Code */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{activeTemplate.title}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {activeTemplate.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {activeTemplate.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs">{tag}</Badge>
                            ))}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <FileCode2 className="h-4 w-4 text-primary" />
                                    Source Code
                                </h3>
                                <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-8 text-xs">
                                    {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                                    {copied ? "Copied" : "Copy Code"}
                                </Button>
                            </div>

                            <div className="relative rounded-lg bg-zinc-950 border border-zinc-800 shadow-inner overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-3 gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                </div>
                                <pre className="p-4 pt-10 text-[10px] md:text-xs font-mono text-zinc-400 overflow-x-auto max-h-[400px]">
                                    <code>{activeTemplate.code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default TemplatesPage;
