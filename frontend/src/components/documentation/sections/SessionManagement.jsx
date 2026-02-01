import React from "react";
import { KeyRound, RefreshCw, LogOut } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const SessionManagement = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Session Management</h1>
                <p className="text-lg text-muted-foreground">
                    Understand how AuthSphere handles token persistence and session lifecycle.
                </p>
            </div>

            <div className="space-y-12">
                {/* Token Architecture */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <KeyRound className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Token Architecture</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        The system uses a <strong>dual-token</strong> model to balance security and performance.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border bg-card">
                            <h4 className="font-bold mb-1">Access Token</h4>
                            <p className="text-xs text-muted-foreground">Short-lived (15m). Included in the <code>Authorization</code> header for API requests. Statelessly verified via RS256.</p>
                        </div>
                        <div className="p-4 rounded-xl border bg-card">
                            <h4 className="font-bold mb-1">Refresh Token</h4>
                            <p className="text-xs text-muted-foreground">Long-lived (7 days). Stored in localStorage or Secure Cookies. Used to acquire new Access Tokens without user intervention.</p>
                        </div>
                    </div>
                </section>

                {/* Automatic Refresh */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <RefreshCw className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Silent Token Refresh</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        The SDK automatically monitors token expiration. Before an access token expires, it silently calls the refresh endpoint to ensure zero downtime for the user.
                    </p>
                    <DocsCodeBlock
                        id="manual-refresh"
                        code={`// Manual trigger if needed\nconst newTokens = await AuthSphere.refreshSession();\nconsole.log(newTokens.accessToken);`}
                        language="javascript"
                    />
                </section>

                {/* Termination */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <LogOut className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Session Termination</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Logging out clears all local storage, invalidates the current refresh token on the server, and prevents further identity propagation.
                    </p>
                    <DocsCodeBlock
                        id="logout-code"
                        code={`await AuthSphere.logout();\nwindow.location.href = '/login';`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default SessionManagement;
