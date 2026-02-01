import React from "react";
import { Globe, Info } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const SocialLogin = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Social Login</h1>
                <p className="text-lg text-muted-foreground">
                    AuthSphere manages the complexity of OAuth 2.0 and OIDC protocols for third-party providers.
                </p>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                    <Globe className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Standardized Integration</h2>
                </div>
                <p className="text-muted-foreground">
                    Instead of writing separate logic for Google, GitHub, and Discord, you use a single redirection endpoint.
                    AuthSphere handles the handshake and returns a standardized user profile.
                </p>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Triggering Redirection</h3>
                    <p className="text-muted-foreground">
                        Redirect the user to the <code>/sdk/authorize</code> endpoint with the desired provider.
                    </p>
                    <DocsCodeBlock
                        id="social-login"
                        code={`// Using the SDK\nAuthSphere.loginWith('google');\n\n// Or manual redirection\nwindow.location.href = 'http://localhost:8000/api/v1/sdk/authorize?provider=google&publicKey=YOUR_PK';`}
                        language="javascript"
                    />
                </div>

                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 text-sm flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0" />
                    <p className="text-muted-foreground">
                        Social logins automatically mark the user as <strong>verified</strong> if the provider (like Google) has already verified their email address.
                    </p>
                </div>
            </section>
        </article>
    );
};

export default SocialLogin;
