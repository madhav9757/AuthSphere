import { useState, useMemo } from "react";
import { Save, Settings, Plus, Trash2, Globe, ShieldCheck, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { allProvidersList } from "@/lib/providers";
import { ProviderLogos } from "./assets";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""]
  );
  const [providers, setProviders] = useState(() => {
    const map = {};
    allProvidersList.forEach(p => {
      map[p.id] = project.providers?.includes(p.id) ?? false;
    });
    return map;
  });

  const [saving, setSaving] = useState(false);

  // Filter only ready providers for the compact settings view
  const displayProviders = allProvidersList.filter(p => p.status === 'ready').slice(0, 6);

  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers).filter(p => providers[p]).sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      JSON.stringify(redirectUris.filter(Boolean)) !== JSON.stringify(project.redirectUris || []) ||
      JSON.stringify(activeProviders) !== JSON.stringify(originalProviders)
    );
  }, [name, redirectUris, providers, project]);

  const updateUri = (index, value) => {
    const updated = [...redirectUris];
    updated[index] = value;
    setRedirectUris(updated);
  };

  const addUri = () => setRedirectUris([...redirectUris, ""]);
  const removeUri = (index) => setRedirectUris(redirectUris.filter((_, i) => i !== index));

  const toggleProvider = (id) => {
    const provider = allProvidersList.find(p => p.id === id);
    // Only allow toggling ready providers
    if (provider?.status !== 'ready') return;
    setProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const activeProviders = Object.keys(providers).filter(p => providers[p]);

      if (activeProviders.length === 0) {
        toast.error("At least one provider must be enabled");
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-primary" />
          Project Settings
        </CardTitle>
        <CardDescription>
          Configure your project settings and authentication providers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Project Name */}
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1">Project Name</h4>
            <p className="text-sm text-muted-foreground">
              This name will be visible during the OAuth consent flow
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Production App"
            />
          </div>
        </div>

        <Separator />

        {/* Redirect URIs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Redirect URIs</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Only these URIs will be allowed for authentication callbacks
          </p>
          <div className="space-y-2">
            {redirectUris.map((uri, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://app.com/callback"
                  value={uri}
                  onChange={(e) => updateUri(index, e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUri(index)}
                  disabled={redirectUris.length === 1}
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
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add URI
          </Button>
        </div>

        <Separator />

        {/* Providers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Authentication Providers</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable social login methods for this project.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-full px-4">
              <Link to={`/projects/${project._id}/providers`}>
                View All {allProvidersList.length} Providers
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayProviders.map((p) => {
              const isEnabled = providers[p.id];

              return (
                <div
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`
                    flex items-center gap-3 p-3 border rounded-xl transition-all duration-200 cursor-pointer
                    ${isEnabled ? "bg-primary/5 border-primary shadow-sm" : "bg-card hover:bg-muted/50"}
                  `}
                >
                  <div className={`h-10 w-10 shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center ${isEnabled ? "ring-2 ring-primary/20" : ""}`}>
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => { e.target.src = "https://www.svgrepo.com/show/506680/app-development.svg" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className={`text-[10px] font-bold ${isEnabled ? "text-primary" : "text-muted-foreground"}`}>
                      {isEnabled ? "Enabled" : "Available"}
                    </p>
                  </div>
                  <Checkbox
                    id={p.id}
                    checked={isEnabled}
                    onCheckedChange={() => toggleProvider(p.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full h-5 w-5"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
              <Link to={`/projects/${project._id}/providers`} className="flex items-center gap-1">
                View More Providers <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {hasChanges && (
            <>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Unsaved changes
            </>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges || !name.trim()}
          className="gap-2"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectSettings;
