import React from "react";
import { Info, AlertCircle } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const LocalAuth = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Local Authentication</h1>
                <p className="text-lg text-muted-foreground">
                    Implement robust Email/Password flows with integrated 6-digit OTP verification.
                </p>
            </div>

            <div className="space-y-12">
                {/* Registration */}
                <section>
                    <h3 className="text-xl font-bold mb-3">User Registration</h3>
                    <p className="text-muted-foreground mb-4">
                        New users are created in an <code>unverified</code> state. The system automatically triggers
                        an OTP email upon successful registration.
                    </p>
                    <DocsCodeBlock
                        id="register"
                        code={`await AuthSphere.register({\n  email: 'user@domain.com',\n  password: 'Password123!',\n  username: 'Alex Smith'\n});`}
                        language="javascript"
                    />
                </section>

                {/* Login */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Handling Login & Verification</h3>
                    <p className="text-muted-foreground mb-4">
                        If a user attempts to log in before verifying their email, the server returns
                        a <code>403</code> status with an <code>unverified</code> flag.
                    </p>
                    <DocsCodeBlock
                        id="login-local"
                        code={`try {\n  const session = await AuthSphere.loginLocal('user@domain.com', 'Password123!');\n} catch (err) {\n  if (err.status === 403 && err.unverified) {\n    // Redirect to your OTP verification page\n    window.location.href = '/verify?email=user@domain.com';\n  }\n}`}
                        language="javascript"
                    />
                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-sm flex gap-3 mt-4">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground italic">
                            Verification requirements can be toggled globally in the project dashboard.
                        </p>
                    </div>
                </section>

                {/* OTP Verification */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Performing OTP Verification</h3>
                    <p className="text-muted-foreground mb-4">
                        Submit the 6-digit code provided by the user via email.
                    </p>
                    <DocsCodeBlock
                        id="verify-otp"
                        code={`await AuthSphere.verifyOTP({\n  email: 'user@domain.com',\n  otp: '123456'\n});`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default LocalAuth;
