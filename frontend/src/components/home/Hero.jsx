import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  Shield,
  Zap,
  Lock,
  Globe,
  LayoutDashboard,
  Terminal,
  Server,
  Database,
  Activity,
  Fingerprint,
  GitBranch,
  Network,
  Key,
  Cpu,
  Blocks,
  FileCode2,
  Webhook,
  ArrowUpRight,
} from "lucide-react";

const Hero = ({ user }) => {
  return (
    <section className="relative pt-32 pb-40 overflow-hidden bg-transparent">
      {/* Structural Orbitals - Fixed Visibility & Precision */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)] z-10" />

        <OrbitingCircles
          className="size-[40px] border-border/50 bg-background"
          duration={20}
          radius={140}
        >
          <Key className="text-amber-500/80 h-4 w-4" />
          <Zap className="text-yellow-500/80 h-4 w-4" />
        </OrbitingCircles>

        <OrbitingCircles
          className="size-[50px] border-border/50 bg-background"
          duration={35}
          radius={260}
          reverse
        >
          <Lock className="text-rose-500/80 h-5 w-5" />
          <Server className="text-cyan-500/80 h-5 w-5" />
          <Database className="text-indigo-500/80 h-5 w-5" />
        </OrbitingCircles>

        <OrbitingCircles
          className="size-[60px] border-border/30 bg-background"
          duration={60}
          radius={420}
        >
          <Fingerprint className="text-primary/60 h-6 w-6" />
          <Shield className="text-blue-500/60 h-6 w-6" />
          <Network className="text-emerald-500/60 h-6 w-6" />
        </OrbitingCircles>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-24 items-start justify-between">
          <div className="flex-1 lg:pt-10">
            {/* Minimalist Sub-header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                System Status: v3.0.0 Stable
              </span>
            </div>

            {/* High-End Topography */}
            <h1 className="text-7xl md:text-[100px] font-semibold tracking-[-0.04em] leading-[0.85] text-foreground mb-10">
              AuthSphere <br />
              <span className="text-muted-foreground font-light">
                Identity Mesh
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-2xl mb-12">
              The distributed IAM engine for global scale. Open-source,{" "}
              <span className="text-foreground">sub-millisecond latency</span>,
              and architected for modern microservices.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-medium text-base"
              >
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 rounded-full border-border bg-transparent hover:bg-muted font-medium text-base transition-all"
              >
                <a
                  href="https://github.com/madhav9757/AuthSphere"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitBranch className="mr-2 h-4 w-4" />
                  Source Code
                </a>
              </Button>
            </div>

            {/* Clean Tech Row */}
            <div className="flex items-center gap-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {["OAuth 2.1", "RS256", "gRPC", "Postgres"].map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono font-bold tracking-tighter uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Telemetry Panel - No glow, pure depth */}
          <div className="w-full lg:w-[420px]">
            <Card className="bg-background border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden">
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-muted flex items-center justify-center border border-border">
                      <Cpu className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-tight">
                        System Node
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        ID: AS-9757-X
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-md font-mono text-[10px] bg-emerald-500/5 text-emerald-600 border border-emerald-500/10"
                  >
                    ONLINE
                  </Badge>
                </div>

                {/* Simplified Data Rows */}
                <div className="space-y-6">
                  {[
                    {
                      label: "Auth Latency",
                      val: "1.2ms",
                      color: "text-primary",
                    },
                    {
                      label: "Throughput",
                      val: "480k/s",
                      color: "text-foreground",
                    },
                    {
                      label: "Global Uptime",
                      val: "99.99%",
                      color: "text-emerald-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-end justify-between border-b border-border/50 pb-2"
                    >
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {stat.label}
                      </span>
                      <span
                        className={`text-2xl font-semibold tracking-tighter ${stat.color}`}
                      >
                        {stat.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between group cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Webhook className="size-4 text-orange-500" />
                    <span className="text-xs font-semibold">
                      Live Events Hook
                    </span>
                  </div>
                  <div className="size-2 rounded-full bg-orange-500 animate-pulse" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
