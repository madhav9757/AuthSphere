import React, { useState } from "react";
import {
    Copy, Check, Eye, Code2, Search,
    LayoutTemplate,
    Smartphone,
    ShieldCheck,
    Github,
    Sparkles,
    Phone,
    Tablet,
    Monitor
} from "lucide-react";

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        description: "A split-view layout reserved for enterprise applications. Showcases branding, testimonials, and value propositions on one side while keeping the authentication form focused on the other.",
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
    const [viewMode, setViewMode] = useState("preview");
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const activeTemplate = templates.find((t) => t.id === activeTab) || templates[0];
    const filteredTemplates = templates.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCopyCode = () => {
        navigator.clipboard.writeText(activeTemplate.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen w-full">
            {/* TOP HEADER */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">Templates</h1>
                    <div className="relative w-64 hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                            placeholder="Search templates..."
                        />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR NAV --- */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Authentication</h3>
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">New</Badge>
                                </div>

                                {/* Search for mobile sidebar */}
                                <div className="relative mb-4 lg:hidden">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9"
                                        placeholder="Filter templates..."
                                    />
                                </div>

                                <nav className="space-y-1">
                                    {filteredTemplates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setActiveTab(template.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group text-sm ${activeTab === template.id
                                                ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <span>{template.title}</span>
                                            {activeTab === template.id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgb(99,102,241)]" />
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-zinc-900/0">
                                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3" />
                                    Pro Tip
                                </p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                    Press 'Code' view to copy the full component implementation. All styles are Tailwind CSS.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* --- CONTENT AREA --- */}
                    <div className="flex-1 min-w-0">

                        {/* Header Section */}
                        <div className="mb-8 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{activeTemplate.title}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed">{activeTemplate.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Tabs value={viewMode} onValueChange={setViewMode} className="w-[180px]">
                                        <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-slate-100 dark:bg-zinc-900">
                                            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                                            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {activeTemplate.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground border-slate-200 dark:border-zinc-800">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Canvas Window */}
                        <div className="group relative rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden min-h-[600px] flex flex-col">

                            {/* Window Toolbar */}
                            <div className="h-10 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between px-4">
                                <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                                </div>

                                {/* Viewport Resizer (Visual Only) */}
                                {viewMode === "preview" && (
                                    <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-zinc-800 rounded-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm hover:bg-white dark:hover:bg-zinc-700">
                                            <Monitor className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm hover:bg-white dark:hover:bg-zinc-700">
                                            <Tablet className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm hover:bg-white dark:hover:bg-zinc-700">
                                            <Phone className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}

                                {viewMode === "code" && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleCopyCode}
                                        className="h-6 text-[10px] gap-1.5 hover:bg-white dark:hover:bg-zinc-800"
                                    >
                                        {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                        {copied ? "Copied" : "Copy Source"}
                                    </Button>
                                )}
                            </div>

                            {/* Viewport Body */}
                            <div className="flex-1 relative bg-slate-100/50 dark:bg-zinc-950/50">
                                {/* Grid background pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                                {viewMode === "preview" ? (
                                    <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex items-center justify-center relative z-10 animate-in fade-in duration-300">
                                        <div className="w-full max-w-4xl shadow-2xl shadow-slate-200 dark:shadow-black/50 rounded-lg overflow-hidden ring-1 ring-slate-900/5">
                                            <activeTemplate.component />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full w-full relative z-10 animate-in fade-in duration-300">
                                        <ScrollArea className="h-[600px] w-full">
                                            <div className="p-6">
                                                <pre className="text-sm font-mono leading-relaxed text-slate-700 dark:text-slate-300">
                                                    <code>{activeTemplate.code}</code>
                                                </pre>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
};

export default TemplatesPage;