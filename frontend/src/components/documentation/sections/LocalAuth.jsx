import React from "react";
import { Info, AlertCircle } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const LocalAuth = () => {
    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Local Authentication</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    The local authentication module manages the full identity lifecycle for email-based credentials, including secure salt generation, hashing, and multi-stage verification.
                </p>
            </div>

            <div className="space-y-8">
                {/* Registration */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        User Provisioning Lifecycle
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        New users are instantiated in a truncated state. Upon registration, AuthSphere generates a cryptographically random 6-digit challenge (OTP) and persists it with a 15-minute Time-To-Live (TTL). The client receives a success acknowledgment but remains unauthenticated until the challenge is cleared.
                    </p>
                    <DocsCodeBlock
                        id="register"
                        code={`await AuthSphere.register({\n  email: 'dev@authsphere.io',\n  password: 'HardenedPassword_2024!',\n  username: 'Identity Architect'\n});`}
                        language="javascript"
                    />
                </section>

                {/* Login */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Deterministic Authentication Exchange
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The <code>loginLocal</code> method initiates a credential validation against the Argon2id hash store. If the account is flagged as <code>unverified</code>, the bridge throws a structured exception containing the required verification context. apps should catch this to redirect users to the challenge entry view.
                    </p>
                    <DocsCodeBlock
                        id="login-local"
                        code={`try {\n  const { user, tokens } = await AuthSphere.loginLocal('dev@authsphere.io', '...');\n} catch (err) {\n  if (err.status === 403 && err.code === 'VERIFICATION_REQUIRED') {\n    // Extract transaction ID for the OTP challenge\n    const txId = err.metadata.transactionId;\n    router.push(\`/verify?email=dev@authsphere.io&tx=\${txId}\`);\n  }\n}`}
                        language="javascript"
                    />
                    <div className="p-3 rounded-xl border bg-amber-500/5 text-[10px] flex gap-2 items-start">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-relaxed italic">
                            Production Security Note: Login attempts are rate-limited per IP/User identifier to mitigate brute-force vectoring and credential stuffing.
                        </p>
                    </div>
                </section>

                {/* OTP Verification */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Challenge-Response Verification
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The verification call clears the <code>unverified</code> flag from the user record and automatically establishes the primary session, returning a full OIDC-compliant token set.
                    </p>
                    <DocsCodeBlock
                        id="verify-otp"
                        code={`await AuthSphere.verifyOTP({\n  email: 'dev@authsphere.io',\n  otp: '772910',\n  transactionId: 'TX_99aB...' // Optional link to the login attempt\n});`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default LocalAuth;
