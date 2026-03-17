import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
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
  BarChart2,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  project:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  security:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  user: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  api: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
          color: "#10b981", // emerald-500
        },
        {
          name: "Security",
          value: logs.filter((l) => l.category === "security").length,
          color: "#f43f5e", // rose-500
        },
        {
          name: "User",
          value: logs.filter((l) => l.category === "user").length,
          color: "#3b82f6", // blue-500
        },
        {
          name: "API",
          value: logs.filter((l) => l.category === "api").length,
          color: "#f59e0b", // amber-500
        },
      ].filter((c) => c.value > 0),
    }),
    [logs],
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        </motion.div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Synchronizing activity stream...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-12 px-6 max-w-6xl"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="group -ml-2 text-muted-foreground hover:text-foreground transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          </motion.div>
          <div className="space-y-1">
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70"
            >
              System Intelligence
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl"
            >
              Continuous security monitoring and event tracking across your
              infrastructure nodes.
            </motion.p>
          </div>
        </div>
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-4 py-1.5 gap-2 border-primary/20 bg-primary/5 text-primary font-bold tracking-tight rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Real-time Feed
          </Badge>
          <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
            Node: US-EAST-1
          </div>
        </motion.div>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: "Total Events",
            value: stats.total,
            icon: Activity,
            color: "text-primary",
            bg: "bg-primary/10",
            desc: "Recorded logs",
          },
          {
            label: "Security Alerts",
            value: stats.security,
            icon: ShieldAlert,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            desc: "Risk detections",
          },
          {
            label: "Unique Nodes",
            value: stats.uniqueIps,
            icon: Globe,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            desc: "Entry points",
          },
          {
            label: "Uptime",
            value: "99.9%",
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            desc: "System status",
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-none bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-6 relative">
                <div
                  className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}
                >
                  <stat.icon size={80} />
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                  <div
                    className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">{stat.value}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mt-1">
                      {stat.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* LEFT COLUMN: VISUALS & TOOLS */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="border-none bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" /> Traffic
                  Distribution
                </CardTitle>
                <CardDescription>
                  Event volume by protocol category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
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
                              <div className="bg-background/90 backdrop-blur-md border border-border px-3 py-2 rounded-lg shadow-xl text-xs">
                                <p className="font-bold">
                                  {payload[0].payload.name}
                                </p>
                                <p className="text-muted-foreground">
                                  Volume: {payload[0].value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                        {stats.byCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none bg-primary/5 dark:bg-primary/10 overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Shield className="h-48 w-48 text-primary" />
              </div>
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-primary">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="font-black text-sm uppercase tracking-tighter">
                    Security Protocol
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Audit logs are immutable and cryptographically signed. They
                  provide a forensic trail of all administrative actions.
                  Unauthorized access attempts are automatically escalated to
                  security nodes.
                </p>
                <div className="pt-2">
                  <Badge
                    variant="outline"
                    className="text-[9px] border-primary/30 text-primary"
                  >
                    AES-256 ENCRYPTED
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: ACTIVITY STREAM */}
        <div className="lg:col-span-8 space-y-6">
          {/* SEARCH & FILTER BAR */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search event logs (e.g. project created, auth)..."
                className="pl-10 bg-card/40 border-none h-11 focus-visible:ring-primary/20 transition-all rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-11 border-none bg-card/40 backdrop-blur-md px-4 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest"
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden min-h-[600px]">
              <CardHeader className="border-b border-border/10 pb-6 px-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2 font-black tracking-tight">
                      Activity Stream
                    </CardTitle>
                    <CardDescription>
                      Live system event broadcast
                    </CardDescription>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded">
                    BUFFER: FIXED 50
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar relative px-8 py-8">
                  {/* Modern Timeline Line */}
                  <div className="absolute left-[51px] top-8 bottom-8 w-px bg-linear-to-b from-primary/50 via-border to-transparent opacity-30" />

                  <div className="space-y-10 relative">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <motion.div
                            key={log._id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => setSelectedLog(log)}
                            className="flex gap-8 group relative cursor-pointer hover:bg-primary/2 p-2 -m-2 rounded-2xl transition-all"
                          >
                            <div className="relative z-10 pt-1">
                              <div className="h-10 w-10 rounded-xl bg-background border-2 border-border flex items-center justify-center shadow-md group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 group-hover:scale-110">
                                {EVENT_ICONS[log.action] || (
                                  <Activity className="h-4 w-4" />
                                )}
                              </div>
                            </div>

                            <div className="flex-1 space-y-2 pt-0.5">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {log.action.replace(/_/g, " ")}
                                  </span>
                                  <Badge
                                    className={`${CATEGORY_COLORS[log.category] || ""} border-none px-2 py-0 text-[9px] uppercase font-black tracking-widest rounded-sm`}
                                  >
                                    {log.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(
                                    new Date(log.createdAt),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                {log.description}
                              </p>

                              <div className="flex items-center gap-6 pt-1 text-[10px] text-muted-foreground/40 font-mono">
                                <span className="flex items-center gap-1.5 group-hover:text-foreground transition-colors">
                                  <MapPin className="h-3 w-3" />{" "}
                                  {log.metadata?.ip || "LOCAL_NODE"}
                                </span>
                                <span className="flex items-center gap-1.5 group-hover:text-foreground transition-colors border-l pl-4 border-border/20">
                                  <Clock className="h-3 w-3" />
                                  {format(
                                    new Date(log.createdAt),
                                    "MMM dd, HH:mm:ss",
                                  )}
                                </span>
                                {log.metadata?.details?.deviceInfo && (
                                  <span className="hidden md:flex items-center gap-1.5 group-hover:text-foreground transition-colors border-l pl-4 border-border/20">
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
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-32"
                        >
                          <div className="relative inline-block mb-6">
                            <Activity className="h-16 w-16 text-muted-foreground/10 mx-auto" />
                            <Search className="h-6 w-6 text-muted-foreground/20 absolute -right-2 -bottom-2" />
                          </div>
                          <p className="text-muted-foreground font-bold tracking-tight">
                            No telemetry data found matching your query
                          </p>
                          <Button
                            variant="link"
                            className="text-xs text-primary"
                            onClick={() => setSearchQuery("")}
                          >
                            Clear search filter
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ACTIVITY DETAIL DIALOG */}
      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="max-w-xl bg-background border-border shadow-xl p-0 overflow-hidden">
          {selectedLog && (
            <div className="flex flex-col">
              <div className="p-6 border-b border-border">
                <DialogHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`${CATEGORY_COLORS[selectedLog.category]} border-none font-bold uppercase text-[9px] px-1.5 py-0 rounded-sm`}
                    >
                      {selectedLog.category}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {selectedLog._id}
                    </span>
                  </div>
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {selectedLog.action.replace(/_/g, " ")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground font-medium">
                    {selectedLog.description}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    {
                      label: "IP Address",
                      value: selectedLog.metadata?.ip || "Local",
                    },
                    {
                      label: "Timestamp",
                      value: format(
                        new Date(selectedLog.createdAt),
                        "yyyy-MM-dd HH:mm:ss",
                      ),
                    },
                    {
                      label: "Project ID",
                      value: selectedLog.projectId || "System",
                    },
                    {
                      label: "Developer",
                      value: selectedLog.developerId || "Unknown",
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs font-mono break-all text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedLog.metadata?.details?.deviceInfo && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mb-3">
                      Environment Information
                    </p>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          OS
                        </p>
                        <p className="text-xs font-bold">
                          {selectedLog.metadata.details.deviceInfo.os}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Browser
                        </p>
                        <p className="text-xs font-bold">
                          {selectedLog.metadata.details.deviceInfo.browser}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mb-3">
                    Protocol Payload
                  </p>
                  <pre className="p-3 rounded-md bg-muted text-[11px] font-mono overflow-x-auto border border-border">
                    {JSON.stringify(
                      selectedLog.metadata?.details || {},
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>

              <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  className="text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AuditLogs;
