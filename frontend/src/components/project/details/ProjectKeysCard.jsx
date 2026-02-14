import { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Globe,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { rotateProjectKeys } from "@/api/ProjectAPI";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { allProvidersList } from "@/lib/providers";

const ProjectKeysCard = ({ project, onKeysRotated }) => {
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKeys = async () => {
    const confirm = window.confirm(
      "WARNING: Rotating keys will invalidate all existing sessions. This cannot be undone. Continue?",
    );
    if (!confirm) return;

    try {
      setRotating(true);
      const res = await rotateProjectKeys(project._id);
      if (res.success) {
        toast.success("Keys rotated successfully");
        onKeysRotated?.();
      } else {
        toast.error(res.message || "Failed to rotate keys");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setRotating(false);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                API Credentials
              </h2>
              <p className="text-muted-foreground text-sm">
                Your unique security identifiers for integrating AuthSphere into
                your applications.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotateKeys}
              disabled={rotating}
              className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${rotating ? "animate-spin" : ""}`}
              />
              Rotate Keys
            </Button>
          </div>
        </div>

        {/* Keys Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Technical Identifiers
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Public Key (Client ID)
                  </label>
                  <Badge
                    variant="outline"
                    className="text-[9px] h-4 font-bold border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
                  >
                    Production
                  </Badge>
                </div>
                <div className="group relative">
                  <div className="flex items-center gap-3 p-2.5 bg-muted/20 backdrop-blur-sm rounded-xl border font-mono text-xs transition-all hover:border-primary/30">
                    <KeyRound className="h-3.5 w-3.5 text-primary/60" />
                    <div className="flex-1 truncate select-all">
                      {project.publicKey}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(project.publicKey)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project ID</label>
                <div className="group relative">
                  <div className="flex items-center gap-3 p-2.5 bg-muted/20 backdrop-blur-sm rounded-xl border font-mono text-xs transition-all hover:border-primary/30">
                    <Globe className="h-3.5 w-3.5 text-primary/60" />
                    <div className="flex-1 truncate select-all">
                      {project._id}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(project._id)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              API Reference
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border bg-muted/5 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Base Auth URL
                  </span>
                  <code className="text-xs text-primary font-mono">
                    {window.location.origin}/api/v1/auth
                  </code>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Discovery URL
                  </span>
                  <code className="text-xs text-primary font-mono">
                    /.well-known/openid-configuration
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* .env Helper Section */}
        <div className="space-y-4 p-6 rounded-2xl border border-primary/5 bg-primary/2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            Environment Setup
          </h3>
          <p className="text-xs text-muted-foreground">
            Add these to your{" "}
            <code className="bg-muted px-1 rounded">.env</code> file
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl font-mono text-xs text-zinc-400 space-y-1 relative group">
            <button
              onClick={() =>
                handleCopy(
                  `AUTH_SPHERE_CLIENT_ID=${project.publicKey}\nAUTH_SPHERE_PROJECT_ID=${project._id}`,
                )
              }
              className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <div>
              AUTH_SPHERE_CLIENT_ID=
              <span className="text-emerald-400">{project.publicKey}</span>
            </div>
            <div>
              AUTH_SPHERE_PROJECT_ID=
              <span className="text-emerald-400">{project._id}</span>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Quick Integration
            </h3>
            <Badge variant="outline" className="text-[10px] font-bold">
              SDK v2.1.0
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Copy this snippet to initialize the AuthSphere SDK in your frontend
            application.
          </p>

          <Terminal
            copyable
            codeToCopy={`import { initAuth } from "@authspherejs/sdk";\n\nconst auth = initAuth({\n  publicKey: "${project.publicKey}",\n  projectId: "${project._id}",\n  redirectUri: "${project.redirectUris?.[0] || "YOUR_CALLBACK_URL"}"\n});`}
            className="max-w-none bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl ring-1 ring-white/5"
            startOnView={false}
          >
            <TypingAnimation className="text-cyan-400 font-bold">
              $ npm install @authspherejs/sdk
            </TypingAnimation>

            <AnimatedSpan className="text-zinc-500 italic">
              <span># Initializing SDK in your project</span>
            </AnimatedSpan>

            <AnimatedSpan className="text-slate-300">
              <pre className="font-mono text-[13px] leading-relaxed">
                <span className="text-purple-400">import</span> {`{ initAuth }`}{" "}
                <span className="text-purple-400">from</span>{" "}
                <span className="text-emerald-400">"@authspherejs/sdk"</span>;
                {"\n\n"}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">auth</span> ={" "}
                <span className="text-yellow-300">initAuth</span>({`{`}
                {"\n  "}publicKey:{" "}
                <span className="text-emerald-400">"{project.publicKey}"</span>,
                {"\n  "}projectId:{" "}
                <span className="text-emerald-400">"{project._id}"</span>,
                {"\n  "}redirectUri:{" "}
                <span className="text-emerald-400">
                  "{project.redirectUris?.[0] || "YOUR_CALLBACK_URL"}"
                </span>
                {`\n}`});
              </pre>
            </AnimatedSpan>
          </Terminal>
        </div>
      </div>

      {/* Sidebar Info Section */}
      <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24">
        <div className="p-5 rounded-2xl border border-primary/10 bg-primary/2 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">
              Deployment Status
            </h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold">
                  Live in Production
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-tighter">
                <span>Identity Cloud</span>
                <span>v2.4.0-stable</span>
              </div>
            </div>

            <Separator className="bg-primary/5" />

            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                Ready Providers
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.providers?.map((providerId) => {
                  const p = allProvidersList.find(
                    (item) => item.id === providerId,
                  );
                  return (
                    <div
                      key={providerId}
                      className="h-7 w-7 rounded-md border bg-white flex items-center justify-center p-1.5 shadow-sm"
                      title={p?.name || providerId}
                    >
                      <img
                        src={p?.logo}
                        alt={providerId}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border bg-muted/10 space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            Integration Checklist
          </h4>
          <div className="space-y-3">
            {[
              { label: "Public Key Generated", status: true },
              {
                label: "URIs Whitelisted",
                status: project.redirectUris?.length > 0,
              },
              {
                label: "Origins Configured",
                status: project.allowedOrigins?.length > 0,
              },
              {
                label: "Providers Enabled",
                status: project.providers?.length > 0,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                {item.status ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-dashed border-muted-foreground/30" />
                )}
                <span
                  className={
                    item.status ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/2 space-y-3 font-medium">
          <div className="flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900/80 leading-relaxed italic">
              "Never expose your backend secrets in client-side code bundles."
            </p>
          </div>
          <Button
            variant="link"
            className="text-[10px] h-auto p-0 text-amber-700 font-bold uppercase tracking-tighter hover:no-underline"
          >
            Read Security Best Practices →
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default ProjectKeysCard;
