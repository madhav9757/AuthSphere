import React from "react";
import { KeyRound, RefreshCw, LogOut } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const SessionManagement = () => {
    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Session lifecycle & Token Architecture</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    AuthSphere uses a stateless, multi-token propagation model to ensure high availability and security for distributed applications.
                </p>
            </div>

            <div className="space-y-8">
                {/* Token Architecture */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Dual-Token propagation Model</h2>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The architecture utilizes a two-tier token system to balance credential security with low-latency API access.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border bg-card/50">
                            <h4 className="text-[11px] font-bold mb-1">Access Token (JWT)</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">Short-lived (15m). Signed via RS256. Intended for stateless verification at the resource server level. Standardized OIDC payload.</p>
                        </div>
                        <div className="p-3 rounded-xl border bg-card/50">
                            <h4 className="text-[11px] font-bold mb-1">Refresh Token (Opaque)</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">Long-lived (7d). Stored with AES-256 encryption. Used to negotiate new access tokens via the <code>/sdk/refresh</code> endpoint.</p>
                        </div>
                    </div>
                </section>

                {/* Automatic Refresh */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Silent Handshake & Rotation</h2>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The SDK implementation includes a background monitor that evaluates token TTL. If an access token is within 60 seconds of expiration, a silent background request is dispatched to rotate the credentials without interrupting the user workflow.
                    </p>
                    <DocsCodeBlock
                        id="manual-refresh"
                        code={`// Programmatic session extension\nconst { accessToken, user } = await AuthSphere.refreshSession();\n// Internal: Dispatches POST /sdk/refresh with persistence-layered refresh_token`}
                        language="javascript"
                    />
                </section>

                {/* Termination */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Secure State Termination</h2>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The <code>logout</code> call performs a dual-action cleanup: it invalidates the current session on the AuthSphere cluster and performs a secure wipe of the client-side token store.
                    </p>
                    <DocsCodeBlock
                        id="logout-code"
                        code={`await AuthSphere.logout();\n// Clears local storage/cookies and notifies AuthSphere to blacklist the refresh token`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default SessionManagement;
