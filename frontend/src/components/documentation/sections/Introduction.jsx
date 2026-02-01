import React from "react";
import { BookOpen, ShieldCheck, Mail, Lock, BarChart3, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Introduction = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-3">
                    <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary text-[10px] py-0 h-5">docs / core_specification</Badge>
                    <h1 className="text-3xl font-extrabold tracking-tight">Identity Infrastructure for Modern Apps</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        AuthSphere is a production-grade identity engine architected for deterministic session management and secure identity propagation.
                        It standardizes complex authentication protocols into a unified developer interface, ensuring that your application remains protocol-agnostic while benefiting from hardened security defaults.
                    </p>
                </div>
                <div className="w-full lg:w-64 shrink-0 p-3 rounded-xl border bg-muted/30 space-y-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Protocol Specifications</h4>
                    <div className="space-y-1.5">
                        {[
                            { label: "Architecture", value: "Stateless / OIDC" },
                            { label: "Token Format", value: "JWT (RS256)" },
                            { label: "Storage Layer", value: "AES-256-GCM" },
                            { label: "Verification", value: "PKCE / Argon2id" }
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground/80">{spec.label}</span>
                                <span className="font-mono font-bold text-foreground/90">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                    {
                        icon: ShieldCheck,
                        title: "OAuth 2.0 & OIDC Standard",
                        desc: "Full compliance with OpenID Connect 1.0. We normalize disparate provider claims into a strictly typed identity object, removing the need for manual payload sanitization."
                    },
                    {
                        icon: Mail,
                        title: "Atomic Verification Flow",
                        desc: "Implements a non-blocking verification lifecycle. Trigger OTP delivery via SMTP/SES and manage 'verified' claims through deterministic state transitions."
                    },
                    {
                        icon: Lock,
                        title: "Cryptographic Hardening",
                        desc: "Utilizes Proof Key for Code Exchange (PKCE) for all public clients. Tokens are cryptographically signed using RS256 with 2048-bit RSA keys for verifiable integrity."
                    },
                    {
                        icon: BarChart3,
                        title: "Telemetry & Observability",
                        desc: "Native ingestion of authentication events into structured audit logs. Monitor provider-specific latency, error rates, and user retention coefficients in real-time."
                    },
                    {
                        icon: Settings2,
                        title: "Dynamic Role Mapping",
                        desc: "Configure session behavior based on project-specific environmental variables. Manage individual session lifetimes, rotation policies, and global verification overrides."
                    },
                    {
                        icon: BookOpen,
                        title: "Headless Architecture",
                        desc: "The core engine is entirely separate from the UI. Communicate through standard REST/OIDC endpoints or use our modular SDKs for seamless runtime integration."
                    }
                ].map((item, i) => (
                    <Card key={i} className="bg-card/50 hover:bg-muted/20 transition-all border-muted shadow-none group">
                        <CardHeader className="p-4">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <item.icon className="h-4 w-4" />
                            </div>
                            <CardTitle className="text-sm font-bold">{item.title}</CardTitle>
                            <CardDescription className="text-[11px] leading-relaxed mt-2 text-muted-foreground/90">{item.desc}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </article>
    );
};

export default Introduction;
