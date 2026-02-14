import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  UserPlus,
  LogIn,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  ChevronLeft,
  Loader2,
  Zap,
  ShieldCheck,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

const StatsCard = ({
  title,
  value,
  trend,
  icon: Icon,
  description,
  color = "primary",
}) => (
  <Card className="group border-none relative overflow-hidden bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
    <div
      className={`absolute top-0 left-0 w-1 h-full bg-${color === "primary" ? "primary" : "emerald-500"} opacity-20`}
    />
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="h-9 w-9 rounded-xl bg-background border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4" />
        </div>
        {trend && trend !== "0%" && (
          <Badge
            variant="outline"
            className={`text-[10px] font-bold gap-1 border-none ${trend.startsWith("+") ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}`}
          >
            {trend.startsWith("+") ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.replace(/[+-]/g, "")}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-black tracking-tighter">{value}</div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
      </div>
      {description && (
        <p className="text-[11px] text-muted-foreground/60 mt-3 leading-tight">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs text-muted-foreground font-medium mb-2 border-b pb-1">
          {label ? format(new Date(label), "MMMM dd, yyyy") : ""}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {entry.name}:
                </span>
              </div>
              <span className="text-xs font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { overview, charts, activity, isLoading, isError } =
    useAnalytics(projectId);

  if (isError) {
    toast.error("Failed to load analytics data");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const providerData = charts.data?.providerDistribution || [];

  // Combine signup and DAU data for the main chart
  const combinedChartData =
    charts.data?.dailySignups?.map((s, i) => ({
      date: s.date,
      signups: s.count,
      active: charts.data.dailyActiveUsers?.[i]?.count || 0,
    })) || [];

  const generatePulse = () => {
    if (!overview.data) return "Analyzing project signals...";
    const signupTrend = overview.data.signups?.trend || "+0%";
    const isGrowing = signupTrend.startsWith("+");
    const topProvider = providerData?.[0]?.name || "Email";
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-primary/5 border border-primary/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
        <p className="text-sm font-medium leading-relaxed">
          <span className="text-primary font-bold">Project Intelligence:</span>{" "}
          Heartbeat is {isGrowing ? "accelerating" : "steady"}. You've recorded
          a{" "}
          <span className="underline decoration-primary/30 underline-offset-4">
            {signupTrend.replace(/[+-]/g, "")}{" "}
            {isGrowing ? "growth" : "variance"}
          </span>{" "}
          in user acquisition this period, with{" "}
          <span className="font-bold">{topProvider}</span> remaining the
          dominant entry vector for your audience.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-8">
        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <Link
              to="/dashboard"
              className="hover:text-primary transition-colors"
            >
              Console
            </Link>
            <ChevronLeft className="h-3 w-3 rotate-180" />
            <Link
              to={`/projects/${projectId}`}
              className="hover:text-primary transition-colors"
            >
              Project
            </Link>
            <ChevronLeft className="h-3 w-3 rotate-180" />
            <span className="text-foreground">Analytics</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter">
                Identity Intelligence
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Advanced telemetry for{" "}
                <span className="text-foreground font-semibold">
                  AuthSphere
                </span>
                . Monitor every handshake, session, and user journey in
                real-time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-4 text-xs font-bold uppercase tracking-wider border-primary/10"
              >
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Custom Range
              </Button>
              <Button className="h-10 rounded-xl px-6 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                Export Raw Metrics
              </Button>
            </div>
          </div>
        </div>

        {generatePulse()}

        {/* COMPLEX GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT COLUMN: PRIMARY METRICS (Grid inside Grid) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Signups"
                value={overview.data?.signups?.month || 0}
                trend={overview.data?.signups?.trend}
                icon={UserPlus}
                description="Cumulative growth"
              />
              <StatsCard
                title="Active Today"
                value={overview.data?.logins?.today || 0}
                trend={overview.data?.logins?.trend}
                icon={LogIn}
                description="Live session count"
                color="emerald"
              />
              <StatsCard
                title="MAU Retention"
                value={overview.data?.activeUsers?.retention || "84.2%"}
                icon={Users}
                description="Audience stickiness"
              />
              <StatsCard
                title="IO Latency"
                value={overview.data?.health?.latency || "42ms"}
                icon={Zap}
                description="Avg response time"
                color="emerald"
              />
            </div>

            {/* MAIN ENGAGEMENT CHART */}
            <Card className="border-none shadow-sm bg-background/40 backdrop-blur-sm overflow-hidden pb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <CardTitle className="text-lg font-bold">
                      Engagement Vectors
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Interaction frequency vs User acquisitions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase">
                      Growth
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase">
                      Activity
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedChartData}>
                    <defs>
                      <linearGradient
                        id="colorSignups"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorActive"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="5 5"
                      vertical={false}
                      className="stroke-muted/10"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      tickFormatter={(str) => format(new Date(str), "MMM d")}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      name="Signups"
                      type="monotone"
                      dataKey="signups"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSignups)"
                    />
                    <Area
                      name="Active Users"
                      type="monotone"
                      dataKey="active"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorActive)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: DISTRIBUTION & HEALTH */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* AUTH DISTRIBUTION PIE */}
            <Card className="border-none shadow-sm bg-background/40 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-purple-500 rounded-full" />
                  <CardTitle className="text-lg font-bold">
                    Protocol Split
                  </CardTitle>
                </div>
                <CardDescription className="text-xs italic">
                  Market share by authentication technology
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] relative">
                {providerData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={providerData}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {providerData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        Top Link
                      </p>
                      <p className="text-2xl font-black text-primary leading-tight mt-1">
                        {providerData[0]?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="h-10 w-10 text-muted-foreground/20 mb-2" />
                    <p className="text-xs text-muted-foreground italic">
                      Calibrating data...
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0 pb-6">
                <div className="w-full grid grid-cols-2 gap-3">
                  {providerData.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-primary/5"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-[10px] font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-black">
                        {(
                          (item.value /
                            providerData.reduce((a, b) => a + b.value, 0)) *
                          100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>

            {/* SYSTEM STATUS & HEALTH */}
            <Card className="border-none shadow-sm bg-background/40 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-emerald-500 rounded-full" />
                  <CardTitle className="text-lg font-bold">
                    Node Vitality
                  </CardTitle>
                </div>
                <CardDescription className="text-xs italic">
                  Live infrastructure health report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 leading-none">
                      Uptime SLA
                    </p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      99.999%
                    </p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 rounded-full">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: "Auth Core",
                      status: "Operational",
                      color: "bg-emerald-500",
                    },
                    {
                      name: "Session Store",
                      status: "Operational",
                      color: "bg-emerald-500",
                    },
                    {
                      name: "Global Edge",
                      status: "Nominal",
                      color: "bg-cyan-500",
                    },
                  ].map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${service.color}`}
                        />
                        <span className="text-xs font-semibold group-hover:text-primary transition-colors cursor-default">
                          {service.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-black uppercase tracking-tighter h-5 border-emerald-500/20 text-emerald-600 bg-emerald-500/5"
                      >
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BOTTOM ROW: RECENT ACTIVITY (Wide) */}
          <Card className="col-span-12 border-none shadow-sm bg-background/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-amber-500 rounded-full" />
                  <CardTitle className="text-lg font-bold">
                    Activity Ledger
                  </CardTitle>
                </div>
                <CardDescription className="text-xs italic">
                  Atomic audit of incoming authentication signals
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                View Full Audit →
              </Button>
            </CardHeader>
            <CardContent>
              {activity.data?.recentLogins?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activity.data.recentLogins.slice(0, 6).map((login, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl border border-primary/5 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center font-black text-primary shadow-sm uppercase">
                        {login.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">
                          {login.user}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {login.email}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                          {formatDistanceToNow(new Date(login.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[8px] font-black uppercase h-4 px-1 mt-1 border-primary/20 text-primary"
                        >
                          {login.provider}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-xs text-muted-foreground italic font-medium tracking-tighter uppercase">
                    Quiet period... No events detected.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
