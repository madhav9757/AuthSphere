import React from "react";
import { Layers, Code2 } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const Frameworks = ({ publicKey }) => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Framework Integration</h1>
                <p className="text-lg text-muted-foreground">
                    First-class support for the modern web ecosystem via specialized wrappers.
                </p>
            </div>

            <section className="space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">React / Next.js</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Wrap your application root with the <code>AuthSphereProvider</code> to enable context and hooks.
                    </p>
                    <DocsCodeBlock
                        id="react-provider"
                        code={`// app/layout.tsx or App.jsx\nimport { AuthSphereProvider } from '@authsphere/react';\n\nexport default function Root({ children }) {\n  return (\n    <AuthSphereProvider \n      publicKey="${publicKey}"\n      baseUrl="http://localhost:8000/api/v1"\n    >\n      {children}\n    </AuthSphereProvider>\n  );\n}`}
                        language="tsx"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-3">Usage in Components</h3>
                    <p className="text-muted-foreground mb-4">
                        Access the authentication state and methods anywhere in your component tree.
                    </p>
                    <DocsCodeBlock
                        id="react-hook"
                        code={`import { useAuth } from '@authsphere/react';\n\nfunction Profile() {\n  const { user, loginWith, logout, isLoading } = useAuth();\n\n  if (isLoading) return <Loading />;\n  if (!user) return <button onClick={() => loginWith('github')}>Log In</button>;\n\n  return <div>Welcome, {user.username}</div>;\n}`}
                        language="tsx"
                    />
                </div>
            </section>
        </article>
    );
};

export default Frameworks;
