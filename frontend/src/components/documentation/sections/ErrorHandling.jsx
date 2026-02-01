import React from "react";
import { AlertCircle, Terminal } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const ErrorHandling = () => {
    const commonErrors = [
        {
            code: "AUTH_CODE_EXPIRED",
            status: 400,
            desc: "The authorization code has already been used or has expired (TTL 5m)."
        },
        {
            code: "INVALID_ORIGIN",
            status: 403,
            desc: "The request origin is not in the 'Allowed Origins' list for this project."
        },
        {
            code: "EMAIL_UNVERIFIED",
            status: 403,
            desc: "User has not verified their email. Blocked by project security policy."
        },
        {
            code: "RATELIMIT_EXCEEDED",
            status: 429,
            desc: "Too many requests from this IP. Default: 100 req/min for Hobby projects."
        }
    ];

    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Error Handling</h1>
                <p className="text-lg text-muted-foreground">
                    Standardized error codes for building resilient authentication logic.
                </p>
            </div>

            <div className="space-y-8">
                <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="p-4 font-bold">Error Code</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {commonErrors.map((error, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-mono text-destructive font-bold">{error.code}</td>
                                    <td className="p-4 font-medium">{error.status}</td>
                                    <td className="p-4 text-muted-foreground">{error.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-primary" />
                        Example Error Catch
                    </h3>
                    <DocsCodeBlock
                        id="catch-error"
                        code={`try {\n  await AuthSphere.tokenExchange(code);\n} catch (err) {\n  const { error_code, message } = await err.json();\n  \n  if (error_code === 'INVALID_ORIGIN') {\n    console.error("Check your Dashboard Origin settings!");\n  }\n}`}
                        language="javascript"
                    />
                </div>
            </div>
        </article>
    );
};

export default ErrorHandling;
