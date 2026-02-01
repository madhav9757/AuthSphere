import React from "react";
import { Globe, Info } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const SocialLogin = () => {
    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Social Identity Integration</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    AuthSphere acts as a high-level abstraction layer over OAuth 2.0 and OpenID Connect providers, standardizing heterogeneous identity payloads into a consistent internal schema.
                </p>
            </div>

            <div className="space-y-8">
                {/* Redirection Bridge */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        The Redirection Bridge
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The <code>authorize</code> call initiates a secure handshake with the upstream provider. AuthSphere manages the generation of the <code>state</code> and <code>nonce</code> parameters to mitigate CSRF and Replay attacks. The redirection bridge ensures that the client-side environment remains decoupled from provider-specific URI requirements.
                    </p>
                    <DocsCodeBlock
                        id="social-auth"
                        code={`// Initiates redirection to the provider's authorization endpoint\nAuthSphere.authorize('google', {\n  redirectUri: 'https://app.authsphere.io/callback',\n  scopes: ['openid', 'profile', 'email']\n});`}
                        language="javascript"
                    />
                </section>

                {/* Callback Negotiation */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Callback & Token Negotiation
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Upon successful user consent, the provider redirects back to your specified URI with an authorization code. The SDK's <code>tokenExchange</code> method then negotiates the code for a production-grade token set, performing server-side validation of the provider's signature.
                    </p>
                    <DocsCodeBlock
                        id="callback-code"
                        code={`// In your /callback route\nconst urlParams = new URLSearchParams(window.location.search);\nconst code = urlParams.get('code');\n\nif (code) {\n  const session = await AuthSphere.tokenExchange(code);\n  // Returns standardized user profile and JWT pair\n}`}
                        language="javascript"
                    />
                </section>

                <div className="p-3 rounded-xl border bg-muted/30 flex gap-3 items-start">
                    <Globe size={16} className="text-primary mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <h5 className="text-[11px] font-bold">Standardized Claims Rendering</h5>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                            All providers (GitHub, Google, Discord) are mapped to a unified <code>User</code> interface, ensuring your application logic remains agnostic of the underlying identity source.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default SocialLogin;
