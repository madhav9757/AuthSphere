import React from "react";
import { Settings2, Sliders } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const Configuration = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Configuration</h1>
                <p className="text-lg text-muted-foreground">
                    Tune your project instances to match your application requirements.
                </p>
            </div>

            <div className="space-y-12">
                {/* Verification Settings */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Verification Logic</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        You can toggle whether users must verify their email before a session can be established.
                        This is managed per-project in the <strong>Developer Dashboard</strong>.
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li><strong>Strict Mode:</strong> Users cannot log in via <code>loginLocal</code> if <code>verified</code> is false.</li>
                        <li><strong>Permissive Mode:</strong> Users can log in, but identity objects will contain a <code>verified: false</code> flag for your app to handle.</li>
                    </ul>
                </section>

                {/* Custom Metadata */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sliders className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Client Metadata</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Passed during initialization to control redirection behavior and cookie security.
                    </p>
                    <DocsCodeBlock
                        id="client-config"
                        code={`AuthSphere.init({\n  publicKey: '...', \n  options: {\n    secureCookies: true, // Force __Host- prefixes\n    storageType: 'localStorage' | 'sessionStorage',\n    autoRefresh: true\n  }\n});`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default Configuration;
