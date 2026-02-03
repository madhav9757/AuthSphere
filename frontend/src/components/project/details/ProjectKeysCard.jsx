import { useState } from "react";
import { KeyRound, Copy, Check, RefreshCw, Globe, ShieldCheck, Code2, AlertTriangle, Eye, EyeOff } from "lucide-react";
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
      "WARNING: Rotating keys will invalidate all existing sessions. This cannot be undone. Continue?"
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
    <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b pb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              API Credentials
            </CardTitle>
            <CardDescription>
              Manage your public and private keys for SDK integration.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateKeys}
            disabled={rotating}
            className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${rotating ? "animate-spin" : ""}`} />
            Rotate Keys
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x">

          {/* Left Column: Keys & Code */}
          <div className="lg:col-span-3 p-6 space-y-8">

            {/* Public Key */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground/80">Public Key (Client ID)</label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Safe to share</span>
              </div>
              <div className="relative group">
                <div className="flex items-center gap-3 p-3 bg-zinc-950 text-zinc-50 rounded-xl font-mono text-sm border border-zinc-800 shadow-inner">
                  <div className="flex-1 truncate select-all opacity-90">
                    {project.publicKey}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(project.publicKey)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Private Key Placeholder (if we had it, but usually we don't show it again or it's hidden) 
                Assuming the model hides private key, so we strictly show integration code.
            */}

            {/* SDK Integration */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <Code2 className="h-4 w-4 text-primary" />
                Quick Integration
              </div>
              <div className="relative overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="ml-4 text-xs text-zinc-500 font-mono">auth.js</div>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                    <span className="text-purple-400">import</span> {`{ initAuth }`} <span className="text-purple-400">from</span> <span className="text-green-400">"@authspherejs/sdk"</span>;
                    {"\n\n"}
                    <span className="text-purple-400">const</span> <span className="text-blue-400">auth</span> = <span className="text-yellow-400">initAuth</span>({`{`}
                    {"\n  "}publicKey: <span className="text-green-400">"{project.publicKey}"</span>,
                    {"\n  "}projectId: <span className="text-green-400">"{project._id}"</span>,
                    {"\n  "}redirectUri: <span className="text-green-400">"{project.redirectUris?.[0] || 'YOUR_CALLBACK_URL'}"</span>
                    {`\n}`});
                  </pre>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white border-zinc-700"
                  onClick={() => {
                    navigator.clipboard.writeText(`import { initAuth } from "@authspherejs/sdk";\n\nconst auth = initAuth({\n  publicKey: "${project.publicKey}",\n  projectId: "${project._id}",\n  redirectUri: "${project.redirectUris?.[0] || 'YOUR_CALLBACK_URL'}"\n});`);
                    toast.success("Code snippet copied");
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-2" /> Copy Code
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Config Summary */}
          <div className="lg:col-span-2 p-6 bg-muted/30 space-y-8">

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Redirect URIs
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.redirectUris?.map((uri) => (
                  <Badge key={uri} variant="outline" className="bg-background text-xs font-mono py-1">
                    {uri}
                  </Badge>
                ))}
                {(!project.redirectUris || project.redirectUris.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">No configurations found</span>
                )}
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Active Providers
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.providers?.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border text-xs font-medium capitalize">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {p}
                  </div>
                ))}
                {(!project.providers || project.providers.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">No providers enabled</span>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Development Mode</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
                    Ensure you whitelist your domains in the settings before going to production.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectKeysCard;
