import React from "react";
import { BookOpen, ShieldCheck, Mail, Lock, BarChart3, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Introduction = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <Badge variant="outline" className="w-fit">docs / intro</Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Identity Infrastructure for Modern Apps</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    AuthSphere is a high-performance identity engine designed to handle the complexity of modern authentication flows, from stateless sessions to robust social integrations.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-10">
                {[
                    { icon: ShieldCheck, title: "Protocol Standards", desc: "Built on top of OAuth 2.0 and OpenID Connect (OIDC). We standardize provider responses into a unified identity object." },
                    { icon: Mail, title: "Managed Verification", desc: "Automatic 6-digit OTP delivery via email. Configurable lifecycle rules to enforce verification before access." },
                    { icon: Lock, title: "Hardened Security", desc: "PKCE protection for browser-based flows, cryptographically signed tokens (RS256), and AES-256-GCM data encryption." },
                    { icon: BarChart3, title: "Observability", desc: "Real-time tracking of login patterns, provider performance, and user retention directly in your project dashboard." },
                    { icon: Settings2, title: "Granular Control", desc: "Manage individual user sessions, toggle verification overrides, and monitor audit logs for every system event." },
                    { icon: BookOpen, title: "Developer First", desc: "Language-agnostic API endpoints and lightweight SDKs designed for zero-configuration deployments." }
                ].map((item, i) => (
                    <Card key={i} className="bg-card hover:bg-muted/30 transition-colors border-muted">
                        <CardHeader className="p-6">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription className="leading-relaxed mt-2 text-muted-foreground">{item.desc}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </article>
    );
};

export default Introduction;
