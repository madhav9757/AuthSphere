import React from "react";
import { Users, ShieldCheck, Trash2 } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const UserManagement = () => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
                <p className="text-lg text-muted-foreground">
                    Administrative controls for your project's identity cluster.
                </p>
            </div>

            <div className="space-y-12">
                {/* Dashboard Actions */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Dashboard Controls</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        The AuthSphere Dashboard provides a complete UI for managing your users without writing code.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-xl flex gap-3">
                            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                            <div>
                                <h5 className="font-bold text-sm">Force Verify</h5>
                                <p className="text-xs text-muted-foreground">Manually mark a user as verified to bypass OTP requirements.</p>
                            </div>
                        </div>
                        <div className="p-4 border rounded-xl flex gap-3">
                            <Trash2 className="h-5 w-5 text-red-500 shrink-0" />
                            <div>
                                <h5 className="font-bold text-sm">Delete Account</h5>
                                <p className="text-xs text-muted-foreground">Permanently remove a user and all their associated session data.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Management API */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Programmatic Management</h2>
                    <p className="text-muted-foreground mb-4">
                        Manage users from your backend using your project's <strong>Secret Key</strong>. This API is restricted and should never be called from a frontend.
                    </p>
                    <DocsCodeBlock
                        id="mgmt-api-ref"
                        code={`// Backend Example (Node.js)\nconst res = await fetch('http://localhost:8000/api/v1/projects/:projectId/users/:userId', {\n  method: 'DELETE',\n  headers: {\n    'X-Project-Secret': process.env.AUTH_SECRET_KEY\n  }\n});`}
                        language="javascript"
                    />
                </section>
            </div>
        </article>
    );
};

export default UserManagement;
