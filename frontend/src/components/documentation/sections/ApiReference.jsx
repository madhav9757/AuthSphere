import React from "react";
import { Badge } from "@/components/ui/badge";
import DocsCodeBlock from "../DocsCodeBlock";

const ApiReference = () => {
    const endpoints = [
        {
            method: "GET",
            path: "/sdk/authorize",
            desc: "Initiate the OAuth 2.0 / OIDC flow. Redirects to external providers.",
            params: ["provider: 'google' | 'github' | 'discord'", "publicKey: string", "redirectUri: string"]
        },
        {
            method: "POST",
            path: "/sdk/token",
            desc: "Exchanges an authorization code for an Access Token and Refresh Token.",
            body: ["code: string", "publicKey: string"]
        },
        {
            method: "POST",
            path: "/sdk/login-local",
            desc: "Authenticates a user via email and password.",
            body: ["email: string", "password: string", "publicKey: string"]
        },
        {
            method: "POST",
            path: "/sdk/verify-otp",
            desc: "Verifies an email address using a one-time password.",
            body: ["email: string", "otp: string", "publicKey: string"]
        },
        {
            method: "POST",
            path: "/sdk/refresh",
            desc: "Generates a new Access Token using a valid Refresh Token.",
            body: ["refreshToken: string", "publicKey: string"]
        }
    ];

    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">API Reference</h1>
                <p className="text-sm text-muted-foreground">
                    Core SDK endpoints for building custom authentication clients.
                </p>
            </div>

            <div className="space-y-4">
                {endpoints.map((ep, i) => (
                    <section key={i} className="pb-6 border-b last:border-0">
                        <div className="grid lg:grid-cols-5 gap-6">
                            {/* Left Side: Info */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={`${ep.method === 'GET' ? 'text-blue-500 bg-blue-500/10' : 'text-emerald-500 bg-emerald-500/10'} font-bold border-0 text-[9px] h-4 px-1.5`}>
                                        {ep.method}
                                    </Badge>
                                    <code className="text-[11px] font-bold bg-muted px-1.5 py-0.5 rounded text-foreground">{ep.path}</code>
                                </div>
                                <p className="text-[12px] text-muted-foreground leading-relaxed">
                                    {ep.desc} All requests require a valid <code>Origin</code> header matching the project configuration.
                                </p>

                                {ep.params && (
                                    <div className="space-y-1.5">
                                        <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">URL Query Parameters</h5>
                                        <div className="bg-muted/30 p-2.5 rounded-lg border text-[10px] font-mono space-y-1 text-muted-foreground/80">
                                            {ep.params.map((p, j) => <div key={j} className="flex gap-2"><span className="text-primary opacity-70">▸</span>{p}</div>)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Code */}
                            <div className="lg:col-span-3">
                                {ep.body ? (
                                    <div className="space-y-1.5">
                                        <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">JSON Payload Specification</h5>
                                        <DocsCodeBlock
                                            id={`api-${i}`}
                                            code={`{\n${ep.body.map(line => `  "${line.split(':')[0]}": "${line.split(':')[1].trim()}"`).join(',\n')}\n}`}
                                            language="json"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center border border-dashed rounded-lg bg-muted/20 text-[9px] text-muted-foreground uppercase tracking-widest p-6">
                                        Stateless GET Request
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </article>
    );
};

export default ApiReference;
