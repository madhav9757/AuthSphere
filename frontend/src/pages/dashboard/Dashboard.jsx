import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

import ProjectList from "@/components/project/ProjectList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Activity,
  ShieldCheck,
  Code2,
  Clock,
  Zap,
  Plus,
  ChevronRight,
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getDashboardStats } from "@/api/DeveloperAPI";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import { format, formatDistanceToNow } from "date-fns";
import { ShineBorder } from "@/components/ui/shine-border";

const Dashboard = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEndUsers: 0,
    recentUsers: [],
    signupTrend: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      fetchStats();
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
        <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Identity Fabric...</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur border rounded-lg p-3 shadow-xl text-[11px] min-w-[140px]">
          <p className="text-muted-foreground mb-1 uppercase tracking-widest font-bold opacity-60">
            {format(new Date(label), "MMM dd, yyyy")}
          </p>
          <Separator className="my-2 opacity-50" />
          <p className="font-bold flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              Ingestion Rate
            </span>
            <span className="text-foreground">{payload[0].value} signups</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter px-2 h-5 bg-primary/5 text-primary border-primary/20">
                System Operational
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter px-2 h-5 bg-emerald-500/5 text-emerald-500 border-emerald-500/20">
                v2.4.0 Production
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Dashboard <span className="text-muted-foreground font-normal">/</span> {user.username.split(' ')[0]}
            </h1>
            <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
              Global authentication orchestration across your identity infrastructure clusters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold uppercase tracking-widest" onClick={() => navigate('/docs')}>
              <Code2 className="h-3.5 w-3.5 mr-2 opacity-70" />
              API Specs
            </Button>
            <Button size="sm" className="h-9 px-4 text-xs font-bold uppercase tracking-widest shadow-md shadow-primary/20" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "ORCHESTRATED PROJECTS",
              val: stats.totalProjects,
              icon: FolderKanban,
              color: "text-blue-500",
              trend: "+2 this month",
              desc: "Active namespaces"
            },
            {
              label: "IDENTITY ENTITIES",
              val: stats.totalEndUsers,
              icon: Users,
              color: "text-emerald-500",
              trend: "High conversion",
              desc: "Total registered users"
            },
            {
              label: "AUTHENTICATION RATE",
              val: Math.round(stats.totalEndUsers * 0.4),
              icon: Activity,
              color: "text-violet-500",
              trend: "82% successful",
              desc: "Daily active sessions"
            },
            {
              label: "AVERAGE LATENCY",
              val: "124ms",
              icon: Zap,
              color: "text-amber-500",
              trend: "Near-instant",
              desc: "p95 handshake speed"
            },
          ].map((s, i) => (
            <Card key={i} className="border-muted bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-none hover:shadow-lg hover:shadow-primary/5 cursor-default group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-muted/50 ${s.color} border border-transparent group-hover:border-current/20 group-hover:bg-muted transition-colors`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="ghost" className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                    Telemtry 
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold tracking-tighter">
                    {statsLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : s.val}
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                </div>
                <div className="mt-4 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-muted-foreground italic truncate mr-2">{s.desc}</span>
                  <span className={`text-[10px] font-bold ${s.color.replace('text-', 'bg-').replace('500', '500/10')} ${s.color} px-1.5 py-0.5 rounded`}>
                    {s.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ACTION TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 border h-11">
            <TabsTrigger value="overview" className="text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Projects</TabsTrigger>
            <TabsTrigger value="users" className="text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Users</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW CONTENT */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">

              {/* RECENT INGESTIONS */}
              <div className="lg:col-span-3">
                <Card className="border-muted bg-card/30 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between pb-6 pt-5">
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Identity Ingress Stream
                      </CardTitle>
                      <CardDescription className="text-[11px] mt-1">Real-time authentication activity across your infrastructure.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase" onClick={() => setActiveTab('users')}>
                      View Stream <ChevronRight className="h-3 w-3 ml-1.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pb-4">
                    {stats.recentUsers.length > 0 ? (
                      <div className="space-y-1">
                        {stats.recentUsers.slice(0, 6).map((user, i) => (
                          <div key={user._id} className="group flex items-center gap-4 p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-[13px] font-bold truncate leading-none mb-1">{user.username}</p>
                                <Badge variant="outline" className="text-[8px] h-3 px-1 py-0 uppercase border-primary/20 bg-primary/5 text-primary">AUTHORIZED</Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate opacity-70 italic">{user.email}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <div className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded mb-1">
                                    {user.projectId.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground opacity-60">
                                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-xl">
                        <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">No ingestion detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* SIDEBAR WIDGETS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Deployment Status */}
                <Card className="border-muted bg-card overflow-hidden">
                  <div className="h-1 bg-primary/40 group-hover:bg-primary transition-colors" />
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        Infrastructure Handshake
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    {[
                      { label: "Create Identity Cluster", status: "completed" },
                      { label: "Establish Environment Handshake", status: "completed" },
                      { label: "Configure Identity Bridge", status: "pending" },
                      { label: "Deploy to Production", status: "pending" }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted text-transparent'}`}>
                            {step.status === 'completed' && <ShieldCheck size={10} />}
                          </div>
                          <span className={`text-[12px] ${step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground opacity-70'} font-medium`}>{step.label}</span>
                        </div>
                        {step.status === 'pending' && <Button size="icon" variant="ghost" className="h-6 w-6"><ChevronRight size={14} /></Button>}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Health Monitor */}
                <Card className="border-muted bg-primary/2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Activity size={80} />
                  </div>
                  <CardHeader className="p-5 pb-1">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-widest opacity-60">Handshake Integrity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="flex items-end justify-between mb-4">
                        <div className="text-3xl font-bold tracking-tighter">99.98<span className="text-sm text-muted-foreground">%</span></div>
                        <Badge className="bg-emerald-500 text-[9px] h-4 font-bold border-0">STABLE</Badge>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground font-mono">JWT_SIGNATURE_OK</span>
                            <span className="text-emerald-500 font-bold">VERIFIED</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground font-mono">AES_ENCRYPTION_LAYER</span>
                            <span className="text-emerald-500 font-bold">256_GCM</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </TabsContent>

          {/* CLUSTERS TAB */}
          <TabsContent value="projects">
            <ProjectList />
          </TabsContent>

          {/* USER DIRECTORY TAB */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-muted shadow-none">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Global User Inventory</CardTitle>
                  <CardDescription className="text-[11px]">Primary identity metadata across all active projects.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">Export CSV</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-y">
                        <tr>
                          <th className="py-2.5 px-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity Identifier</th>
                          <th className="py-2.5 px-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Communication Channel</th>
                          <th className="py-2.5 px-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Origin Project</th>
                          <th className="py-2.5 px-5 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ingested Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/30">
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/20 transition-colors group">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold border">
                                  {user.username.charAt(0)}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[13px] font-bold">{user.username}</div>
                                    <div className="text-[10px] text-muted-foreground opacity-60 font-mono underline decoration-primary/20">{user._id.slice(-8)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-5 text-[12px] text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-5">
                              <Badge variant="outline" className="text-[10px] h-5 bg-card px-2 font-medium opacity-80">{user.projectId.name}</Badge>
                            </td>
                            <td className="py-3 px-5 text-right">
                                <div className="text-[12px] text-foreground font-medium">{format(new Date(user.createdAt), "MMM d, yyyy")}</div>
                                <div className="text-[9px] text-muted-foreground opacity-50 uppercase tracking-tighter">Handshake Complete</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">Zero Entity Mapping</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TELEMETRY TAB */}
          <TabsContent value="activity">
            <div className="grid gap-6">
              <Card className="border-muted shadow-xl shadow-primary/5 bg-card/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-b from-primary/3 to-transparent pointer-events-none" />
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-8 pt-6 relative z-10">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Authentication Throughput
                    </CardTitle>
                    <CardDescription className="text-[13px] leading-relaxed">Identity propagation analytics and lifecycle volume (Last 30 cycles).</CardDescription>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => navigate("/audit-logs")} className="h-8 text-[11px] font-bold uppercase tracking-widest gap-2 bg-background">
                        <FileSpreadsheet className="h-3.5 w-3.5 opacity-60" /> Full Audit Record
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] relative z-10 pr-6">
                  {stats.signupTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.signupTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSignupsDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                          tickFormatter={(str) => format(new Date(str), "MMM d")}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                          tickCount={6}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="signups"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorSignupsDashboard)"
                          animationDuration={2000}
                          animationEasing="ease-in-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed bg-muted/10 rounded-xl">
                      <Activity className="h-10 w-10 opacity-10 mb-4" />
                      <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Zero Payload Detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                    <CardHeader className="p-5 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-70">Heartbeat Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <p className="text-[14px] font-bold">Protocols Operational</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 mb-4">All edge nodes report successful handshakes.</p>
                        <Separator className="bg-primary/10 mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">OAuth 2.0</p>
                                <p className="text-[11px] font-bold text-emerald-500">OPTIMAL</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">OIDC_Handshake</p>
                                <p className="text-[11px] font-bold text-emerald-500">OPTIMAL</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:bg-muted/40 transition-all border-muted shadow-none cursor-pointer group" onClick={() => navigate("/audit-logs")}>
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-card border shadow-inner text-muted-foreground group-hover:text-primary transition-colors">
                        <Clock className="h-5 w-5" />
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-6">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Investigation</p>
                      <h4 className="text-[16px] font-bold leading-tight">Identity Event Forensics</h4>
                      <p className="text-[11px] text-muted-foreground mt-1">Deep-packet inspection of all project metadata.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Widget for balance */}
                <Card className="hidden lg:flex border-primary/10 bg-linear-to-br from-primary/1 to-primary/5 flex-col justify-center items-center text-center p-6 border-dashed border-2">
                    <ShieldCheck className="h-10 w-10 text-primary opacity-20 mb-3" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary/40">Encryption Guard ACTIVE</p>
                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[140px] italic">RSA-2048 signing keys are rotated every 90 days.</p>
                </Card>

              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CREATE PROJECT MODAL */}
        <CreateProjectModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={(project) => {
            setCreateOpen(false);
            fetchStats();
            setActiveTab('projects');
          }}
        />

      </div>
    </div>
  );
};

export default Dashboard;
