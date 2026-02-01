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
                <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
                <p className="text-lg text-muted-foreground">
                    Core SDK endpoints for building custom authentication clients.
                </p>
            </div>

            <div className="space-y-10">
                {endpoints.map((ep, i) => (
                    <section key={i} className="pb-10 border-b last:border-0">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className={`${ep.method === 'GET' ? 'bg-blue-500' : 'bg-green-500'} font-bold`}>
                                {ep.method}
                            </Badge>
                            <code className="text-sm font-bold bg-muted px-2 py-0.5 rounded">{ep.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">{ep.desc}</p>

                        {ep.body && (
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request Body</h5>
                                <DocsCodeBlock
                                    id={`api-${i}`}
                                    code={`{\n${ep.body.map(line => `  "${line.split(':')[0]}": "${line.split(':')[1].trim()}"`).join(',\n')}\n}`}
                                    language="json"
                                />
                            </div>
                        )}

                        {ep.params && (
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Parameters</h5>
                                <div className="bg-muted/30 p-4 rounded-lg border text-sm font-mono space-y-1">
                                    {ep.params.map((p, j) => <div key={j}>{p}</div>)}
                                </div>
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </article>
    );
};

export default ApiReference;
