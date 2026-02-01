import React from "react";
import { ShieldCheck, Lock, Database, RefreshCw, Activity } from "lucide-react";

const Security = () => {
    const specs = [
        {
            icon: Database,
            title: "Data Encryption",
            desc: "All sensitive project metadata and user profile fields are encrypted at rest using AES-256-GCM. We use hardware-backed security modules for key rotation."
        },
        {
            icon: Lock,
            title: "Password Hashing",
            desc: "Passwords never touch our database in plain text. We utilize Argon2id (or SHA-512 with high salt entropy) to resist specialized hardware attacks."
        },
        {
            icon: ShieldCheck,
            title: "Token Signing",
            desc: "Identity tokens are signed using the RS256 (RSA Signature with SHA-256) algorithm. Your application validates these using the project-specific Public Key."
        },
        {
            icon: RefreshCw,
            title: "Session Rotation",
            desc: "Refresh tokens are automatically rotated on every use or after specific expiry windows to mitigate the impact of token leakage."
        }
    ];

    return (
        <article className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Security & Cryptographic controls</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    AuthSphere core utilizes industry-standard cryptographic primitives to ensure the confidentiality, integrity, and availability of identity data.
                </p>
            </div>

            <div className="space-y-8">
                {/* Primitives */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Cryptographic Primitives</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border bg-card/50">
                            <h4 className="text-[11px] font-bold mb-1">Hashing: Argon2id</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">Passwords are hashed using Argon2id with a parallelization factor of 1, 64MB memory cost, and 3 iterations, ensuring resilience against GPU-based cracking.</p>
                        </div>
                        <div className="p-3 rounded-xl border bg-card/50">
                            <h4 className="text-[11px] font-bold mb-1">Signing: RS256</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">JWTs are signed using 2048-bit RSA keys. Public keys are exposed via JWKS endpoints for stateless, cross-domain verification.</p>
                        </div>
                    </div>
                </section>

                {/* Secret Management */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Secret & Key Orchestration</h2>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                        All project-specific secrets and private keys are encrypted at rest using AES-256-GCM. We utilize a tiered key management strategy where master keys are rotated quarterly and isolated within secure environment segments.
                    </p>
                </section>

                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 items-start">
                    <Activity size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <h5 className="text-[11px] font-bold text-red-900 dark:text-red-100">Brute-Force Protection</h5>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                            Our edge layer implements adaptive rate limiting and account lockout policies. IPs exhibiting anomalous authentication patterns (e.g., credential stuffing) are automatically blacklisted across our global nodes.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Security;
