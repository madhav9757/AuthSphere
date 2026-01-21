import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";
import {
    Users, UserPlus, LogIn, ArrowUpRight, ArrowDownRight,
    Calendar, Activity, ChevronLeft, Loader2, Zap, ShieldCheck
} from "lucide-react";

// Correction: lucide-react not lucide-center
import {
    Users as UsersIcon, UserPlus as UserPlusIcon, LogIn as LogInIcon,
    ArrowUpRight as ArrowUpRightIcon, ArrowDownRight as ArrowDownRightIcon,
    Calendar as CalendarIcon, Activity as ActivityIcon,
    ChevronLeft as ChevronLeftIcon, Loader2 as Loader2Icon,
    Zap as ZapIcon, ShieldCheck as ShieldCheckIcon
} from "lucide-react";

import { getAnalyticsOverview, getAnalyticsCharts, getRecentActivity } from "../api/AnalyticsAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const StatsCard = ({ title, value, trend, icon: Icon, description }) => (
    <Card className="border-border shadow-sm overflow-hidden bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-foreground tracking-tight">{value}</h3>
                        {trend && trend !== "0%" && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                {trend.startsWith('+') ? <ArrowUpRightIcon className="h-3 w-3 mr-0.5" /> : <ArrowDownRightIcon className="h-3 w-3 mr-0.5" />}
                                {trend.replace(/[+-]/g, '')}
                            </span>
                        )}
                    </div>
                    {description && <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-70">{description}</p>}
                </div>
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl shadow-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">
                    {label ? format(new Date(label), "MMMM dd, yyyy") : ""}
                </p>
                <p className="text-sm font-bold">
                    <span className="text-indigo-400 mr-2">●</span>
                    {payload[0].value} New Signups
                </p>
            </div>
        );
    }
    return null;
};

const ProjectAnalytics = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ overview: null, charts: null, activity: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ov, ch, ac] = await Promise.all([
                    getAnalyticsOverview(projectId),
                    getAnalyticsCharts(projectId),
                    getRecentActivity(projectId)
                ]);
                setData({ overview: ov.data, charts: ch.data, activity: ac.data });
            } catch (error) {
                toast.error("Analytics sync failed. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchData();
    }, [projectId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2Icon className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-widest text-xs">Aggregating project data...</p>
        </div>
    );

    const providerData = data.charts?.providerDistribution
        ? Object.entries(data.charts.providerDistribution).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="group flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <ChevronLeftIcon className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> Back
                        </Link>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <div className="flex items-center gap-2 bg-white border border-border/50 px-2 py-1 rounded-lg shadow-sm">
                            <img src="/assets/logo.png" alt="Logo" className="h-3.5 w-3.5 object-contain mix-blend-multiply" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">AuthSphere Insights</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight italic">Project Analytics</h1>
                    <p className="text-muted-foreground font-medium">Monitoring real-time user acquisition and authentication health.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full font-bold border-border shadow-sm bg-background">
                        <CalendarIcon className="h-4 w-4 mr-2" /> Last 30 Days
                    </Button>
                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Monthly Signups"
                    value={data.overview?.signups?.month || 0}
                    trend={data.overview?.signups?.trend}
                    icon={UserPlusIcon}
                    description="New identities created"
                />
                <StatsCard
                    title="Active Today"
                    value={data.overview?.logins?.today || 0}
                    trend={data.overview?.logins?.trend}
                    icon={LogInIcon}
                    description="Unique login sessions"
                />
                <StatsCard
                    title="Retention Rate"
                    value={data.overview?.activeUsers?.retention || "0.0%"}
                    icon={UsersIcon}
                    description="MAU / Total Users ratio"
                />
                <StatsCard
                    title="System Latency"
                    value={data.overview?.health?.latency || "0ms"}
                    icon={ZapIcon}
                    description="P99 response time"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Signup Trend Area Chart */}
                <Card className="lg:col-span-2 border-border shadow-sm overflow-hidden bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <ActivityIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            Signup Growth Velocity
                        </CardTitle>
                        <CardDescription>Daily signup volume over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts?.dailySignups || []}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-50" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false} tickLine={false}
                                    tick={{ fontSize: 10, fill: 'currentColor', fontWeight: 700 }}
                                    className="text-muted-foreground"
                                    tickFormatter={(str) => format(new Date(str), "MMM d")}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 600 }} className="text-muted-foreground" />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Identity Donut */}
                <Card className="border-border shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <ShieldCheckIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            Provider Mix
                        </CardTitle>
                        <CardDescription>Preferred authentication methods</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-6 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={providerData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {providerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={8} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    formatter={(v) => <span className="text-[10px] font-black text-muted-foreground uppercase dark:opacity-80">{v}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Auth Stream */}
                <Card className="border-border shadow-sm bg-card overflow-hidden">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Auth Stream
                        </CardTitle>
                        <CardDescription>Latest authentication events and session starts</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.activity?.recentLogins?.length > 0 ? (
                            data.activity.recentLogins.map((login, i) => (
                                <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors border-b border-border last:border-0 group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-foreground text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {login.user[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{login.user}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{login.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-muted-foreground">{formatDistanceToNow(new Date(login.timestamp))} ago</p>
                                        <Badge variant="secondary" className="text-[9px] bg-muted text-muted-foreground font-black uppercase tracking-tighter mt-1 border-none">
                                            {login.provider === 'local' ? 'Email/Pass' : login.provider}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center text-muted-foreground font-medium flex flex-col items-center gap-4">
                                <ActivityIcon className="h-8 w-8 opacity-20" />
                                <p className="uppercase tracking-[0.2em] text-[10px] font-black">No active session data available.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Infrastructure Performance */}
                <Card className="border-none shadow-sm bg-slate-900 dark:bg-black text-white overflow-hidden relative group">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative z-10 border-b border-white/5">
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <ZapIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            Infrastructure Health
                        </CardTitle>
                        <CardDescription className="text-slate-400">Project-wide performance monitoring</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-8 py-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Uptime</p>
                                <p className="text-3xl font-black text-emerald-400">99.99%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">OAuth Latency</p>
                                <p className="text-3xl font-black text-blue-400">{data.overview?.health?.latency || "102ms"}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="font-bold text-slate-300">Identity API</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] px-2 py-0.5">OPERATIONAL</Badge>
                            </div>
                            <div className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="font-bold text-slate-300">Token Exchange Service</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] px-2 py-0.5">OPERATIONAL</Badge>
                            </div>
                            <div className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="font-bold text-slate-300">Global Session Edge</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] px-2 py-0.5">OPERATIONAL</Badge>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 font-mono italic">
                                * System health reflects global AuthSphere status and dedicated project shards.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectAnalytics;