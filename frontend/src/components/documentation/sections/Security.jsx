import React from "react";
import { ShieldCheck, Lock, Database, RefreshCw } from "lucide-react";

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
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Security Posture</h1>
                <p className="text-lg text-muted-foreground">
                    Architecture designed for zero-trust environments.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {specs.map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-card/50">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <item.icon size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-2xl bg-primary text-primary-foreground text-center">
                <h3 className="text-xl font-bold mb-2">Compliance Ready</h3>
                <p className="opacity-80 text-sm max-w-lg mx-auto leading-relaxed">
                    The AuthSphere infrastructure follows SOC2 and GDPR guidelines for data isolation,
                    ensuring that user identity clusters are strictly siloed by Project ID.
                </p>
            </div>
        </article>
    );
};

export default Security;
