import { useState } from "react";
import { KeyRound, Copy, Check, RefreshCw, Globe, ShieldCheck, Code2 } from "lucide-react";
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(project.publicKey);
    setCopied(true);
    toast.success("Public key copied to clipboard");
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <KeyRound className="h-5 w-5 text-primary" />
              API Credentials
            </CardTitle>
            <CardDescription className="mt-1">
              Use these credentials to authenticate your SDK
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateKeys}
            disabled={rotating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${rotating ? "animate-spin" : ""}`} />
            Rotate Keys
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Public Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Public Key</label>
          <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
            <code className="flex-1 font-mono text-sm break-all">
              {project.publicKey}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="gap-2 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Redirect URIs & Providers */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-primary" />
              Redirect URIs
            </div>
            <div className="flex flex-wrap gap-2">
              {project.redirectUris?.map((uri) => (
                <Badge key={uri} variant="secondary" className="font-mono text-xs">
                  {uri}
                </Badge>
              ))}
              {(!project.redirectUris || project.redirectUris.length === 0) && (
                <p className="text-xs text-muted-foreground">No URIs configured</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Providers
            </div>
            <div className="flex flex-wrap gap-2">
              {project.providers?.map((p) => (
                <Badge key={p} className="capitalize text-xs">
                  {p}
                </Badge>
              ))}
              {(!project.providers || project.providers.length === 0) && (
                <p className="text-xs text-muted-foreground">No providers enabled</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* SDK Code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Code2 className="h-4 w-4 text-primary" />
            SDK Integration
          </div>
          <div className="relative group">
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <code>
{`import { initAuth } from "@authspherejs/sdk";

const auth = initAuth({
  publicKey: "${project.publicKey}",
  redirectUri: "https://yourapp.com/callback"
});`}
              </code>
            </pre>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(`import { initAuth } from "@authspherejs/sdk";\n\nconst auth = initAuth({\n  publicKey: "${project.publicKey}",\n  redirectUri: "https://yourapp.com/callback"\n});`);
                  toast.success("Code copied");
                }}
                className="h-7 w-7"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-400 mb-1">
              Security Notice
            </p>
            <p className="text-amber-700 dark:text-amber-500/80">
              Rotate keys immediately if exposed in client-side code or insecure logs
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProjectKeysCard;
