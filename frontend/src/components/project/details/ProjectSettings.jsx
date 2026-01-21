import { useState, useMemo } from "react";
import { Save, Settings, Plus, Trash2, Globe, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "sonner";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""]
  );
  const [providers, setProviders] = useState({
    google: project.providers?.includes("google") ?? false,
    github: project.providers?.includes("github") ?? false,
    discord: project.providers?.includes("discord") ?? false,
  });

  const [saving, setSaving] = useState(false);

  // Check if anything has changed to enable/disable save button
  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers).filter(p => providers[p]).sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      JSON.stringify(redirectUris.filter(Boolean)) !== JSON.stringify(project.redirectUris) ||
      JSON.stringify(activeProviders) !== JSON.stringify(originalProviders)
    );
  }, [name, redirectUris, providers, project]);

  /* -------------------- HANDLERS -------------------- */
  const updateUri = (index, value) => {
    const updated = [...redirectUris];
    updated[index] = value;
    setRedirectUris(updated);
  };

  const addUri = () => setRedirectUris([...redirectUris, ""]);
  const removeUri = (index) => setRedirectUris(redirectUris.filter((_, i) => i !== index));

  const toggleProvider = (id) => {
    setProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const activeProviders = Object.keys(providers).filter(p => providers[p]);

      if (activeProviders.length === 0) {
        toast.error("At least one login provider must be enabled");
        return;
      }

      const res = await updateProject(project._id, {
        name,
        redirectUris: redirectUris.filter(Boolean),
        providers: activeProviders,
      });

      if (res?.success) {
        toast.success("Settings saved successfully");
        onUpdated();
      }
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border shadow-sm bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-foreground">
          <Settings className="h-5 w-5 text-muted-foreground" />
          General Settings
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Maintain your project identity and security boundaries.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-12">
        {/* 1. Basic Info */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Project Identity</h4>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed uppercase tracking-tighter">This name will be visible to your users during the OAuth consent flow.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 block">Display Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 py-6 font-bold"
              placeholder="e.g. My Production App"
            />
          </div>
        </section>

        <Separator className="bg-border/50" />

        {/* 2. Security / Redirects */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe size={14} className="text-blue-500" />
              </div>
              Redirect Safety
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed uppercase tracking-tighter">Only these URIs will be allowed for authentication callbacks. Supports wildcard locally.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 block">Allowed Callbacks</Label>
            <div className="space-y-3">
              {redirectUris.map((uri, index) => (
                <div key={index} className="group flex gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                  <Input
                    placeholder="https://app.com/api/auth/callback"
                    value={uri}
                    onChange={(e) => updateUri(index, e.target.value)}
                    className="font-mono text-xs rounded-xl border-border bg-background focus:ring-2 focus:ring-blue-500/20 py-5"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUri(index)}
                    disabled={redirectUris.length === 1}
                    className="h-10 w-10 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addUri}
              className="mt-4 rounded-xl border-dashed border-border text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all font-bold px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Callback Target
            </Button>
          </div>
        </section>

        <Separator className="bg-border/50" />

        {/* 3. Authentication Providers */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck size={14} className="text-emerald-500" />
              </div>
              Identity Nodes
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed uppercase tracking-tighter">Enable or disable social login methods for this project shard.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(providers).map((id) => (
              <button
                key={id}
                onClick={() => toggleProvider(id)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all group ${providers[id]
                  ? "border-blue-600 bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/5 scale-100"
                  : "border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/30 scale-95"
                  }`}
              >
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${providers[id] ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground group-hover:bg-border"}`}>
                  <ShieldCheck size={20} fill={providers[id] ? "currentColor" : "none"} />
                </div>
                <span className="capitalize font-black text-xs tracking-widest">{id}</span>
              </button>
            ))}
          </div>
        </section>
      </CardContent>

      <CardFooter className="bg-muted/20 p-8 border-t border-border flex justify-between items-center">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${hasChanges ? "bg-blue-500 animate-pulse" : "bg-muted-foreground/30"}`} />
          {hasChanges ? "Unsaved configuration changes" : "All changes synchronized"}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges || !name.trim()}
          className={`rounded-full px-10 py-6 h-auto font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${hasChanges
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"
            : "bg-muted text-muted-foreground/50 border border-border cursor-not-allowed"
            }`}
        >
          {saving ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
          ) : (
            <Save className="h-4 w-4 mr-3" />
          )}
          {saving ? "Deploying..." : "Apply Config"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectSettings;