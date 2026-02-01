import React from "react";
import { Settings2 } from "lucide-react";

const Configuration = () => {
    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Project Configuration & Policy Engine</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Configure global system behavior and security policies through the AuthSphere project state.
                </p>
            </div>

            <div className="space-y-8">
                {/* Verification Logic */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Verification Lifecycle Policies
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The <code>requireVerification</code> toggle defines the strictness of the identity propagation. If enabled, the system enforces a <code>403 Access Denied</code> response for all unverified user entities across both local and social providers. This policy is evaluated at the protocol level before token issuance.
                    </p>
                </section>

                {/* Allowed Origins */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        CORS / Origin White-listing
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        AuthSphere utilizes a dynamic Origin policy engine. Every SDK request must contain a valid <code>Origin</code> header that matches the project's configured white-list. This prevents cross-site credential leaks and ensures that tokens are only issued to trusted client environments.
                    </p>
                </section>

                <div className="p-3 rounded-xl border bg-card/50 space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Settings2 size={12} className="text-primary" />
                        Metadata Extension Schema
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        Add custom client-side metadata (e.g., Support URL, Organization Name) in the dashboard. These values are exposed via the <code>/sdk/config</code> endpoint and can be used to dynamically theme your client-side authentication screens.
                    </p>
                </div>
            </div>
        </article>
    );
};

export default Configuration;
