import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Copy,
    Terminal,
    Search,
    ArrowRight,
    Loader2,
    Zap,
    Code2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getProjectUsers } from "@/api/ProjectAPI";

const GettingStartedWizard = ({ open, onClose, project }) => {
    const [step, setStep] = useState(1);
    const [framework, setFramework] = useState("react");
    const [testing, setTesting] = useState(false);
    const [testSuccess, setTestSuccess] = useState(false);
    const [copied, setCopied] = useState("");

    useEffect(() => {
        if (open) {
            setStep(1);
            setTesting(false);
            setTestSuccess(false);
        }
    }, [open]);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(""), 2000);
    };

    const handleTestConnection = async () => {
        if (!project?._id) return;

        setTesting(true);
        try {
            // Small delay for effect
            await new Promise(r => setTimeout(r, 1500));

            const res = await getProjectUsers(project._id);
            if (res.success && res.data.length > 0) {
                setTestSuccess(true);
                toast.success("First login detected! Everything is working correctly.");
            } else {
                toast.error("No login detected yet. Try integrating the SDK and logging in.");
            }
        } catch (err) {
            toast.error("Failed to verify connection.");
        } finally {
            setTesting(false);
        }
    };

    const frameworks = [
        { id: "react", name: "React", icon: "⚛️" },
        { id: "nextjs", name: "Next.js", icon: "▲" },
        { id: "vue", name: "Vue", icon: "🖖" },
    ];

    const installCommands = {
        react: "npm install @authspherejs/react",
        nextjs: "npm install @authspherejs/nextjs",
        vue: "npm install @authspherejs/vue",
    };

    const codeSnippets = {
        react: `import { AuthSphereProvider } from "@authspherejs/react";

function App() {
  return (
    <AuthSphereProvider 
      publicKey="${project?.publicKey || "YOUR_PUBLIC_KEY"}"
    >
      <YourApp />
    </AuthSphereProvider>
  );
}`,
        nextjs: `// app/layout.tsx
import { AuthSphereProvider } from "@authspherejs/nextjs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthSphereProvider publicKey="${project?.publicKey || "YOUR_PUBLIC_KEY"}">
          {children}
        </AuthSphereProvider>
      </body>
    </html>
  );
}`,
        vue: `import { createApp } from 'vue'
import { createAuthSphere } from '@authspherejs/vue'
import App from './App.vue'

const app = createApp(App)
app.use(createAuthSphere, {
  publicKey: '${project?.publicKey || "YOUR_PUBLIC_KEY"}'
})
app.mount('#app')`,
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const progress = (step / 4) * 100;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="flex h-1.5 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="px-2 py-0 text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary border-none">Step {step} of 4</Badge>
                            {step === 4 && testSuccess && (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 animate-pulse border-none">Live Connection</Badge>
                            )}
                        </div>
                        <DialogTitle className="text-3xl font-bold tracking-tight">
                            {step === 1 && "Choose your framework"}
                            {step === 2 && "Configure API Keys"}
                            {step === 3 && "Install & Initialize"}
                            {step === 4 && "Verify Connection"}
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground mt-2">
                            {step === 1 && "Select the technology you're using to build your app."}
                            {step === 2 && "These keys link your application to AuthSphere."}
                            {step === 3 && "Run the command below and add the initialization code."}
                            {step === 4 && "Launch your app and perform a test login to verify setup."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-[320px] mb-8">
                        {/* STEP 1: FRAMEWORK */}
                        {step === 1 && (
                            <div className="grid grid-cols-3 gap-5">
                                {frameworks.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFramework(f.id)}
                                        className={`
                      flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all gap-4 group
                      ${framework === f.id
                                                ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                                : "border-muted hover:border-primary/30 bg-card hover:bg-muted/30"}
                    `}
                                    >
                                        <span className="text-5xl group-hover:scale-110 transition-transform">{f.icon}</span>
                                        <span className={`font-bold text-sm ${framework === f.id ? "text-primary" : "text-muted-foreground"}`}>{f.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STEP 2: API KEYS */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Public Key</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-4 bg-muted/50 rounded-xl text-sm font-mono truncate border relative group">
                                            {project?.publicKey || "Loading..."}
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-12 w-12 rounded-xl"
                                            onClick={() => copyToClipboard(project?.publicKey, 'pk')}
                                        >
                                            {copied === 'pk' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed italic">
                                        <strong>Note:</strong> Public keys are safe to use in your frontend code.
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project ID</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-4 bg-muted/50 rounded-xl text-sm font-mono truncate border">
                                            {project?._id || "Loading..."}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-12 w-12 rounded-xl"
                                            onClick={() => copyToClipboard(project?._id, 'pid')}
                                        >
                                            {copied === 'pid' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: INSTALL */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <Terminal className="h-3 w-3" />
                                        Install Package
                                    </div>
                                    <div className="relative group">
                                        <code className="block p-5 bg-zinc-950 text-zinc-100 rounded-xl text-sm font-mono border border-zinc-800 shadow-lg">
                                            {installCommands[framework]}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(installCommands[framework], 'cmd')}
                                            className="absolute right-3 top-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            {copied === 'cmd' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <Code2 className="h-3 w-3" />
                                        {framework.charAt(0).toUpperCase() + framework.slice(1)} Setup
                                    </div>
                                    <div className="relative group">
                                        <pre className="p-5 bg-muted/30 rounded-xl text-[12px] font-mono border whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                                            {codeSnippets[framework]}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(codeSnippets[framework], 'snippet')}
                                            className="absolute right-4 top-4 p-2 bg-background/80 backdrop-blur hover:bg-background rounded-lg border shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            {copied === 'snippet' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: VERIFY */}
                        {step === 4 && (
                            <div className="py-10 flex flex-col items-center justify-center text-center space-y-8">
                                <div className={`
                  h-32 w-32 rounded-full flex items-center justify-center transition-all duration-1000 relative
                  ${testSuccess
                                        ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                                        : testing
                                            ? "bg-primary/5 border-2 border-primary/20"
                                            : "bg-muted/50 border-2"}
                `}>
                                    {testSuccess ? (
                                        <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-in zoom-in duration-500" />
                                    ) : testing ? (
                                        <div className="relative h-full w-full flex items-center justify-center">
                                            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <Zap className="h-12 w-12 text-primary animate-pulse" />
                                        </div>
                                    ) : (
                                        <Zap className="h-16 w-16 text-muted-foreground" />
                                    )}

                                    {testing && !testSuccess && (
                                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-background rounded-full border-2 border-primary flex items-center justify-center">
                                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 max-w-sm">
                                    <h3 className="font-bold text-2xl tracking-tight">
                                        {testSuccess ? "Connection Verified!" : "Awaiting First Login"}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {testSuccess
                                            ? "We've successfully detected a login on your project. Your integration is correctly configured."
                                            : "Run your application and log in. We'll automatically detect the event here."}
                                    </p>
                                </div>

                                {!testSuccess && (
                                    <Button
                                        variant={testing ? "outline" : "default"}
                                        className="gap-3 px-10 py-7 h-auto text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 group"
                                        onClick={handleTestConnection}
                                        disabled={testing}
                                    >
                                        {testing ? (
                                            <>
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                Listening...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                                Test Connection
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-4 pt-6 border-t flex flex-row items-center justify-between sm:justify-between">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`font-semibold ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            Back
                        </Button>

                        <div className="flex gap-3">
                            {step < 4 ? (
                                <Button className="gap-2 px-6 py-5 rounded-xl font-bold" onClick={nextStep}>
                                    Next Step <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    className={`gap-2 px-8 py-5 rounded-xl font-bold transition-all ${testSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 shadow-lg' : ''}`}
                                    onClick={onClose}
                                >
                                    {testSuccess ? "Finish Setup" : "Setup Later"}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GettingStartedWizard;
