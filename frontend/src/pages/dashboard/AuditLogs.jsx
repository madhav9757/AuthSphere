import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
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
  MapPin,
  ShieldAlert,
  BarChart2,
  Search,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getGlobalLogs } from "@/api/AuditLogAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  project:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  security:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  user: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  api: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getGlobalLogs();
        if (res.success) {
          setLogs(res.data);
        }
      } catch {
        toast.error("Failed to fetch activity logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [logs, searchQuery]);

  const stats = useMemo(
    () => ({
      total: logs.length,
      security: logs.filter((l) => l.category === "security").length,
      uniqueIps: new Set(logs.map((l) => l.metadata?.ip)).size,
      byCategory: [
        {
          name: "Project",
          value: logs.filter((l) => l.category === "project").length,
          color: "#10b981",
        },
        {
          name: "Security",
          value: logs.filter((l) => l.category === "security").length,
          color: "#f43f5e",
        },
        {
          name: "User",
          value: logs.filter((l) => l.category === "user").length,
          color: "#3b82f6",
        },
        {
          name: "API",
          value: logs.filter((l) => l.category === "api").length,
          color: "#f59e0b",
        },
      ].filter((c) => c.value > 0),
    }),
    [logs],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-xs text-muted-foreground">Loading audit logs...</p>
      </div>
    );
  }

  return (
    <div className="h-[93vh] w-[90vw] mx-auto py-6 pt-0 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b shrink-0">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group -ml-2 text-muted-foreground hover:text-foreground mb-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Security monitoring and event tracking across your projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase tracking-wider border-primary/20 bg-primary/5 text-primary gap-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            Live
          </Badge>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-5 shrink-0">
        {[
          {
            label: "Total Events",
            value: stats.total,
            icon: Activity,
            color: "text-primary",
          },
          {
            label: "Security Alerts",
            value: stats.security,
            icon: ShieldAlert,
            color: "text-rose-500",
          },
          {
            label: "Unique IPs",
            value: stats.uniqueIps,
            icon: Globe,
            color: "text-blue-500",
          },
          {
            label: "Uptime",
            value: "99.9%",
            icon: Clock,
            color: "text-emerald-500",
          },
        ].map((metric, i) => (
          <Card
            key={i}
            className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-0.5">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN CONTENT - fills remaining space */}
      <div className="grid lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4 flex flex-col gap-5 min-h-0">
          {/* Chart */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Event Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Volume by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.byCategory}
                    layout="vertical"
                    margin={{ left: -30, right: 10 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border rounded-lg px-3 py-2 shadow-lg text-xs">
                              <p className="font-medium">
                                {payload[0].payload.name}
                              </p>
                              <p className="text-muted-foreground">
                                Count: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {stats.byCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          fillOpacity={0.7}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-4 w-4" />
                <h4 className="font-semibold text-sm">Security Info</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Audit logs are immutable and cryptographically signed. They
                provide a forensic trail of all administrative actions.
              </p>
              <Badge
                variant="outline"
                className="text-[10px] border-primary/20 text-primary font-mono"
              >
                AES-256 Encrypted
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: ACTIVITY STREAM */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 h-9 bg-muted/30 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>

          {/* Activity Stream Card - scrollable */}
          <Card className="bg-card/30 border-border/50 flex-1 min-h-0 flex flex-col">
            <CardHeader className="pb-3 border-b shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Activity Stream
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Live system event broadcast
                  </CardDescription>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {filteredLogs.length} events
                </span>
              </div>
            </CardHeader>

            {/* Scrollable content area */}
            <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
              <div className="divide-y divide-border/50">
                <AnimatePresence mode="popLayout">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <motion.div
                        key={log._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedLog(log)}
                        className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors group"
                      >
                        {/* Icon */}
                        <div className="shrink-0 pt-0.5">
                          <div className="h-8 w-8 rounded-lg bg-muted border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                            {EVENT_ICONS[log.action] || (
                              <Activity className="h-3.5 w-3.5" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-sm truncate">
                                {log.action.replace(/_/g, " ")}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${CATEGORY_COLORS[log.category] || ""} border-none text-[9px] px-1.5 py-0 uppercase font-semibold shrink-0`}
                              >
                                {log.category}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(log.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground truncate">
                            {log.description}
                          </p>

                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 font-mono">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.metadata?.ip || "local"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(
                                new Date(log.createdAt),
                                "MMM dd, HH:mm:ss",
                              )}
                            </span>
                            {log.metadata?.details?.deviceInfo && (
                              <span className="hidden md:flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {log.metadata.details.deviceInfo.os} /{" "}
                                {log.metadata.details.deviceInfo.browser}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Activity className="h-10 w-10 text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">
                        No events match your search
                      </p>
                      <Button
                        variant="link"
                        className="text-xs text-primary mt-1"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DETAIL DIALOG */}
      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent
          className="
    w-[90vw]!
    max-w-[50vw]!
    h-[30vh]!
    max-h-[60vh]!
    p-0
    overflow-hidden
    rounded-2xl
    border border-white/10
    bg-background/80 backdrop-blur-xl
    shadow-2xl

    left-[50%] top-[50%]
    translate-x-[-50%] translate-y-[-50%]
  "
        >
          {selectedLog && (
            <div className="flex h-full text-foreground">
              {/* COLUMN 1 — EVENT */}
              <div className="flex-[1.2] px-6 py-5 flex flex-col justify-between border-r border-white/10 min-w-0">
                <div className="space-y-4">
                  <DialogHeader className="space-y-2">
                    <Badge
                      className={`${CATEGORY_COLORS[selectedLog.category]} text-[10px] px-2 py-0.5 uppercase tracking-wide`}
                    >
                      {selectedLog.category}
                    </Badge>

                    <DialogTitle className="text-lg font-semibold leading-tight tracking-tight">
                      {selectedLog.action.replace(/_/g, " ")}
                    </DialogTitle>

                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {selectedLog.description}
                    </DialogDescription>
                  </DialogHeader>

                  {selectedLog.metadata?.details?.deviceInfo && (
                    <div className="flex gap-6 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          OS
                        </p>
                        <p className="text-sm font-medium">
                          {selectedLog.metadata.details.deviceInfo.os}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Browser
                        </p>
                        <p className="text-sm font-medium">
                          {selectedLog.metadata.details.deviceInfo.browser}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-mono text-muted-foreground/40 truncate">
                  {selectedLog._id}
                </p>
              </div>

              {/* COLUMN 2 — METADATA */}
              <div className="flex-[1.2] px-6 py-5 border-r border-white/10 flex flex-col min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                  Metadata
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {[
                    {
                      label: "IP Address",
                      value: selectedLog.metadata?.ip || "Local",
                    },
                    {
                      label: "Timestamp",
                      value: format(
                        new Date(selectedLog.createdAt),
                        "MMM dd, yyyy HH:mm",
                      ),
                    },
                    {
                      label: "Project",
                      value: selectedLog.projectId || "System",
                    },
                    {
                      label: "Developer",
                      value: selectedLog.developerId || "Unknown",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="font-mono text-sm break-all">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 3 — PAYLOAD */}
              <div className="flex-[1.6] px-6 py-5 flex flex-col min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                  Raw Payload
                </p>

                <div className="flex-1 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                  <pre className="h-full w-full p-4 text-[12px] font-mono overflow-auto leading-relaxed text-green-400">
                    {JSON.stringify(
                      selectedLog.metadata?.details || {},
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
