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
        description: "A clean, high-conversion login form centered on a light background. Features social auth buttons and semantic form fields. Ideal for SaaS dashboards and modern web apps.",
        tags: ["Clean", "Centered", "Social Auth"],
        icon: LayoutTemplate,
        component: MinimalistLogin,
        code: MinimalistLoginRaw
    },
    {
        id: "split",
        title: "Split Screen Brand",
        description: "A split-view layout reserved for enterprise applications. Showcases branding, testimonials, and value propositions on one side while keeping the authentication form focused on the other.",
        tags: ["Enterprise", "Split View", "Testimonial"],
        icon: Smartphone,
        component: SplitScreenLogin,
        code: SplitScreenLoginRaw
    },
    {
        id: "card",
        title: "Glassmorphism Card",
        description: "Trendy, modern UI using backdrop-blur effects to create a frosted glass look. Perfect for Web3, creative portfolios, and design-forward applications.",
        tags: ["Web3", "Glassmorphism", "Creative"],
        icon: ShieldCheck,
        component: GlassmorphismCard,
        code: GlassmorphismCardRaw
    },
    {
        id: "github",
        title: "Developer Terminal",
        description: "A dark-themed, monospace design inspired by CLI terminals. Features blinking cursors and syntax highlighting colors. Great for developer tools and technical products.",
        tags: ["Dark Mode", "Monospace", "Developer"],
        icon: Github,
        component: DeveloperLogin,
        code: DeveloperLoginRaw
    },
    {
        id: "modern-signup",
        title: "Modern Gradient Signup",
        description: "Beautiful gradient-based signup form with password strength indicator, social authentication, and smooth animations. Perfect for modern SaaS applications.",
        tags: ["Gradient", "Password Strength", "Social Auth"],
        icon: Sparkles,
        component: ModernSignup,
        code: ModernSignupRaw
    },
    {
        id: "stepper-signup",
        title: "Multi-Step Signup",
        description: "Progressive signup flow with visual stepper, organized into Personal Info, Company Details, and Security steps. Ideal for collecting detailed user information.",
        tags: ["Multi-Step", "Progressive", "Enterprise"],
        icon: LayoutTemplate,
        component: StepperSignup,
        code: StepperSignupRaw
    },
    {
        id: "neubrutalism-signup",
        title: "Neubrutalism Signup",
        description: "Bold, eye-catching design with thick borders, vibrant colors, and strong shadows. Perfect for creative agencies and design-forward startups.",
        tags: ["Bold", "Creative", "Unique"],
        icon: Sparkles,
        component: NeubrutalismSignup,
        code: NeubrutalismSignupRaw
    },
    {
        id: "animated-signup",
        title: "Animated Split Signup",
        description: "Highly animated signup with floating background elements, split-screen layout showcasing features, and interactive field states. Premium feel for high-end products.",
        tags: ["Animated", "Premium", "Split Screen"],
        icon: Sparkles,
        component: AnimatedSignup,
        code: AnimatedSignupRaw
    },
    {
        id: "minimal-dark-signup",
        title: "Minimal Dark Signup",
        description: "Ultra-minimal dark mode signup with clean typography, subtle borders, and elegant spacing. Perfect for developer tools and sophisticated applications.",
        tags: ["Dark Mode", "Minimal", "Elegant"],
        icon: Github,
        component: MinimalDarkSignup,
        code: MinimalDarkSignupRaw
    }
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
                            <div className="space-y-6">
                                {/* Search for mobile sidebar */}
                                <div className="relative lg:hidden">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9"
                                        placeholder="Filter templates..."
                                    />
                                </div>

                                {/* Login Templates */}
                                <div>
                                    <div className="flex items-center justify-between mb-3 px-2">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Login Pages</h3>
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">4</Badge>
                                    </div>
                                    <nav className="space-y-1">
                                        {filteredTemplates.filter(t => !t.id.includes('signup')).map((template) => (
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

                                {/* Signup Templates */}
                                <div>
                                    <div className="flex items-center justify-between mb-3 px-2">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Signup Pages</h3>
                                        <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-indigo-500">New</Badge>
                                    </div>
                                    <nav className="space-y-1">
                                        {filteredTemplates.filter(t => t.id.includes('signup')).map((template) => (
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
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

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