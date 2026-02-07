import { useState, useMemo } from "react";
import {
  Save,
  Settings,
  Plus,
  Trash2,
  Globe,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Clock,
  Mail,
} from "lucide-react";
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
import ProvidersPage from "@/pages/project/ProvidersPage";

const ProjectSettings = ({ project, onUpdated }) => {
  const navigate = useNavigate();

  // --- STATE ---

  // General
  const [name, setName] = useState(project.name);
  const [logoUrl, setLogoUrl] = useState(project.logoUrl || "");

  // URLs
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""],
  );
  const [allowedOrigins, setAllowedOrigins] = useState(
    project.allowedOrigins?.length ? project.allowedOrigins : [""],
  );

  // Security & Policies
  const [requireEmail, setRequireEmail] = useState(
    project.settings?.requireEmailVerification || false,
  );
  const [mfaEnabled, setMfaEnabled] = useState(
    project.settings?.mfaEnabled || false,
  );

  // Tokens (Defaults to 15m and 7d if missing)
  const [accessTokenVal, setAccessTokenVal] = useState(
    project.settings?.tokenValidity?.accessToken?.toString() || "900",
  );
  const [refreshTokenVal, setRefreshTokenVal] = useState(
    project.settings?.tokenValidity?.refreshToken?.toString() || "604800",
  );

  // Brute Force Protection
  const [bruteForceEnabled, setBruteForceEnabled] = useState(
    project.settings?.bruteForceProtection?.enabled ?? true,
  );
  const [maxAttempts, setMaxAttempts] = useState(
    project.settings?.bruteForceProtection?.maxAttempts?.toString() || "5",
  );
  const [lockoutDuration, setLockoutDuration] = useState(
    project.settings?.bruteForceProtection?.lockoutDuration?.toString() ||
      "900",
  );

  // Providers
  const [providers, setProviders] = useState(() => {
    const map = {};
    allProvidersList.forEach((p) => {
      map[p.id] = project.providers?.includes(p.id) ?? false;
    });
    return map;
  });

  // --- UI STATE ---
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const sections = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      description: "Basic project info",
    },
    {
      id: "auth",
      label: "Auth Flow",
      icon: Globe,
      description: "Redirects & Origins",
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      description: "MFA & Session",
    },
    {
      id: "providers",
      label: "Identity Providers",
      icon: ShieldCheck,
      description: "Active authentication methods",
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: AlertTriangle,
      description: "Delete project",
      variant: "danger",
    },
  ];

  const activeProvidersList = useMemo(() => {
    return allProvidersList.filter((p) => project.providers?.includes(p.id));
  }, [project.providers]);

  // --- CHANGE DETECTION ---
  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers)
      .filter((p) => providers[p])
      .sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      logoUrl !== (project.logoUrl || "") ||
      JSON.stringify(redirectUris.filter(Boolean)) !==
        JSON.stringify(project.redirectUris || []) ||
      JSON.stringify(allowedOrigins.filter(Boolean)) !==
        JSON.stringify(project.allowedOrigins || []) ||
      requireEmail !== (project.settings?.requireEmailVerification || false) ||
      mfaEnabled !== (project.settings?.mfaEnabled || false) ||
      accessTokenVal !==
        (project.settings?.tokenValidity?.accessToken?.toString() || "900") ||
      refreshTokenVal !==
        (project.settings?.tokenValidity?.refreshToken?.toString() ||
          "604800") ||
      bruteForceEnabled !==
        (project.settings?.bruteForceProtection?.enabled ?? true) ||
      maxAttempts !==
        (project.settings?.bruteForceProtection?.maxAttempts?.toString() ||
          "5") ||
      lockoutDuration !==
        (project.settings?.bruteForceProtection?.lockoutDuration?.toString() ||
          "900") ||
      JSON.stringify(activeProviders) !== JSON.stringify(originalProviders)
    );
  }, [
    name,
    logoUrl,
    redirectUris,
    allowedOrigins,
    requireEmail,
    mfaEnabled,
    accessTokenVal,
    refreshTokenVal,
    bruteForceEnabled,
    maxAttempts,
    lockoutDuration,
    providers,
    project,
  ]);

  // --- HELPERS ---
  const updateList = (list, setList, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };
  const addToList = (list, setList) => setList([...list, ""]);
  const removeFromList = (list, setList, index) =>
    setList(list.filter((_, i) => i !== index));

  const toggleProvider = (id) => {
    const provider = allProvidersList.find((p) => p.id === id);
    if (provider?.status !== "ready") return;
    setProviders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- HANDLERS ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const activeProviders = Object.keys(providers).filter(
        (p) => providers[p],
      );

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
          bruteForceProtection: {
            enabled: bruteForceEnabled,
            maxAttempts: parseInt(maxAttempts),
            lockoutDuration: parseInt(lockoutDuration),
          },
          tokenValidity: {
            accessToken: parseInt(accessTokenVal),
            refreshToken: parseInt(refreshTokenVal),
          },
        },
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
    <div className="flex flex-col lg:flex-row gap-12 items-start mt-4">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
        <div className="hidden lg:block mb-8 px-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Project Settings
          </p>
        </div>

        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar lg:border-r lg:pr-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap lg:w-full group ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]"
                    : section.id === "danger"
                      ? "text-red-500 hover:bg-red-500/5 hover:text-red-600"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 space-y-8 min-w-0 pb-24">
        {activeSection === "general" && (
          <Card className="border-none shadow-sm bg-card/50">
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
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL (Optional)</Label>
                  <Input
                    id="logo"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://myapp.com/logo.png"
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project ID</Label>
                <div className="p-3 bg-muted/50 rounded-xl border font-mono text-xs text-muted-foreground select-all flex justify-between items-center group">
                  {project._id}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-widest text-primary">
                    Click to select
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "auth" && (
          <Card className="border-none shadow-sm bg-card/50">
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
                <p className="text-sm text-muted-foreground">
                  Callbacks after successful login.
                </p>
                <div className="space-y-2">
                  {redirectUris.map((uri, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://app.com/callback"
                        value={uri}
                        onChange={(e) =>
                          updateList(
                            redirectUris,
                            setRedirectUris,
                            index,
                            e.target.value,
                          )
                        }
                        className="font-mono text-sm bg-background/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeFromList(redirectUris, setRedirectUris, index)
                        }
                        disabled={redirectUris.length === 1}
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToList(redirectUris, setRedirectUris)}
                    className="gap-2 border-dashed"
                  >
                    <Plus className="h-4 w-4" /> Add URI
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Allowed Origins */}
              <div className="space-y-3">
                <Label>Allowed Web Origins (CORS)</Label>
                <p className="text-sm text-muted-foreground">
                  Domains allowed to make API requests.
                </p>
                <div className="space-y-2">
                  {allowedOrigins.map((origin, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://myapp.com"
                        value={origin}
                        onChange={(e) =>
                          updateList(
                            allowedOrigins,
                            setAllowedOrigins,
                            index,
                            e.target.value,
                          )
                        }
                        className="font-mono text-sm bg-background/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeFromList(
                            allowedOrigins,
                            setAllowedOrigins,
                            index,
                          )
                        }
                        disabled={
                          allowedOrigins.length === 1 &&
                          allowedOrigins[0] === ""
                        }
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToList(allowedOrigins, setAllowedOrigins)}
                    className="gap-2 border-dashed"
                  >
                    <Plus className="h-4 w-4" /> Add Origin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "security" && (
          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="h-5 w-5 text-primary" />
                Security Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start justify-between space-x-4 rounded-xl border p-4 bg-background/50 transition-colors hover:border-primary/50">
                  <div className="space-y-1">
                    <Label className="font-semibold">
                      Require Email Verification
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Force email check before login.
                    </p>
                  </div>
                  <Switch
                    checked={requireEmail}
                    onCheckedChange={setRequireEmail}
                  />
                </div>

                <div className="flex items-start justify-between space-x-4 rounded-xl border p-4 bg-background/50 transition-colors hover:border-primary/50">
                  <div className="space-y-1">
                    <Label className="font-semibold">Enable MFA (Beta)</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce Multi-Factor Auth.
                    </p>
                  </div>
                  <Switch
                    checked={mfaEnabled}
                    onCheckedChange={setMfaEnabled}
                  />
                </div>
              </div>

              {requireEmail && (
                <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">
                        Email Verification is Active
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Customize branding, logo, and colors for emails.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 bg-background/50"
                  >
                    <Link to={`/projects/${project._id}/email-customization`}>
                      <Settings className="h-4 w-4" />
                      Customize Email
                    </Link>
                  </Button>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Session Management</h4>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Access Token Lifetime</Label>
                    <Select
                      value={accessTokenVal}
                      onValueChange={setAccessTokenVal}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">5 Minutes</SelectItem>
                        <SelectItem value="900">
                          15 Minutes (Default)
                        </SelectItem>
                        <SelectItem value="3600">1 Hour</SelectItem>
                        <SelectItem value="14400">4 Hours</SelectItem>
                        <SelectItem value="86400">24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Short-lived token for API access.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Refresh Token Lifetime</Label>
                    <Select
                      value={refreshTokenVal}
                      onValueChange={setRefreshTokenVal}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="86400">24 Hours</SelectItem>
                        <SelectItem value="604800">7 Days (Default)</SelectItem>
                        <SelectItem value="2592000">30 Days</SelectItem>
                        <SelectItem value="7776000">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Long-lived token to maintain session.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* BRUTE FORCE PROTECTION */}
              <div className="space-y-6">
                <div className="flex items-start justify-between space-x-4 rounded-xl border p-4 bg-background/50 transition-colors hover:border-primary/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <Label className="font-semibold text-base">
                        Brute-Force Protection
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Prevent automated attacks by locking accounts after failed
                      attempts.
                    </p>
                  </div>
                  <Switch
                    checked={bruteForceEnabled}
                    onCheckedChange={setBruteForceEnabled}
                  />
                </div>

                {bruteForceEnabled && (
                  <div className="grid gap-6 md:grid-cols-2 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="space-y-2">
                      <Label className="text-sm">Max Login Attempts</Label>
                      <Select
                        value={maxAttempts}
                        onValueChange={setMaxAttempts}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Attempts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Attempts</SelectItem>
                          <SelectItem value="5">
                            5 Attempts (Standard)
                          </SelectItem>
                          <SelectItem value="10">
                            10 Attempts (Relaxed)
                          </SelectItem>
                          <SelectItem value="20">20 Attempts</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">
                        Account will lock after reaching this threshold.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Lockout Duration</Label>
                      <Select
                        value={lockoutDuration}
                        onValueChange={setLockoutDuration}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">5 Minutes</SelectItem>
                          <SelectItem value="1800">30 Minutes</SelectItem>
                          <SelectItem value="3600">1 Hour</SelectItem>
                          <SelectItem value="86400">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">
                        How long the user must wait before trying again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "providers" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Active Providers
              </h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                The following methods are currently enabled for your project. To
                add more or configure settings, visit the main{" "}
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // This is a bit hacky since we are inside a component that doesn't know about the parent's tabs
                    // but usually in this context, the user just clicks the 'Catalog' tab above.
                    // We'll just provide a textual hint.
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  Identity Catalog
                </Link>{" "}
                tab.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {activeProvidersList.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center justify-center p-4 border rounded-xl bg-background/50"
                >
                  <div className="h-10 w-10 mb-2 rounded-lg bg-white border flex items-center justify-center p-2 shadow-sm">
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-center">
                    {p.name}
                  </span>
                  <span className="text-[9px] text-primary font-bold uppercase mt-1">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "danger" && (
          <Card className="border-red-500/20 bg-red-500/5 shadow-inner">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-900/60">
                Critical actions that cannot be undone. Be careful.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-200 rounded-xl bg-background/50 gap-4">
                <div>
                  <h4 className="font-semibold text-red-950">Delete Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this project and all its data including
                    users and settings.
                  </p>
                </div>

                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2 shadow-lg shadow-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                      <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                      <DialogTitle className="text-center text-xl">
                        Delete Project?
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        This action <strong>cannot be undone</strong>. All user
                        data, credentials, and settings will be purged
                        immediately. Type <strong>{project.name}</strong> below
                        to confirm.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <Label htmlFor="confirm" className="sr-only">
                        Project name
                      </Label>
                      <Input
                        id="confirm"
                        placeholder={project.name}
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        className="text-center h-12 text-lg font-semibold"
                      />
                    </div>

                    <DialogFooter className="sm:flex-col gap-2">
                      <Button
                        variant="destructive"
                        disabled={confirmName !== project.name || deleting}
                        onClick={handleDeleteProject}
                        className="w-full h-11"
                      >
                        {deleting
                          ? "Deleting..."
                          : "I understand the consequences, delete this project"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 z-30">
        <div
          className={`flex items-center gap-4 p-2 pl-6 rounded-2xl border bg-background/80 backdrop-blur-md shadow-2xl transition-all duration-500 mt-10 ${hasChanges ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-12 pointer-events-none"}`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Unsaved Changes</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              You have pending modifications
            </span>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="rounded-xl px-8 shadow-lg shadow-primary/20 h-12"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
