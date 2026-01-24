import { useState } from "react";
import { KeyRound, Copy, Check, RefreshCcw, ShieldAlert, Code2, Globe } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { rotateProjectKeys } from "@/api/ProjectAPI";

const ProjectKeysCard = ({ project, onKeysRotated }) => {
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(project.publicKey);
    setCopied(true);
    toast.success("Public Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKeys = async () => {
    const confirm = window.confirm(
      "WARNING: Rotating keys will immediately invalidate all existing client sessions and API integrations. This action cannot be undone. Proceed?"
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
    <Card className="border-border shadow-sm bg-card overflow-hidden transition-all duration-300">
      <CardHeader className="pb-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-black text-foreground">
              <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              API Credentials
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Use these environment variables to authenticate your SDK.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateKeys}
            disabled={rotating}
            className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border-border transition-all rounded-full px-4"
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-2 font-bold ${rotating ? "animate-spin" : ""}`} />
            Rotate Secret Keys
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-10 pt-8">
        {/* Public Key Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">
            Public Identification Key
          </label>
          <div className="flex items-center gap-2 p-2 bg-muted/30 border border-border rounded-2xl group focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <code className="flex-1 px-4 py-2 font-mono text-sm text-foreground/90 break-all select-all">
              {project.publicKey}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="rounded-xl h-10 px-6 font-bold bg-background border border-border hover:bg-muted transition-all active:scale-95"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Redirect URIs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe size={14} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Whitelist Redirects</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.redirectUris?.map((uri) => (
                <Badge key={uri} variant="secondary" className="font-mono text-[10px] bg-background text-muted-foreground border border-border px-2">
                  {uri}
                </Badge>
              ))}
              {(!project.redirectUris || project.redirectUris.length === 0) && (
                <p className="text-xs text-muted-foreground italic">No URIs configured.</p>
              )}
            </div>
          </div>

          {/* Providers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <ShieldAlert size={14} className="text-indigo-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Identity Brokers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.providers?.map((p) => (
                <Badge key={p} className="bg-indigo-600 dark:bg-indigo-500 text-white border-none font-bold text-[10px] px-3">
                  {p.toUpperCase()}
                </Badge>
              ))}
              {(!project.providers || project.providers.length === 0) && (
                <p className="text-xs text-muted-foreground italic">No brokers enabled.</p>
              )}
            </div>
          </div>
        </div>

        {/* SDK Integration Code Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                <Code2 size={14} className="text-muted-foreground" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">SDK Entry Point</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono opacity-50 uppercase border-border">esm / react</Badge>
          </div>
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
            <pre className="bg-muted/50 text-foreground/80 p-6 rounded-2xl text-[13px] font-mono leading-relaxed overflow-x-auto border border-border ring-1 ring-border/50">
              <code className="text-indigo-400">import</code> {`{ initAuth } `} <code className="text-indigo-400">from</code> <code className="text-emerald-400">"@authspherejs/sdk"</code>;{"\n\n"}
              <code className="text-slate-500">// Initialize with your Identification Key</code>{"\n"}
              <code className="text-indigo-400">const</code> auth = <code className="text-amber-400">initAuth</code>({"{"}{"\n"}
              {`  publicKey: `}<code className="text-emerald-400">"{project.publicKey}"</code>,{"\n"}
              {`  redirectUri: `}<code className="text-emerald-400">"https://yourapp.com/callback"</code>{"\n"}
              {"}"});
            </pre>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(`import { initAuth } from "@authspherejs/sdk";\n\nconst auth = initAuth({\n  publicKey: "${project.publicKey}",\n  redirectUri: "https://yourapp.com/callback"\n});`);
                  toast.success("Snippet copied");
                }}
                className="h-9 w-9 rounded-xl bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex gap-4 items-start animate-pulse hover:pause">
          <div className="h-10 w-10 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-bold uppercase tracking-wider mb-1">
              Data Sovereignty Advisory
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-500/80 leading-relaxed font-medium">
              These identification keys define your project's security perimeter. Rotate immediately if exposed in client-side source control or insecure logs.
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProjectKeysCard;