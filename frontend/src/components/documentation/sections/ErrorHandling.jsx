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
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Structured exception management</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    AuthSphere uses a deterministic error reporting schema to enable granular client-side recovery logic and telemetry.
                </p>
            </div>

            <div className="space-y-8">
                {/* Error Schema */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Standardized Error Payload
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Every failed request returns a structural JSON response containing a machine-readable <code>code</code> and a human-readable <code>message</code>. The <code>metadata</code> object provides additional context required for state recovery (e.g., transaction IDs for OTP).
                    </p>
                    <DocsCodeBlock
                        id="error-json"
                        code={`{\n  "success": false,\n  "code": "VERIFICATION_REQUIRED",\n  "message": "User must verify email address.",\n  "metadata": {\n    "transactionId": "TX_99aB...",\n    "retryAfter": 60\n  }\n}`}
                        language="json"
                    />
                </section>

                {/* Common Codes */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Core Exception Catalog
                    </h3>
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-left text-[11px]">
                            <thead className="bg-muted text-muted-foreground uppercase font-bold text-[9px]">
                                <tr>
                                    <th className="px-3 py-2">Code</th>
                                    <th className="px-3 py-2">HTTP Status</th>
                                    <th className="px-3 py-2">Recovery Strategy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="px-3 py-2 font-mono">INVALID_CREDENTIALS</td>
                                    <td className="px-3 py-2">401</td>
                                    <td className="px-3 py-2 text-muted-foreground">Retry with linear backoff</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 font-mono">ORIGIN_NOT_ALLOWED</td>
                                    <td className="px-3 py-2">403</td>
                                    <td className="px-3 py-2 text-muted-foreground">Check CORS settings in dashboard</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 font-mono">TOKEN_EXPIRED</td>
                                    <td className="px-3 py-2">401</td>
                                    <td className="px-3 py-2 text-muted-foreground">Trigger silent token rotation</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="p-3 rounded-xl border bg-amber-500/5 text-[10px] flex gap-2 items-start">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed italic">
                        Telemetry Integration: All 4xx and 5xx exceptions are logged in the <strong>Audit Logs</strong> for developer inspection. Use the <code>requestId</code> returned in the headers to trace specific failures.
                    </p>
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
