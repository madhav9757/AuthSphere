import React from "react";
import { BookOpen, ShieldCheck, Mail, Lock, BarChart3, Settings2, Fingerprint, Database, Cpu, Palette, Layout, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Introduction = () => {
    return (
        <article className="space-y-12 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                    <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary text-[10px] py-0 h-5 px-2">
                        v1.0.4 / core_specification
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Identity Infrastructure <span className="text-primary text-glow-sm">for Modern Apps</span>
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                        AuthSphere is a high-performance, developer-first identity engine designed to solve the complexities of modern authentication. 
                        By providing an abstraction layer over complex protocols like OIDC, OAuth 2.0, and PKCE, AuthSphere allows you to implement 
                        secure, scalable authentication in minutes while maintaining complete control over your user data and session logic.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">99.9%</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Uptime SLA</span>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">&lt;50ms</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">P99 Latency</span>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">256-bit</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Encryption</span>
                        </div>
                    </div>
                </div>
                
                <div className="w-full lg:w-72 shrink-0 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm space-y-4 shadow-sm">
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Stack Details</h4>
                        <p className="text-[11px] text-muted-foreground">Core technical specifications of the identity engine.</p>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: "Architecture", value: "Cloud-Native / OIDC", icon: Cpu },
                            { label: "Token Format", value: "JWT (RS256/ES256)", icon: Lock },
                            { label: "Hashing", value: "Argon2id / PBKDF2", icon: Fingerprint },
                            { label: "Storage", value: "AES-256-GCM Encrypted", icon: Database }
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent hover:border-primary/10 transition-colors">
                                <div className="flex items-center gap-2">
                                    <spec.icon className="h-3.5 w-3.5 text-primary/60" />
                                    <span className="text-[11px] text-muted-foreground font-medium">{spec.label}</span>
                                </div>
                                <span className="font-mono text-[10px] font-bold text-foreground">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Pillars */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold">Core Capabilities</h2>
                    <p className="text-sm text-muted-foreground">The platform architecture is built on four primary pillars of security and scalability.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Standards-Based Identity",
                            desc: "Fully compliant with OIDC 1.0 and OAuth 2.0. We normalize provider claims from Google, GitHub, and others into a unified developer schema."
                        },
                        {
                            icon: Lock,
                            title: "Cryptographic Security",
                            desc: "Utilize PKCE for mobile/web clients. Each project gets unique 2048-bit RSA keys for token signing, ensuring zero-trust verification."
                        },
                        {
                            icon: Mail,
                            title: "Atomic Verification",
                            desc: "Native support for OTP-based email verification, password resets, and multi-factor authentication with built-in rate limiting."
                        },
                        {
                            icon: BarChart3,
                            title: "Identity Observability",
                            desc: "Deep-dive analytics into login success rates, geographical distribution of users, and provider-specific performance metrics."
                        },
                        {
                            icon: Settings2,
                            title: "Flexible Session Logic",
                            desc: "Customizable JWT expiration, refresh token rotation policies, and global logout capabilities across all active devices."
                        },
                        {
                            icon: BookOpen,
                            title: "Developer First DX",
                            desc: "Type-safe SDKs, comprehensive documentation, and a powerful dashboard to manage your entire identity lifecycle without boilerplate."
                        }
                    ].map((item, i) => (
                        <Card key={i} className="bg-card/30 hover:bg-card/80 transition-all border-muted shadow-none group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-5 -mr-2 -mt-2 group-hover:opacity-10 transition-opacity">
                                <item.icon className="h-16 w-16" />
                            </div>
                            <CardHeader className="p-5">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">{item.title}</CardTitle>
                                <CardDescription className="text-xs leading-relaxed mt-2 text-muted-foreground/80 font-medium">
                                    {item.desc}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Deep Technical Detail Section */}
            <div className="p-8 rounded-3xl border bg-primary/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-4">
                    <h3 className="text-lg font-bold">The Encryption Engine</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Unlike traditional identity providers that store passwords with simple hashes, AuthSphere utilizes a <strong>Multi-Layer Memory Hard Algorithm</strong>. Every user password is processed through Argon2id with 50MB of memory parallelization, making it resilient against GPU-accelerated brute force attacks.
                            </p>
                            <ul className="space-y-2">
                                {[
                                    "Salt-per-entry architecture",
                                    "Peppered hashes with HSM-backed keys",
                                    "Timed-response verification to prevent side-channel leaks"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                                        <div className="h-1 w-1 rounded-full bg-primary" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 font-mono text-[10px] space-y-1.5 overflow-hidden">
                            <div className="flex gap-1.5 mb-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                            </div>
                            <p className="text-emerald-400"># Encryption Specification</p>
                            <p className="text-zinc-500">ALGO: ARGON2ID</p>
                            <p className="text-zinc-500">MEMORY: 65536 KB</p>
                            <p className="text-zinc-500">ITERATIONS: 3</p>
                            <p className="text-zinc-500">PARALLELISM: 4</p>
                            <p className="text-emerald-400"># Resulting Hash Format</p>
                            <p className="text-blue-400">$argon2id$v=19$m=65536,t=3,p=4$...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branding Engine Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Palette className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Brand Orchestration</h3>
                        <p className="text-sm text-muted-foreground">Deliver a seamless, branded authentication experience across every automated touchpoint.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3 p-6 rounded-2xl border bg-card/30">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Layout className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold">Visual Continuity</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Inject your logo, primary brand colors, and custom footer text into every system email. No more generic, third-party styled notifications.
                        </p>
                    </div>
                    <div className="space-y-3 p-6 rounded-2xl border bg-card/30">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold">Security Metadata</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Give users confidence with technical context. Optionally include IP addresses, device types, and geographical locations in verification emails.
                        </p>
                    </div>
                    <div className="space-y-3 p-6 rounded-2xl border bg-card/30">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <RefreshCw className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold">Real-time Testing</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Use the integrated **Deliverability Tester** to send live rendering previews to your inbox before deploying changes to production.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Introduction;

