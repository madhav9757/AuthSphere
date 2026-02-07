import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  Save,
  Loader2,
  Globe,
  Zap,
  Lock,
  Cpu,
  Terminal,
  Info,
  ExternalLink,
  Layers,
  CheckCircle2,
  Activity,
  AlertCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getProject,
  updateProject,
  getConfiguredProviders,
} from "@/api/ProjectAPI";
import { allProvidersList } from "@/lib/providers";

const ProvidersPage = ({ embedded = false, onBack, onUpdated }) => {
  const { projectId: routeProjectId } = useParams();
  const projectId = routeProjectId;
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState({});
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [backendConfig, setBackendConfig] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(projectId);
        if (res.success) {
          setProject(res.data);
          const providerMap = {};
          res.data.providers?.forEach((p) => {
            providerMap[p] = true;
          });
          setSelectedProviders(providerMap);
        }

        const configRes = await getConfiguredProviders(projectId);
        if (configRes.success) {
          setBackendConfig(configRes.data);
        }
      } catch (err) {
        toast.error("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const filteredProviders = useMemo(() => {
    return allProvidersList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const activeProviders = filteredProviders.filter(
    (p) => p.status !== "coming_soon" && backendConfig[p.id]?.isConfigured,
  );
  const setupProviders = filteredProviders.filter(
    (p) => p.status !== "coming_soon" && !backendConfig[p.id]?.isConfigured,
  );
  const upcomingProviders = filteredProviders.filter(
    (p) => p.status === "coming_soon",
  );

  const toggleProvider = (id) => {
    const provider = allProvidersList.find((p) => p.id === id);
    if (provider?.status === "coming_soon") return;
    setSelectedProviders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const activeKeys = Object.keys(selectedProviders).filter(
        (p) => selectedProviders[p],
      );

      if (activeKeys.length === 0) {
        toast.error("At least one provider must be enabled");
        return;
      }

      const res = await updateProject(projectId, {
        providers: activeKeys,
      });

      if (res?.success) {
        toast.success("Identity Catalog synchronized");
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      toast.error("Failed to update providers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className={`${embedded ? "bg-transparent" : "min-h-screen bg-muted/20"} pb-20`}
    >
      {/* STICKY HEADER */}
      {!embedded && (
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto py-4 px-6 max-w-[1600px] flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onBack ? onBack() : navigate(`/projects/${projectId}`)
                }
                className="rounded-xl h-10 w-10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Identity Catalog
                </h1>
                <p className="text-xs text-muted-foreground">
                  Managing{" "}
                  <span className="text-foreground font-semibold">
                    {project?.name}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search 50+ providers by name or technology..."
                className="pl-10 h-10 bg-muted/40 border-none rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sync Changes
            </Button>
          </div>
        </div>
      )}

      <div
        className={`${embedded ? "py-2" : "container mx-auto py-8 px-6 max-w-[1800px]"} space-y-12`}
      >
        {embedded && (
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog..."
                className="pl-9 h-9 bg-background border rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-4 rounded-md"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )}
        {/* SECTION 1: LIVE & READY */}
        {activeProviders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-primary/5 pb-2">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Ready to Integrate
              </h3>
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                {activeProviders.length} active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {activeProviders.map((p) => (
                <ProviderCard
                  key={p.id}
                  p={p}
                  isSelected={selectedProviders[p.id]}
                  isConfigured={true}
                  backendMessage={backendConfig[p.id]?.message}
                  onToggle={toggleProvider}
                  onViewDocs={setSelectedSpec}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SETUP REQUIRED */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Available Catalog
            </h3>
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              {setupProviders.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {setupProviders.map((p) => (
              <ProviderCard
                key={p.id}
                p={p}
                isSelected={selectedProviders[p.id]}
                isConfigured={false}
                backendMessage={backendConfig[p.id]?.message}
                onToggle={toggleProvider}
                onViewDocs={setSelectedSpec}
              />
            ))}
          </div>
        </div>

        {/* SECTION 3: ROADMAP/COMING SOON */}
        <div className="space-y-4 pb-20">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2 border-dashed">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Upcoming
            </h3>
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              roadmap
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 opacity-60">
            {upcomingProviders.map((p) => (
              <ProviderCard
                key={p.id}
                p={p}
                isSelected={false}
                onToggle={toggleProvider}
                onViewDocs={setSelectedSpec}
                isUpcoming
              />
            ))}
          </div>
        </div>
      </div>

      {/* SPECIFICATION DIALOG (POPUP) */}
      <Dialog
        open={!!selectedSpec}
        onOpenChange={(open) => !open && setSelectedSpec(null)}
      >
        <DialogContent className="max-w-2xl bg-card border-none shadow-2xl p-0 overflow-hidden rounded-2xl">
          {selectedSpec && (
            <div className="flex flex-col text-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded border bg-background flex items-center justify-center p-2">
                    <img
                      src={selectedSpec.logo}
                      alt={selectedSpec.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-semibold">
                      {selectedSpec.name}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      {selectedSpec.status}
                    </p>
                  </div>
                </div>
                <DialogDescription className="text-foreground/80 leading-relaxed">
                  {selectedSpec.description}
                </DialogDescription>
              </div>

              <div className="p-6 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    Technical Specs
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-tighter">
                        Flows
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSpec.flows.map((f) => (
                          <span
                            key={f}
                            className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-tighter">
                        Capabilities
                      </p>
                      <ul className="space-y-0.5">
                        {selectedSpec.capabilities.map((c) => (
                          <li
                            key={c}
                            className="text-xs list-disc list-inside text-muted-foreground"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    Requirements
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-tighter">
                        Env Variables
                      </p>
                      <div className="p-2 border rounded font-mono text-[10px] bg-muted/20">
                        {selectedSpec.env_vars.map((v) => (
                          <div key={v}>AUTH_{v}</div>
                        ))}
                      </div>
                    </div>
                    <div className="p-2 border rounded border-amber-200 bg-amber-50 text-amber-800">
                      <p className="text-[10px] font-semibold uppercase tracking-tighter">
                        Limitations
                      </p>
                      <p className="text-[11px] leading-tight">
                        {selectedSpec.limitations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                  Roadmap
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSpec.future.map((f, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-muted-foreground p-1.5 border rounded"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted/20 border-t flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSpec(null)}
                  className="h-8 px-4 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProviderCard = ({
  p,
  isSelected,
  isConfigured,
  backendMessage,
  onToggle,
  onViewDocs,
  isUpcoming,
}) => {
  return (
    <div
      onClick={() => {
        if (isUpcoming) return;
        if (!isConfigured && !isSelected) {
          toast.error(`${p.name} - Configuration Required`, {
            description:
              backendMessage || "Please add keys to your backend .env.",
          });
          return;
        }
        onToggle(p.id);
      }}
      className={`
                group relative flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer border border-primary/5 rounded-2xl bg-background/20 backdrop-blur-sm
                ${isSelected ? "border-primary/40 ring-1 ring-primary/10 bg-primary/8" : "hover:bg-background/40 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/2 hover:-translate-y-0.5"}
                ${isUpcoming ? "cursor-not-allowed grayscale opacity-50" : ""}
            `}
    >
      {/* Theme Aware Logo Container */}
      <div className="h-10 w-10 mb-3 rounded-lg bg-white border flex items-center justify-center p-2 shadow-sm shrink-0">
        <img
          src={p.logo}
          alt={p.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="hidden only-child:block text-[10px] font-bold text-muted-foreground">
          {p.name.charAt(0)}
        </div>
      </div>

      <div className="text-center min-w-0 w-full">
        <p className="text-[11px] font-semibold truncate leading-none mb-1">
          {p.name}
        </p>
        <div className="flex items-center justify-center gap-1.5 min-h-[14px]">
          {isSelected ? (
            <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
              Active
            </span>
          ) : !isUpcoming && !isConfigured ? (
            <span className="text-[9px] font-medium text-amber-600 uppercase tracking-tighter">
              Setup
            </span>
          ) : (
            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-tighter">
              {isUpcoming ? "soon" : "ready"}
            </span>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      {!isUpcoming && (
        <button
          className="absolute top-1 right-1 p-1 text-muted-foreground/0 group-hover:text-muted-foreground hover:bg-muted rounded-md transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onViewDocs(p);
          }}
        >
          <Info className="h-3 w-3" />
        </button>
      )}

      {/* Selection Marker */}
      {isSelected && (
        <div className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </div>
  );
};

export default ProvidersPage;
