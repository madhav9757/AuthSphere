import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
  TrendingUp,
  Clock,
  Zap,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Loader2
} from "lucide-react";

import { getDashboardStats } from "@/api/DeveloperAPI";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import { format, formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEndUsers: 0,
    recentUsers: []
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
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute h-16 w-16 animate-pulse rounded-full bg-blue-100/50 dark:bg-blue-900/20"></div>
        </div>
        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">Initializing Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 dark:bg-slate-900/50">
      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
              <div className="bg-white border border-border/40 p-1 rounded-lg shadow-sm">
                <img src="/assets/logo.png" alt="Logo" className="h-4 w-4 object-contain mix-blend-multiply" />
              </div>
              Live System Status
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Welcome back, {user.username.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Manage your identity infrastructure and monitor user activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full shadow-sm bg-background border-border" onClick={() => navigate('/docs')}>
              <Code2 className="mr-2 h-4 w-4" /> API Docs
            </Button>
            <Button className="rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 bg-blue-600 hover:bg-blue-700 transition-all font-bold" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Projects", val: stats.totalProjects, icon: FolderKanban, color: "blue", sub: "Workspaces" },
            { label: "Total Users", val: stats.totalEndUsers, icon: Users, color: "indigo", sub: "Identities Managed" },
            { label: "Daily Active", val: Math.round(stats.totalEndUsers * 0.4), icon: Activity, color: "violet", sub: "Simulated load" },
            { label: "Latency", val: "124ms", icon: Zap, color: "amber", sub: "P99 Response" },
          ].map((s, i) => (
            <Card key={i} className="border-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-muted text-foreground">
                      <s.icon size={20} className={`text-${s.color}-500 dark:text-${s.color}-400`} />
                    </div>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-mono text-[10px]">LIVE</Badge>
                  </div>
                  <p className="text-3xl font-black text-foreground tracking-tight">
                    {statsLoading ? "..." : s.val}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground mt-1">{s.label}</p>
                </div>
                <div className={`h-1 w-full bg-${s.color}-500 opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN CONTENT TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-fit h-12 p-1 bg-muted/50 backdrop-blur rounded-full border border-border">
            <TabsTrigger value="overview" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Projects</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Users</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Logs</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left Column: Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-border shadow-sm bg-card overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-foreground">Latest Authentication Events</CardTitle>
                      <CardDescription>Real-time signup stream across all projects.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 font-bold" onClick={() => setActiveTab('users')}>
                      View All <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-0">
                      {stats.recentUsers.length > 0 ? (
                        stats.recentUsers.map((user, idx) => (
                          <div key={user._id}>
                            <div className="group flex items-center justify-between py-4 hover:bg-muted/50 transition-colors px-2 rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-xs ring-2 ring-background">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-foreground text-sm">{user.username}</p>
                                  <p className="text-xs text-muted-foreground font-medium">Project: <span className="text-blue-600 dark:text-blue-400">{user.projectId.name}</span></p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="text-[10px] font-mono mb-1 border-border">{user.email}</Badge>
                                <p className="text-[10px] text-muted-foreground font-bold flex items-center justify-end gap-1 uppercase">
                                  <Clock size={10} /> {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            {idx !== stats.recentUsers.length - 1 && <Separator className="bg-border" />}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20">
                          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                            <Activity className="text-muted-foreground/30" size={24} />
                          </div>
                          <p className="font-bold text-foreground">Waiting for first user...</p>
                          <p className="text-sm text-muted-foreground mt-1">Deploy your SDK to start seeing live auth events.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Actions & Progress */}
              <div className="space-y-6">
                <Card className="border-none bg-blue-600 text-white shadow-xl shadow-blue-500/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Start Guide</CardTitle>
                    <CardDescription className="text-blue-100">4 steps to production readiness.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { t: "Initialize Project", d: "Configure callback URIs" },
                      { t: "Install AuthSphere SDK", d: "@authsphere/react-sdk" },
                      { t: "Generate API Keys", d: "Public & Secret pair" },
                      { t: "User Login Flow", d: "Test social providers" }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 group cursor-default">
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black border border-white/20">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none">{step.t}</p>
                          <p className="text-[11px] text-blue-100/80 mt-1">{step.d}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="secondary" className="w-full mt-4 font-bold rounded-lg shadow-sm bg-white text-blue-600 hover:bg-slate-50 transition-colors" onClick={() => navigate('/docs')}>
                      Continue Setup
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                      <ShieldCheck size={14} className="text-emerald-500" /> Security Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">JWT Encryption</span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 transition-colors border-none text-[9px] font-black">ACTIVE</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl border border-amber-500/20">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Key Rotation</span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Due in 4 days</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ProjectList />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border shadow-sm bg-card overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle className="text-xl text-foreground">Identity Manager</CardTitle>
                <CardDescription>Global view of every user authenticated via your infrastructure.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] border-b border-border bg-muted/20">
                          <th className="py-5 px-6 font-black">Identity</th>
                          <th className="py-5 px-6 font-black">Contact Email</th>
                          <th className="py-5 px-6 font-black">Project Origin</th>
                          <th className="py-5 px-6 font-black text-right">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/30 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                                  {user.username.charAt(0)}
                                </div>
                                <span className="font-bold text-foreground text-sm">{user.username}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded border border-border">{user.email}</span>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant="secondary" className="font-bold text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none px-3 py-1 uppercase tracking-tighter">
                                {user.projectId.name}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="text-xs font-bold text-muted-foreground">
                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-32">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted/30" />
                    <h3 className="text-lg font-bold text-foreground">No End Users Detected</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                      Once users sign up through your integrated applications, they will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border shadow-sm bg-card overflow-hidden">
              <CardContent className="py-40 text-center">
                <div className="h-20 w-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-10 w-10 text-orange-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-foreground">Event Stream Coming Soon</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-3 font-medium">
                  We're building a real-time WebSocket stream to help you debug and monitor authentication events as they happen.
                </p>
                <Button className="mt-8 rounded-full border-border font-bold hover:bg-muted" variant="outline">Request Beta Access</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CREATE PROJECT MODAL */}
        <CreateProjectModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
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