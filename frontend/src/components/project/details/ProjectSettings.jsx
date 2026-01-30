import { useState, useMemo } from "react";
import { Save, Settings, Plus, Trash2, Globe, ShieldCheck, Lock, AlertTriangle, Clock } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProject, deleteProject } from "@/api/ProjectAPI";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { allProvidersList } from "@/lib/providers";

const ProjectSettings = ({ project, onUpdated }) => {
  const navigate = useNavigate();

  // --- STATE ---

  // General
  const [name, setName] = useState(project.name);
  const [logoUrl, setLogoUrl] = useState(project.logoUrl || "");

  // URLs
  const [redirectUris, setRedirectUris] = useState(project.redirectUris?.length ? project.redirectUris : [""]);
  const [allowedOrigins, setAllowedOrigins] = useState(project.allowedOrigins?.length ? project.allowedOrigins : [""]);

  // Security & Policies
  const [requireEmail, setRequireEmail] = useState(project.settings?.requireEmailVerification || false);
  const [mfaEnabled, setMfaEnabled] = useState(project.settings?.mfaEnabled || false);

  // Tokens (Defaults to 15m and 7d if missing)
  const [accessTokenVal, setAccessTokenVal] = useState(project.settings?.tokenValidity?.accessToken?.toString() || "900");
  const [refreshTokenVal, setRefreshTokenVal] = useState(project.settings?.tokenValidity?.refreshToken?.toString() || "604800");

  // Providers
  const [providers, setProviders] = useState(() => {
    const map = {};
    allProvidersList.forEach(p => {
      map[p.id] = project.providers?.includes(p.id) ?? false;
    });
    return map;
  });

  // UI State
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const displayProviders = allProvidersList.filter(p => p.status === 'ready').slice(0, 6);

  // --- CHANGE DETECTION ---
  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers).filter(p => providers[p]).sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      logoUrl !== (project.logoUrl || "") ||
      JSON.stringify(redirectUris.filter(Boolean)) !== JSON.stringify(project.redirectUris || []) ||
      JSON.stringify(allowedOrigins.filter(Boolean)) !== JSON.stringify(project.allowedOrigins || []) ||
      requireEmail !== (project.settings?.requireEmailVerification || false) ||
      mfaEnabled !== (project.settings?.mfaEnabled || false) ||
      accessTokenVal !== (project.settings?.tokenValidity?.accessToken?.toString() || "900") ||
      refreshTokenVal !== (project.settings?.tokenValidity?.refreshToken?.toString() || "604800") ||
      JSON.stringify(activeProviders) !== JSON.stringify(originalProviders)
    );
  }, [name, logoUrl, redirectUris, allowedOrigins, requireEmail, mfaEnabled, accessTokenVal, refreshTokenVal, providers, project]);

  // --- HELPERS ---
  const updateList = (list, setList, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };
  const addToList = (list, setList) => setList([...list, ""]);
  const removeFromList = (list, setList, index) => setList(list.filter((_, i) => i !== index));

  const toggleProvider = (id) => {
    const provider = allProvidersList.find(p => p.id === id);
    if (provider?.status !== 'ready') return;
    setProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- HANDLERS ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const activeProviders = Object.keys(providers).filter(p => providers[p]);

      if (activeProviders.length === 0) {
        toast.error("At least one provider must be enabled");
        return;
      }

      const payload = {
        name,
        logoUrl,
        redirectUris: redirectUris.filter(Boolean),
        allowedOrigins: allowedOrigins.filter(Boolean),
        providers: activeProviders,
        settings: {
          requireEmailVerification: requireEmail,
          mfaEnabled,
          tokenValidity: {
            accessToken: parseInt(accessTokenVal),
            refreshToken: parseInt(refreshTokenVal),
          }
        }
      };

      const res = await updateProject(project._id, payload);

      if (res?.success) {
        toast.success("Settings saved successfully");
        onUpdated();
      }
    } catch (err) {
      toast.error("Failed to update settings");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      setDeleting(true);
      await deleteProject(project._id);
      toast.success("Project deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-primary" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome App"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input
                id="logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://myapp.com/logo.png"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Project ID</Label>
            <div className="p-2 bg-muted rounded border font-mono text-xs text-muted-foreground select-all">
              {project._id}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Authentication Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-primary" />
            Authentication Flow
          </CardTitle>
          <CardDescription>
            Configure how users interact with the login system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Redirect URIs */}
          <div className="space-y-3">
            <Label>OAuth Redirect URIs</Label>
            <p className="text-sm text-muted-foreground">Callbacks after successful login.</p>
            <div className="space-y-2">
              {redirectUris.map((uri, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://app.com/callback"
                    value={uri}
                    onChange={(e) => updateList(redirectUris, setRedirectUris, index, e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(redirectUris, setRedirectUris, index)}
                    disabled={redirectUris.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addToList(redirectUris, setRedirectUris)} className="gap-2">
                <Plus className="h-4 w-4" /> Add URI
              </Button>
            </div>
          </div>

          <Separator />

          {/* Allowed Origins */}
          <div className="space-y-3">
            <Label>Allowed Web Origins (CORS)</Label>
            <p className="text-sm text-muted-foreground">Domains allowed to make API requests.</p>
            <div className="space-y-2">
              {allowedOrigins.map((origin, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://myapp.com"
                    value={origin}
                    onChange={(e) => updateList(allowedOrigins, setAllowedOrigins, index, e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(allowedOrigins, setAllowedOrigins, index)}
                    disabled={allowedOrigins.length === 1 && allowedOrigins[0] === ""}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addToList(allowedOrigins, setAllowedOrigins)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Origin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Security Policies (Token, Email, MFA) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-primary" />
            Security Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start justify-between space-x-4 rounded-md border p-4">
              <div className="space-y-1">
                <Label className="font-semibold">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Force email check before login.</p>
              </div>
              <Switch checked={requireEmail} onCheckedChange={setRequireEmail} />
            </div>

            <div className="flex items-start justify-between space-x-4 rounded-md border p-4">
              <div className="space-y-1">
                <Label className="font-semibold">Enable MFA (Beta)</Label>
                <p className="text-sm text-muted-foreground">Enforce Multi-Factor Auth.</p>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Session Management</h4>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Access Token Lifetime</Label>
                <Select value={accessTokenVal} onValueChange={setAccessTokenVal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">5 Minutes</SelectItem>
                    <SelectItem value="900">15 Minutes (Default)</SelectItem>
                    <SelectItem value="3600">1 Hour</SelectItem>
                    <SelectItem value="14400">4 Hours</SelectItem>
                    <SelectItem value="86400">24 Hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Short-lived token for API access.</p>
              </div>

              <div className="space-y-2">
                <Label>Refresh Token Lifetime</Label>
                <Select value={refreshTokenVal} onValueChange={setRefreshTokenVal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="86400">24 Hours</SelectItem>
                    <SelectItem value="604800">7 Days (Default)</SelectItem>
                    <SelectItem value="2592000">30 Days</SelectItem>
                    <SelectItem value="7776000">90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Long-lived token to maintain session.</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 4. Active Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Active Providers
          </CardTitle>
          <CardDescription>
            Select which identity providers are enabled for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleProvider(p.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Button variant="link" asChild className="text-primary">
              <Link to={`/projects/${project._id}/providers`}>Configure Advanced Provider Settings &rarr;</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-3 flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {hasChanges ? "You have unsaved changes" : "All systems normal"}
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              size="lg"
              className="shadow-lg"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 5. Danger Zone */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-background">
            <div>
              <h4 className="font-semibold text-red-950">Delete Project</h4>
              <p className="text-sm text-muted-foreground">Permanently delete this project and all data.</p>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <DialogTitle className="text-center">Delete Project?</DialogTitle>
                  <DialogDescription className="text-center">
                    This action cannot be undone. Type <strong>{project.name}</strong> to confirm.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <Label htmlFor="confirm" className="sr-only">Project name</Label>
                  <Input
                    id="confirm"
                    placeholder={project.name}
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    className="text-center"
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={confirmName !== project.name || deleting}
                    onClick={handleDeleteProject}
                    className="gap-2"
                  >
                    {deleting ? "Deleting..." : "Delete Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
