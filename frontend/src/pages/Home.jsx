import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList
} from "@/components/ui/command";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Icons
import {
  ArrowRight, ShieldCheck, Zap, Code2, Lock, Users, Sparkles, CheckCircle2,
  Github, Chrome, MessageCircle, Terminal, Globe, Fingerprint, ChevronRight,
  Monitor, Search, Command, Book, Activity, LifeBuoy, Star, Cpu
} from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-blue-600/10 selection:text-blue-600">

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-1000">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[140px] animate-pulse delay-700" />
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 pointer-events-none dark:invert"></div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="flex flex-col items-center gap-6 group">
            {/* MAIN LOGO */}
            <img
              src="/assets/logo-full.png"
              alt="AuthSphere Logo"
              className="h-64 w-64 object-contain transition-all duration-700 group-hover:scale-105
               /* Light Theme */
               mix-blend-multiply
               /* Dark Theme */
               dark:mix-blend-normal dark:invert dark:brightness-150 dark:contrast-125
               /* Effects */
               filter dark:drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            />

            {/* TRUST BADGE */}
            <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full 
                  bg-blue-500/5 dark:bg-blue-400/10 
                  border border-blue-500/10 dark:border-blue-400/20 
                  backdrop-blur-xl hover:bg-blue-500/10 dark:hover:bg-blue-400/20 
                  transition-all duration-300 group/badge 
                  animate-in fade-in slide-in-from-bottom-2">

              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 group-hover/badge:scale-125 transition-transform duration-300" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
                Trusted by 2,000+ developers globally
              </span>

              <div className="h-3 w-[1px] bg-blue-500/20 dark:bg-blue-400/30" /> {/* Simple Separator fallback */}

              <ChevronRight className="h-3 w-3 text-blue-500 dark:text-blue-400 group-hover/badge:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <h1 className="text-7xl lg:text-[120px] font-black tracking-tighter mb-10 leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 italic">
            Identity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Evolved.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The next generation of authentication. Secure your infrastructure with
            decentralized identity shards and sub-50ms global latency.
          </p>

          <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-black uppercase tracking-[0.1em] bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-600/20 active:scale-95 transition-all" asChild>
              <Link to="/register">Provision Shard <ArrowRight className="ml-3 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-black uppercase tracking-[0.1em] bg-background/50 dark:bg-slate-900/50 backdrop-blur-md border-border hover:bg-muted transition-all active:scale-95" asChild>
              <Link to="/docs">Read Documentation</Link>
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 animate-in fade-in duration-1000 delay-500">
            <Cpu className="h-3.5 w-3.5" />
            <span>Encrypted with AES-256-GCM / SHA-512</span>
          </div>
        </div>
      </section>

      {/* 3. PROOF SECTION */}
      <div className="container mx-auto px-6 py-12 border-y border-border/50 bg-muted/20">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          <ComplianceBadge label="SOC 2 TYPE II" description="Independently audited for security, availability, and confidentiality." />
          <ComplianceBadge label="GDPR ENFORCED" description="Data processing agreements that meet European privacy standards." />
          <ComplianceBadge label="HIPAA COMPLIANT" description="Built-in controls for handling protected health information." />
        </div>
      </div>

      {/* 4. FEATURES GRID */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 text-foreground">
              Engineered for <span className="italic">Scale.</span>
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <Card key={i} className="group border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5">
                <CardHeader className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <f.icon size={28} />
                  </div>
                  <CardTitle className="text-2xl font-black text-foreground italic">{f.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground font-medium pt-2">{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CODE SHOWCASE */}
      <section className="py-32 lg:py-40 bg-foreground text-background overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none italic">Built for the <br /><span className="text-blue-500">TS Era.</span></h2>
            <p className="text-muted-foreground text-xl leading-relaxed font-medium">
              Headless by choice. Our SDKs provide the core infrastructure, leaving you with total creative freedom over your UI.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <CodeFeature icon={Terminal} text="CLI Sync Tools" />
              <CodeFeature icon={ShieldCheck} text="JWT Hardware Verification" />
              <CodeFeature icon={Activity} text="Real-time Telemetry" />
              <CodeFeature icon={Lock} text="Secrets Isolation" />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-background rounded-[2rem] border border-border p-3 shadow-2xl overflow-hidden">
              <div className="bg-slate-950 rounded-[1.5rem] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">auth-init.ts</span>
                </div>
                <pre className="p-8 text-[15px] font-mono leading-relaxed text-indigo-300 overflow-x-auto">
                  <code>{`import { createClient } from "@authsphere/sdk";

// Initialize secure identity shard
const auth = createClient({
  publicKey: "shard_9afk...",
  region: "eu-central"
});

// Protect routes instantly
export const { User, Auth } = auth;`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ (ACCORDION) */}
      <section className="py-32 container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 text-foreground italic">Questions?</h2>
          <p className="text-muted-foreground font-medium text-lg">Everything you need to know about the platform.</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-muted/30 border border-border px-8 rounded-3xl">
            <AccordionTrigger className="text-lg font-black italic hover:no-underline py-6">How is this different from legacy auth?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 transition-all font-medium">
              AuthSphere uses decentralized identity shards, meaning user data is partitioned at the hardware level. We prioritize sub-50ms latency and a headless DX that legacy providers simply can't match.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="bg-muted/30 border border-border px-8 rounded-3xl">
            <AccordionTrigger className="text-lg font-black italic hover:no-underline py-6">Can I host data in specific regions?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 transition-all font-medium">
              Absolutely. During project provisioning, you can select from our global clusters including US-East (N. Virginia), EU-Central (Frankfurt), and Asia-Pacific (Tokyo) for regulatory compliance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-background border-t border-border py-20 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center">
              <img
                src="/assets/logo-full.png"
                alt="AuthSphere Logo"
                className="h-16 w-auto object-contain 
             /* Light Mode: Cleans up white backgrounds */
             mix-blend-multiply 
             /* Dark Mode: Flips colors if it's a black icon, or boosts visibility */
             dark:mix-blend-normal dark:invert dark:brightness-150
             /* Smooth transition for theme switching */
             transition-all duration-300"
              />
            </div>
            <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
              The identity infrastructure for the modern web. Built by developers, for developers.
              Zero friction, infinite scale.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Resources</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-blue-600 transition-colors">Documentation</Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">SDK Reference</Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">System Status</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-blue-600 transition-colors">Twitter</Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">GitHub</Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">Discord</Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">© 2026 AUTH-SPHERE GRID INC.</p>
          <div className="flex items-center gap-6">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Clusters Operational</span>
          </div>
        </div>
      </footer>

      {/* COMMAND PALETTE DIALOG */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search documentation..." className="font-bold py-6" />
        <CommandList className="max-h-[400px] overflow-y-auto p-4">
          <CommandEmpty className="py-12 text-center text-muted-foreground font-medium">No results found.</CommandEmpty>
          <CommandGroup heading="Core Shards" className="px-2">
            <CommandItem className="cursor-pointer rounded-xl p-3 mb-2 hover:bg-muted transition-all">
              <Book className="mr-3 h-5 w-5 text-blue-500" />
              <div className="flex flex-col">
                <span className="font-bold">Quickstart Guide</span>
                <span className="text-[10px] text-muted-foreground">Get up and running in minutes</span>
              </div>
            </CommandItem>
            <CommandItem className="cursor-pointer rounded-xl p-3 mb-2 hover:bg-muted transition-all">
              <Code2 className="mr-3 h-5 w-5 text-indigo-500" />
              <div className="flex flex-col">
                <span className="font-bold">Next.js Integration</span>
                <span className="text-[10px] text-muted-foreground">Server-side authentication patterns</span>
              </div>
            </CommandItem>
            <CommandItem className="cursor-pointer rounded-xl p-3 mb-2 hover:bg-muted transition-all">
              <LifeBuoy className="mr-3 h-5 w-5 text-rose-500" />
              <div className="flex flex-col">
                <span className="font-bold">Emergency Support</span>
                <span className="text-[10px] text-muted-foreground">Speak with an infrastructure engineer</span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ListItem = ({ title, children, href }) => (
  <li>
    <NavigationMenuLink asChild>
      <a href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent">
        <div className="text-sm font-medium leading-none text-foreground">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
);

const ComplianceBadge = ({ label, description }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="flex items-center gap-3 cursor-help group">
        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
          <CheckCircle2 size={14} />
        </div>
        <span className="text-[11px] font-black tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-all uppercase">{label}</span>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 p-6 rounded-3xl border-border bg-card shadow-2xl">
      <div className="space-y-2">
        <h4 className="text-sm font-black italic uppercase tracking-wider">{label}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{description}</p>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const CodeFeature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-4 text-background/80 hover:text-background transition-colors group cursor-default">
    <div className="h-10 w-10 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
      <Icon size={18} />
    </div>
    <span className="font-black text-sm uppercase tracking-widest">{text}</span>
  </div>
);

const features = [
  { icon: Zap, title: "Edge Auth", description: "Globally distributed auth nodes ensure <50ms latency regardless of where your users are." },
  { icon: ShieldCheck, title: "Fraud Guard", description: "Automated bot detection and brute-force protection built into every login flow." },
  { icon: Fingerprint, title: "Passkeys", description: "Enable biometric login with a single line of code. No more passwords to reset." },
  { icon: Monitor, title: "Shard Console", description: "Manage users, monitor login trends, and configure webhooks from a beautiful interface." },
  { icon: Globe, title: "Global SSO", description: "Connect to Enterprise providers like Okta, Azure AD, and Google Workspace instantly." },
  { icon: Code2, title: "API First", description: "Everything you can do in our console, you can do via our robust REST API." }
];

export default Home;