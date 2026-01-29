import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Copy,
    Terminal,
    Search,
    ArrowRight,
    Loader2,
    Code2,
    ChevronLeft,
    Circle
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

    const steps = [
        { number: 1, title: "Framework" },
        { number: 2, title: "API Keys" },
        { number: 3, title: "Install" },
        { number: 4, title: "Verify" }
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-6 sm:p-8">
                    {/* Header with Step Indicator */}
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            {steps.map((s, idx) => (
                                <React.Fragment key={s.number}>
                                    <div className="flex items-center gap-2">
                                        <div className={`
                                            flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold transition-colors
                                            ${step >= s.number 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-muted text-muted-foreground'
                                            }
                                        `}>
                                            {step > s.number ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                s.number
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium hidden sm:inline ${
                                            step === s.number ? 'text-foreground' : 'text-muted-foreground'
                                        }`}>
                                            {s.title}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`h-[1px] w-8 sm:w-12 transition-colors ${
                                            step > s.number ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <DialogTitle className="text-2xl">
                            {step === 1 && "Choose Your Framework"}
                            {step === 2 && "Configure API Keys"}
                            {step === 3 && "Install & Initialize"}
                            {step === 4 && "Verify Connection"}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            {step === 1 && "Select the technology you're using to build your application."}
                            {step === 2 && "Copy your API credentials to connect your app to AuthSphere."}
                            {step === 3 && "Install the package and add the initialization code."}
                            {step === 4 && "Test your integration by performing a login in your app."}
                        </DialogDescription>
                    </DialogHeader>

                    <Separator className="mb-6" />

                    {/* Step Content */}
                    <div className="min-h-[280px]">
                        {/* STEP 1: FRAMEWORK */}
                        {step === 1 && (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground mb-4">
                                    We'll customize the setup instructions based on your selection.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {frameworks.map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFramework(f.id)}
                                            className={`
                                                flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
                                                ${framework === f.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50 bg-card"}
                                            `}
                                        >
                                            <span className="text-3xl mb-2">{f.icon}</span>
                                            <span className={`text-sm font-medium ${
                                                framework === f.id ? "text-foreground" : "text-muted-foreground"
                                            }`}>
                                                {f.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: API KEYS */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                                        Public Key
                                        <Badge variant="secondary" className="text-[10px]">Safe for frontend</Badge>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono truncate border">
                                            {project?.publicKey || "Loading..."}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-10 w-10"
                                            onClick={() => copyToClipboard(project?.publicKey, 'pk')}
                                        >
                                            {copied === 'pk' ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground">
                                        Project ID
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono truncate border">
                                            {project?._id || "Loading..."}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-10 w-10"
                                            onClick={() => copyToClipboard(project?._id, 'pid')}
                                        >
                                            {copied === 'pid' ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
                                    <strong>Tip:</strong> Store these values in your environment variables for better security.
                                </div>
                            </div>
                        )}

                        {/* STEP 3: INSTALL */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-2">
                                        <Terminal className="h-3 w-3" />
                                        1. Install Package
                                    </div>
                                    <div className="relative group">
                                        <code className="block p-4 bg-muted/50 rounded-lg text-sm font-mono border">
                                            {installCommands[framework]}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(installCommands[framework], 'cmd')}
                                            className="absolute right-3 top-3 p-1.5 bg-background hover:bg-muted rounded border opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {copied === 'cmd' ? (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-2">
                                        <Code2 className="h-3 w-3" />
                                        2. Initialize in Your App
                                    </div>
                                    <div className="relative group">
                                        <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono border overflow-x-auto max-h-[200px]">
                                            {codeSnippets[framework]}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(codeSnippets[framework], 'snippet')}
                                            className="absolute right-3 top-3 p-1.5 bg-background hover:bg-muted rounded border opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {copied === 'snippet' ? (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: VERIFY */}
                        {step === 4 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                                <div className={`
                                    h-24 w-24 rounded-full flex items-center justify-center transition-all
                                    ${testSuccess
                                        ? "bg-emerald-500/10 border-2 border-emerald-500"
                                        : testing
                                            ? "bg-primary/10 border-2 border-primary"
                                            : "bg-muted border-2 border-border"}
                                `}>
                                    {testSuccess ? (
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    ) : testing ? (
                                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                    ) : (
                                        <Search className="h-12 w-12 text-muted-foreground" />
                                    )}
                                </div>

                                <div className="space-y-2 max-w-md">
                                    <h3 className="font-semibold text-xl">
                                        {testSuccess ? "Connection Verified!" : "Waiting for First Login"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {testSuccess
                                            ? "Your integration is working correctly. We detected a successful login event."
                                            : "Start your application and perform a test login. Click the button below to check."}
                                    </p>
                                </div>

                                {!testSuccess && (
                                    <Button
                                        onClick={handleTestConnection}
                                        disabled={testing}
                                        className="gap-2"
                                    >
                                        {testing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Checking...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4" />
                                                Test Connection
                                            </>
                                        )}
                                    </Button>
                                )}

                                {testSuccess && (
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                        Integration Complete
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <Separator className="my-6" />

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={step === 1 ? 'invisible' : ''}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>

                        <div className="flex gap-2">
                            {step < 4 ? (
                                <Button onClick={nextStep}>
                                    Next Step
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={onClose}
                                    variant={testSuccess ? "default" : "outline"}
                                >
                                    {testSuccess ? "Complete Setup" : "I'll Test Later"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GettingStartedWizard;
