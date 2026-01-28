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
import { ProviderLogos } from "./assets";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""]
  );
  const [providers, setProviders] = useState({
    google: project.providers?.includes("google") ?? false,
    github: project.providers?.includes("github") ?? false,
    discord: project.providers?.includes("discord") ?? false,
    linkedin: project.providers?.includes("linkedin") ?? false,
    gitlab: project.providers?.includes("gitlab") ?? false,
    twitch: project.providers?.includes("twitch") ?? false,
    bitbucket: project.providers?.includes("bitbucket") ?? false,
    microsoft: project.providers?.includes("microsoft") ?? false,
    // Future providers
    facebook: project.providers?.includes("facebook") ?? false,
    twitter: project.providers?.includes("twitter") ?? false,
    slack: project.providers?.includes("slack") ?? false,
    apple: project.providers?.includes("apple") ?? false,
    spotify: project.providers?.includes("spotify") ?? false,
    reddit: project.providers?.includes("reddit") ?? false,
    zoom: project.providers?.includes("zoom") ?? false,
    dropbox: project.providers?.includes("dropbox") ?? false,
    salesforce: project.providers?.includes("salesforce") ?? false,
    hubspot: project.providers?.includes("hubspot") ?? false,
    instagram: project.providers?.includes("instagram") ?? false,
    pinterest: project.providers?.includes("pinterest") ?? false,
    yahoo: project.providers?.includes("yahoo") ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟢 Zero-friction (READY) — free, personal account, OAuth just works
  const allProvidersList = [
    { id: "google", name: "Google", logo: ProviderLogos.google, status: "ready" },
    { id: "github", name: "GitHub", logo: ProviderLogos.github, status: "ready" },
    { id: "discord", name: "Discord", logo: ProviderLogos.discord, status: "ready" },
    { id: "gitlab", name: "GitLab", logo: ProviderLogos.gitlab, status: "ready" },
    { id: "microsoft", name: "Microsoft", logo: ProviderLogos.microsoft, status: "ready" },
    { id: "bitbucket", name: "Bitbucket", logo: ProviderLogos.bitbucket, status: "ready" },
    { id: "reddit", name: "Reddit", logo: ProviderLogos.reddit, status: "ready" },
    { id: "dropbox", name: "Dropbox", logo: ProviderLogos.dropbox, status: "ready" },
    { id: "yahoo", name: "Yahoo", logo: ProviderLogos.yahoo, status: "ready" },
    { id: "twitch", name: "Twitch", logo: ProviderLogos.twitch, status: "ready" },
    { id: "stackexchange", name: "Stack Exchange", logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png", status: "ready" },
    { id: "atlassian", name: "Atlassian", logo: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png", status: "ready" },
    { id: "paypal", name: "PayPal", logo: "https://www.paypalobjects.com/webstatic/icon/pp258.png", status: "ready" },
    { id: "line", name: "LINE", logo: "https://scdn.line-apps.com/n/line_add_friends/logo/LINE_APP.png", status: "ready" },
    { id: "kakao", name: "Kakao", logo: "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/5f9c58c2017800001.png", status: "ready" },
    { id: "naver", name: "Naver", logo: "https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png", status: "ready" },

    // 🟡 Restricted (works but annoying)
    { id: "apple", name: "Apple", logo: ProviderLogos.apple, status: "restricted" },
    { id: "facebook", name: "Facebook", logo: ProviderLogos.facebook, status: "restricted" },
    { id: "twitter", name: "Twitter (X)", logo: ProviderLogos.twitter, status: "restricted" },
    { id: "spotify", name: "Spotify", logo: ProviderLogos.spotify, status: "restricted" },
    { id: "slack", name: "Slack", logo: ProviderLogos.slack, status: "restricted" },
    { id: "zoom", name: "Zoom", logo: ProviderLogos.zoom, status: "restricted" },
    { id: "amazon", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", status: "restricted" },
    { id: "yandex", name: "Yandex", logo: "https://yastatic.net/s3/home/logos/services/yandex.svg", status: "restricted" },
    { id: "vk", name: "VK", logo: "https://vk.com/images/icons/pwa/apple_touch_icon_152.png", status: "restricted" },

    // 🔴 Enterprise / corporate (not dev-friendly)
    { id: "linkedin", name: "LinkedIn", logo: ProviderLogos.linkedin, status: "enterprise" },
    { id: "instagram", name: "Instagram", logo: ProviderLogos.instagram, status: "enterprise" },
    { id: "pinterest", name: "Pinterest", logo: ProviderLogos.pinterest, status: "enterprise" },
    { id: "salesforce", name: "Salesforce", logo: ProviderLogos.salesforce, status: "enterprise" },
    { id: "hubspot", name: "HubSpot", logo: ProviderLogos.hubspot, status: "enterprise" },
    { id: "okta", name: "Okta", logo: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium.png", status: "enterprise" },
    { id: "azuread", name: "Azure AD", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg", status: "enterprise" },
    { id: "workday", name: "Workday", logo: "https://www.workday.com/content/dam/web/images/icons/wd-logo.svg", status: "enterprise" }
  ];

  const filteredProviders = allProvidersList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate ready and upcoming providers
  const readyProviders = filteredProviders.filter(p => p.status === 'ready');
  const upcomingProviders = filteredProviders.filter(p => p.status === 'restricted' || p.status === 'enterprise');

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

        {/* Providers */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Authentication Providers</h4>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enable social login methods for this project.
              </p>
            </div>
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Search 20+ providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-none focus-visible:ring-1"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Ready Providers Section */}
            {readyProviders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {readyProviders.map((p) => {
                  const isDisabled = p.status !== 'ready';

                  const getStatusLabel = () => {
                    if (providers[p.id]) return 'Enabled';
                    if (p.status === 'ready') return '✓ Ready';
                    if (p.status === 'restricted') return '🔜 Coming Soon';
                    if (p.status === 'enterprise') return '🔜 Coming Soon';
                    return 'Available';
                  };

                  const getStatusColor = () => {
                    if (providers[p.id]) return 'text-primary';
                    if (p.status === 'ready') return 'text-green-600 dark:text-green-500';
                    if (p.status === 'restricted') return 'text-amber-600 dark:text-amber-500';
                    if (p.status === 'enterprise') return 'text-purple-600 dark:text-purple-500';
                    return 'text-muted-foreground';
                  };

                  return (
                    <div
                      key={p.id}
                      onClick={() => !isDisabled && toggleProvider(p.id)}
                      className={`
                        flex items-center gap-4 p-4 border rounded-xl transition-all duration-200
                        ${isDisabled
                          ? 'opacity-60 cursor-not-allowed bg-muted/30'
                          : 'cursor-pointer ' + (providers[p.id] ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-muted/50')
                        } 
                        ${!isDisabled && p.color}
                      `}
                      title={isDisabled ? `${p.name} - Coming soon!` : `Click to ${providers[p.id] ? 'disable' : 'enable'} ${p.name}`}
                    >
                      <div className={`h-10 w-10 flex-shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center ${providers[p.id] && !isDisabled ? 'ring-2 ring-primary/20' : ''}`}>
                        <img
                          src={p.logo}
                          alt={p.name}
                          className={`h-full w-full object-contain ${isDisabled ? 'grayscale' : ''}`}
                          onError={(e) => { e.target.src = "https://www.svgrepo.com/show/506680/app-development.svg" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className={`text-[10px] uppercase tracking-wider font-bold ${getStatusColor()}`}>
                          {getStatusLabel()}
                        </p>
                      </div>
                      <Checkbox
                        id={p.id}
                        checked={providers[p.id] || false}
                        onCheckedChange={() => !isDisabled && toggleProvider(p.id)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDisabled}
                        className="rounded-full h-5 w-5"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upcoming Section Divider */}
            {upcomingProviders.length > 0 && (
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-muted-foreground/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    🔜 Upcoming
                  </span>
                </div>
              </div>
            )}

            {/* Upcoming Providers Section */}
            {upcomingProviders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingProviders.map((p) => {
                  const isDisabled = p.status !== 'ready';

                  const getStatusLabel = () => {
                    if (providers[p.id]) return 'Enabled';
                    if (p.status === 'ready') return '✓ Ready';
                    if (p.status === 'restricted') return '🔜 Coming Soon';
                    if (p.status === 'enterprise') return '🔜 Coming Soon';
                    return 'Available';
                  };

                  const getStatusColor = () => {
                    if (providers[p.id]) return 'text-primary';
                    if (p.status === 'ready') return 'text-green-600 dark:text-green-500';
                    if (p.status === 'restricted') return 'text-amber-600 dark:text-amber-500';
                    if (p.status === 'enterprise') return 'text-purple-600 dark:text-purple-500';
                    return 'text-muted-foreground';
                  };

                  return (
                    <div
                      key={p.id}
                      onClick={() => !isDisabled && toggleProvider(p.id)}
                      className={`
                        flex items-center gap-4 p-4 border rounded-xl transition-all duration-200
                        ${isDisabled
                          ? 'opacity-60 cursor-not-allowed bg-muted/30'
                          : 'cursor-pointer ' + (providers[p.id] ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-muted/50')
                        } 
                        ${!isDisabled && p.color}
                      `}
                      title={isDisabled ? `${p.name} - Coming soon!` : `Click to ${providers[p.id] ? 'disable' : 'enable'} ${p.name}`}
                    >
                      <div className={`h-10 w-10 flex-shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center ${providers[p.id] && !isDisabled ? 'ring-2 ring-primary/20' : ''}`}>
                        <img
                          src={p.logo}
                          alt={p.name}
                          className={`h-full w-full object-contain ${isDisabled ? 'grayscale' : ''}`}
                          onError={(e) => { e.target.src = "https://www.svgrepo.com/show/506680/app-development.svg" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className={`text-[10px] uppercase tracking-wider font-bold ${getStatusColor()}`}>
                          {getStatusLabel()}
                        </p>
                      </div>
                      <Checkbox
                        id={p.id}
                        checked={providers[p.id] || false}
                        onCheckedChange={() => !isDisabled && toggleProvider(p.id)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDisabled}
                        className="rounded-full h-5 w-5"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results State */}
            {readyProviders.length === 0 && upcomingProviders.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed rounded-xl">
                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-muted-foreground">No providers found matching "{searchQuery}"</p>
              </div>
            )}
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
