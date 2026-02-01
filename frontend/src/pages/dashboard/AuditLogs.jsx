import React, { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
    Activity,
    Shield,
    Users,
    Key,
    PlusCircle,
    Trash2,
    RefreshCw,
    Globe,
    AlertTriangle,
    ChevronLeft,
    Loader2,
    Clock,
    LayoutGrid,
    MapPin,
    ShieldAlert,
    BarChart2
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { getGlobalLogs } from "@/api/AuditLogAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EVENT_ICONS = {
    PROJECT_CREATED: <PlusCircle className="h-4 w-4 text-emerald-500" />,
    PROJECT_DELETED: <Trash2 className="h-4 w-4 text-destructive" />,
    API_KEY_ROTATED: <Key className="h-4 w-4 text-amber-500" />,
    USER_REGISTERED: <Users className="h-4 w-4 text-blue-500" />,
    SESSION_REVOKED: <Shield className="h-4 w-4 text-rose-500" />,
    OTHER_SESSIONS_REVOKED: <RefreshCw className="h-4 w-4 text-rose-500" />,
    ALL_SESSIONS_REVOKED: <AlertTriangle className="h-4 w-4 text-destructive" />,
};

const CATEGORY_COLORS = {
    project: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    security: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    user: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    api: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await getGlobalLogs();
                if (res.success) {
                    setLogs(res.data);
                }
            } catch (error) {
                toast.error("Failed to fetch activity logs");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const stats = {
        total: logs.length,
        security: logs.filter(l => l.category === 'security').length,
        uniqueIps: new Set(logs.map(l => l.metadata?.ip)).size,
        byCategory: [
            { name: 'Project', value: logs.filter(l => l.category === 'project').length, color: '#10b981' },
            { name: 'Security', value: logs.filter(l => l.category === 'security').length, color: '#f43f5e' },
            { name: 'User', value: logs.filter(l => l.category === 'user').length, color: '#3b82f6' },
            { name: 'API', value: logs.filter(l => l.category === 'api').length, color: '#f59e0b' },
        ].filter(c => c.value > 0)
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Syncing activity stream...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="hover:bg-muted/50"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">
                        A chronological stream of system events and developer actions across your projects.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 gap-2 border-primary/20 bg-primary/5">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        Live Stream Active
                    </Badge>
                </div>
            </div>

            {/* DASHBOARD SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-card/50 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <ShieldAlert className="h-6 w-6 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.security}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Security Alerts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.uniqueIps}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Unique Locations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* CATEGORY DISTRIBUTION */}
                <Card className="lg:col-span-1 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <BarChart2 className="h-4 w-4" /> Category Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.byCategory} layout="vertical" margin={{ left: -20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {stats.byCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* ACTIVITY STREAM */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Last 50 Events
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mt-4">
                            {/* Timeline Line */}
                            <div className="absolute left-[19px] top-2 bottom-0 w-[1px] bg-border/50" />

                            <div className="space-y-8 relative">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <div key={log._id} className="flex gap-6 group">
                                            <div className="relative z-10">
                                                <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors">
                                                    {EVENT_ICONS[log.action] || <Activity className="h-4 w-4" />}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-1.5 pt-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm tracking-tight text-foreground">{log.action.replace(/_/g, ' ')}</span>
                                                        <Badge className={`${CATEGORY_COLORS[log.category] || ""} border px-1.5 py-0 text-[10px] uppercase font-bold`}>
                                                            {log.category}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {log.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 mt-2">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> {log.metadata?.ip || '0.0.0.0'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}
                                                    </span>
                                                    {log.metadata?.details?.deviceInfo && (
                                                        <span className="flex items-center gap-1 border-l pl-2 ml-2">
                                                            <LayoutGrid className="h-3 w-3" />
                                                            {log.metadata.details.deviceInfo.os} • {log.metadata.details.deviceInfo.browser}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20">
                                        <Activity className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <p className="text-muted-foreground">No logs found. Your system activity will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary underline underline-offset-4">Security Notice</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed text-balance">
                        Audit logs are immutable and cryptographically signed. They provide a forensic trail of all administrative actions.
                        AuthSphere retains these logs for 30 days on Free tier and indefinitely on Enterprise plans.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
