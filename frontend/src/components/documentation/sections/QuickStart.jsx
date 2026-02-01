import React from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const QuickStart = ({ publicKey, projectId }) => {
    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Quick Start Guide</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Follow this 5-minute integration guide to establish a secure handshake between your application and the AuthSphere infrastructure.
                </p>
            </div>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className="relative pl-5 border-l border-primary/20">
                        <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                        <h3 className="text-sm font-bold mb-1.5">1. Runtime Dependency</h3>
                        <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">
                            Install the core initialization logic. The SDK manages cryptographic nonces, state parameters for CSRF protection, and standardized local storage persistence for identity tokens.
                        </p>
                        <DocsCodeBlock id="install" code="npm install @authsphere/sdk" language="terminal" />
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-5 border-l border-primary/20">
                        <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                        <h3 className="text-sm font-bold mb-1.5">2. Origin Policy Config</h3>
                        <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">
                            Define your application's domain in the <Link to="/dashboard" className="text-primary hover:underline">Project Settings</Link>. AuthSphere enforces strict Cross-Origin Resource Sharing (CORS) to prevent unauthorized identity propagation.
                        </p>
                        <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[10px] flex gap-2 items-start mt-2">
                            <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-muted-foreground leading-snug italic">
                                Development Note: Ensure <code>http://localhost:3000</code> is explicitly listed. Wildcards are restricted on production projects for security integrity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-5 border-l border-muted text-foreground">
                    <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-muted border-2 border-background" />
                    <h3 className="text-sm font-bold mb-1.5">3. Client-Side Persistence Initialization</h3>
                    <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">
                        Initialize the runtime engine. This establishment call sets up the background token refresh listeners and prepares the redirection bridge. Use your <b>Public Key</b> (Client ID) which is cryptographically bound to your specific project ID and allowed origins.
                    </p>
                    <DocsCodeBlock
                        id="init"
                        code={`import { AuthSphere } from '@authsphere/sdk'\n\n// Execute at application entry point\nAuthSphere.init({\n  publicKey: '${publicKey}',\n  baseUrl: 'http://localhost:8000/api/v1',\n  options: {\n    debug: true,\n    tokenRenewalThreshold: 60 // seconds before expiry\n  }\n});`}
                        language="javascript"
                    />
                </div>
            </div>
        </article>
    );
};

export default QuickStart;
