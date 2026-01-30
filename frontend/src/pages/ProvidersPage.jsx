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
    AlertCircle
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
import { getProject, updateProject, getConfiguredProviders } from "@/api/ProjectAPI";
import { allProvidersList } from "@/lib/providers";

const ProvidersPage = () => {
    const { projectId } = useParams();
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
                    res.data.providers?.forEach(p => {
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
        return allProvidersList.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const activeProviders = filteredProviders.filter(p => p.status !== 'coming_soon' && backendConfig[p.id]?.isConfigured);
    const setupProviders = filteredProviders.filter(p => p.status !== 'coming_soon' && !backendConfig[p.id]?.isConfigured);
    const upcomingProviders = filteredProviders.filter(p => p.status === 'coming_soon');

    const toggleProvider = (id) => {
        const provider = allProvidersList.find(p => p.id === id);
        if (provider?.status === 'coming_soon') return;
        setSelectedProviders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const activeKeys = Object.keys(selectedProviders).filter(p => selectedProviders[p]);

            if (activeKeys.length === 0) {
                toast.error("At least one provider must be enabled");
                return;
            }

            const res = await updateProject(projectId, {
                providers: activeKeys,
            });

            if (res?.success) {
                toast.success("Identity Catalog synchronized");
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
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto py-4 px-6 max-w-[1600px] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => navigate(`/projects/${projectId}`)} className="rounded-xl h-10 w-10">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Identity Catalog</h1>
                            <p className="text-xs text-muted-foreground">Managing <span className="text-foreground font-semibold">{project?.name}</span></p>
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

                    <Button onClick={handleSave} disabled={saving} className="h-10 px-6 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Sync Changes
                    </Button>
                </div>
            </div>

            <div className="container mx-auto py-8 px-6 max-w-[1800px] space-y-10">

                {/* SECTION 1: LIVE & READY */}
                {activeProviders.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold">Ready to Integrate</h2>
                                    <p className="text-[11px] text-muted-foreground">Fully configured in backend .env and ready for production.</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-bold px-2">
                                {activeProviders.length} Configured
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
                            {activeProviders.map((p) => (
                                <ProviderSmallCard
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
                    </section>
                )}

                {/* SECTION 2: SETUP REQUIRED */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold">Available Catalog</h2>
                                <p className="text-[11px] text-muted-foreground">Supported providers needing backend configuration (Client ID/Secret).</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20 text-[10px] uppercase font-bold px-2">
                            {setupProviders.length} Available
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
                        {setupProviders.map((p) => (
                            <ProviderSmallCard
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
                </section>

                {/* SECTION 3: ROADMAP/COMING SOON */}
                <section className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b pb-3 border-dashed">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold">Upcoming Platforms</h2>
                                <p className="text-[11px] text-muted-foreground">Roadmapped providers currently in development or testing.</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 text-[10px] uppercase font-bold px-2">
                            {upcomingProviders.length} Coming Soon
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        {upcomingProviders.map((p) => (
                            <ProviderSmallCard
                                key={p.id}
                                p={p}
                                isSelected={false}
                                onToggle={toggleProvider}
                                onViewDocs={setSelectedSpec}
                                isUpcoming
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* SPECIFICATION DIALOG (POPUP) */}
            <Dialog open={!!selectedSpec} onOpenChange={(open) => !open && setSelectedSpec(null)}>
                <DialogContent className="max-w-2xl bg-card border-none shadow-2xl p-0 overflow-hidden rounded-2xl">
                    {selectedSpec && (
                        <div className="flex flex-col">
                            <div className="p-8 bg-primary/5 border-b relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                                    <ShieldCheck size={160} />
                                </div>
                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="h-20 w-20 rounded-2xl bg-white border shadow-xl flex items-center justify-center p-4">
                                        <img src={selectedSpec.logo} alt={selectedSpec.name} className="h-12 w-12 object-contain" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <DialogTitle className="text-2xl font-black tracking-tight">{selectedSpec.name}</DialogTitle>
                                            <Badge variant="outline" className="uppercase text-[10px] font-bold">
                                                {selectedSpec.status}
                                            </Badge>
                                        </div>
                                        <DialogDescription className="text-sm text-foreground/70 leading-relaxed max-w-md">
                                            {selectedSpec.description}
                                        </DialogDescription>
                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary italic">
                                                <Zap className="h-3 w-3" /> {selectedSpec.type}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                                                <Globe className="h-3 w-3" /> {selectedSpec.platforms.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-8 bg-card">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <Layers className="h-3 w-3 text-primary" /> Technical Specs
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground mb-1">Supported Flows</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedSpec.flows.map(f => (
                                                    <Badge key={f} variant="secondary" className="text-[9px] px-1.5 py-0 rounded font-mono">{f}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground mb-1">Capabilities</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {selectedSpec.capabilities.map(c => (
                                                    <div key={c} className="flex items-center gap-2 text-xs">
                                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                        {c}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <Terminal className="h-3 w-3 text-primary" /> Backend Env
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="bg-muted p-3 rounded-xl font-mono text-[10px] space-y-1">
                                            {selectedSpec.env_vars.map(v => (
                                                <div key={v} className="text-muted-foreground">
                                                    AUTH_<span className="text-foreground">{v}</span>=***
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> Limitations
                                            </p>
                                            <p className="text-[11px] text-muted-foreground leading-snug">{selectedSpec.limitations}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-0 space-y-4 bg-card">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                    <Cpu className="h-3 w-3" /> Platform Roadmap
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {selectedSpec.future.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-muted/40 border-t flex justify-end">
                                <Button onClick={() => setSelectedSpec(null)} className="h-9 rounded-lg px-8">Dismiss</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProviderSmallCard = ({ p, isSelected, isConfigured, backendMessage, onToggle, onViewDocs, isUpcoming }) => {
    return (
        <Card
            className={`
                group relative transition-all duration-300 border rounded-xl overflow-hidden cursor-pointer
                ${isSelected ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "bg-card hover:border-primary/40 hover:bg-muted/30"}
                ${isUpcoming ? "cursor-not-allowed" : ""}
                ${!isUpcoming && !isConfigured ? "opacity-80" : ""}
            `}
            onClick={() => {
                if (isUpcoming) return;
                if (!isConfigured && !isSelected) {
                    toast.error(`${p.name} - Configuration Required`, {
                        description: backendMessage || "Please add the required Client ID/Secret to your backend .env file first."
                    });
                    return;
                }
                onToggle(p.id);
            }}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={`
                        h-12 w-12 rounded-lg flex items-center justify-center bg-white border shadow-sm shrink-0 transition-transform group-hover:scale-105
                        ${isSelected ? "border-primary ring-2 ring-primary/10" : ""}
                        ${!isUpcoming && !isConfigured ? "grayscale opacity-50" : ""}
                    `}>
                        <img src={p.logo} alt={p.name} className="h-7 w-7 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-sm truncate uppercase tracking-tight">{p.name}</h3>
                            {!isUpcoming && (
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => {
                                        if (!isConfigured && !isSelected) {
                                            toast.error(`${p.name} - Configuration Required`, {
                                                description: backendMessage || "Please add the required Client ID/Secret to your backend .env file first."
                                            });
                                            return;
                                        }
                                        onToggle(p.id)
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-4 w-4 rounded"
                                    disabled={!isConfigured && !isSelected}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            {isSelected ? (
                                <span className="text-[9px] font-black text-primary uppercase">Active</span>
                            ) : (
                                !isUpcoming && !isConfigured ? (
                                    <span className="text-[9px] font-bold text-amber-600 flex items-center gap-1">
                                        <AlertCircle className="h-2.5 w-2.5" /> No Config
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase">{p.status}</span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
            <div
                className="absolute inset-x-0 bottom-0 py-1.5 px-3 bg-muted/30 border-t flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onViewDocs(p);
                }}
            >
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                    <Info className="h-3 w-3" /> Technical Specs
                </span>
                <ExternalLink className="h-2.5 w-2.5 text-primary" />
            </div>
        </Card>
    );
};

export default ProvidersPage;
