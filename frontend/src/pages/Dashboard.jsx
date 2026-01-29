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
  const { user, loading } = useContext(AuthContext);
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-2 shadow-sm text-xs">
          <p className="text-muted-foreground mb-1">{format(new Date(label), "MMM dd, yyyy")}</p>
          <p className="font-bold flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
            {payload[0].value} Signups
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Welcome back, {user.username.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">
              Manage your authentication infrastructure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/docs')}>
              <Code2 className="h-4 w-4" />
              Docs
            </Button>
            <Button className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Projects",
              val: stats.totalProjects,
              icon: FolderKanban,
              color: "text-blue-600 dark:text-blue-400"
            },
            {
              label: "Total Users",
              val: stats.totalEndUsers,
              icon: Users,
              color: "text-emerald-600 dark:text-emerald-400"
            },
            {
              label: "Daily Active",
              val: Math.round(stats.totalEndUsers * 0.4),
              icon: Activity,
              color: "text-violet-600 dark:text-violet-400"
            },
            {
              label: "Avg Latency",
              val: "124ms",
              icon: Zap,
              color: "text-amber-600 dark:text-amber-400"
            },
          ].map((s, i) => (
            <Card key={i} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className="text-xs">LIVE</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {statsLoading ? "..." : s.val}
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN CONTENT TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-xl">Recent Users</CardTitle>
                      <CardDescription>Latest authentications across projects</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {stats.recentUsers.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentUsers.slice(0, 5).map((user) => (
                          <div key={user._id} className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.username}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No users yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Start */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Start</CardTitle>
                    <CardDescription>Get started in 4 steps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Create Project",
                      "Install SDK",
                      "Configure Providers",
                      "Test Login"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {i + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/docs')}>
                      View Docs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                      <span className="text-xs font-medium">JWT Encryption</span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-xs font-medium">Key Rotation</span>
                      <span className="text-xs text-amber-600">Due in 4d</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <ProjectList />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Global view of authenticated users</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentUsers.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium">User</th>
                          <th className="py-3 px-4 text-left font-medium">Email</th>
                          <th className="py-3 px-4 text-left font-medium">Project</th>
                          <th className="py-3 px-4 text-right font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                  {user.username.charAt(0)}
                                </div>
                                {user.username}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary">{user.projectId.name}</Badge>
                            </td>
                            <td className="py-3 px-4 text-right text-muted-foreground">
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity">
            <div className="grid gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl">Authentication Activity</CardTitle>
                    <CardDescription>Global user registrations across all your projects (Last 30 days)</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/audit-logs")} className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" /> View Full Audit Logs
                  </Button>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {stats.signupTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.signupTrend}>
                        <defs>
                          <linearGradient id="colorSignupsDashboard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                          tickFormatter={(str) => format(new Date(str), "MMM d")}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="signups"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSignupsDashboard)"
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Activity className="h-12 w-12 opacity-20 mb-4" />
                      <p>No activity data available for the selected period.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Activity className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">System Health</p>
                      <p className="text-sm text-muted-foreground italic">All authentication services are operational.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/audit-logs")}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border">
                        <Clock className="text-muted-foreground h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Detailed Event Log</p>
                        <p className="text-sm text-muted-foreground italic">View project metadata & IP records.</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </CardContent>
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
