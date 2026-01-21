import { useState, useEffect } from "react";
import { FolderPlus, Sparkles, X, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

import { createProject } from "@/api/ProjectAPI";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [loading, setLoading] = useState(false);

  /* Reset when modal closes */
  useEffect(() => {
    if (!open) {
      setName("");
      setRedirectUri("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim() || !redirectUri.trim()) return;

    try {
      setLoading(true);

      const res = await createProject({
        name: name.trim(),
        redirectUris: [redirectUri.trim()],
        providers: ["google"], // 👈 REQUIRED
      });

      if (res?.success) {
        toast.success("Project shards initiated successfully");
        setName("");
        setRedirectUri("");
        onCreated();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to provision project resources");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border bg-card shadow-2xl p-0 overflow-hidden outline-none">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <DialogHeader className="p-8 pb-4 text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="h-14 w-14 rounded-2xl bg-white border border-border/40 flex items-center justify-center shadow-xl shadow-blue-500/5 transition-transform hover:scale-105 duration-300">
              <img src="/assets/logo.png" alt="AuthSphere Logo" className="h-8 w-8 object-contain mix-blend-multiply" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          <DialogTitle className="text-3xl font-black text-foreground tracking-tight italic flex items-center gap-2">
            Initiate Shard.
            <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-base pt-2">
            Create a new identity ecosystem. Project shards define your application's security perimeter.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Workspace Name</Label>
              <div className="relative group">
                <Input
                  autoFocus
                  placeholder="e.g. Andromeda Production"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="rounded-2xl border-border bg-background focus:ring-4 focus:ring-blue-500/10 py-7 font-bold text-base transition-all pl-12"
                />
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Landing Callback URI</Label>
              <div className="relative group">
                <Input
                  placeholder="https://app.com/callback"
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  disabled={loading}
                  className="rounded-2xl border-border bg-background focus:ring-4 focus:ring-blue-500/10 py-7 font-mono text-sm transition-all pl-12"
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-1 pt-1 italic">
                * OAuth redirects will be locked to this initial domain.
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
            <div className="h-10 w-10 shrink-0 bg-background rounded-xl border border-border flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Initializing a project shard provisions a dedicated <b>AES-256</b> encrypted database partition for your users.
            </p>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !redirectUri.trim()}
            className="rounded-full px-10 py-6 h-auto font-black uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Provisioning...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                Deploy Shard
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
