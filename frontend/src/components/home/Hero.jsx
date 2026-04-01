import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  Shield,
  Zap,
  Lock,
  Server,
  Database,
  Activity,
  Fingerprint,
  GitBranch,
  Network,
  Key,
  Cpu,
  Webhook,
  ArrowRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

/* ── Entrance animation keyframes injected once ── */
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .anim-fade-up {
    opacity: 0;
    animation: fadeUp 0.55s cubic-bezier(.16,1,.3,1) forwards;
  }
`;

/* ── Tiny stat row ── */
const Stat = ({ label, value, color }) => (
  <div className="flex items-end justify-between py-3 border-b border-border/40 last:border-0">
    <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.13em]">
      {label}
    </span>
    <span
      className={`text-xl font-semibold tracking-tight tabular-nums ${color}`}
    >
      {value}
    </span>
  </div>
);

/* ── Trust badge pill ── */
const TrustPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
    {children}
  </span>
);

/* ════════════════════════════════════════════════════════════════ */
const Hero = ({ user }) => {
  const { isInstallable, installPWA } = usePWA();

  return (
    <section className="relative pt-28 pb-36 overflow-hidden">
      <style>{STYLES}</style>

      {/* ── Orbital background ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Vignette — fades orbitals into background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_68%)] z-10" />

        <OrbitingCircles
          className="size-9 border-border/40 bg-background/80 shadow-sm"
          duration={22}
          radius={150}
        >
          <Key className="h-3.5 w-3.5 text-amber-500/70" />
          <Zap className="h-3.5 w-3.5 text-yellow-500/70" />
        </OrbitingCircles>

        <OrbitingCircles
          className="size-11 border-border/30 bg-background/70 shadow-sm"
          duration={38}
          radius={270}
          reverse
        >
          <Lock className="h-4 w-4 text-rose-500/60" />
          <Server className="h-4 w-4 text-cyan-500/60" />
          <Database className="h-4 w-4 text-indigo-500/60" />
        </OrbitingCircles>

        <OrbitingCircles
          className="size-[52px] border-border/20 bg-background/50"
          duration={65}
          radius={430}
        >
          <Fingerprint className="h-5 w-5 text-primary/40" />
          <Shield className="h-5 w-5 text-blue-500/40" />
          <Network className="h-5 w-5 text-emerald-500/40" />
        </OrbitingCircles>
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-20 mx-auto w-[92%] max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start justify-between">
          {/* ─── Left: copy ─── */}
          <div className="flex-1 lg:pt-8 max-w-2xl">
            {/* Status badge */}
            <div className="anim-fade-up" style={{ animationDelay: "0ms" }}>
              <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-border/70 bg-muted/30 text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-8 select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                v3.0.0 · All systems nominal
              </span>
            </div>

            {/* Headline */}
            <div
              className="anim-fade-up mb-6"
              style={{ animationDelay: "80ms" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-[80px] font-semibold tracking-[-0.04em] leading-[0.9] text-foreground">
                AuthSphere
                <br />
                <span className="text-muted-foreground/60 font-light">
                  Identity Mesh
                </span>
              </h1>
            </div>

            {/* Body */}
            <div
              className="anim-fade-up mb-10"
              style={{ animationDelay: "160ms" }}
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                The distributed IAM engine for global scale. Open-source,{" "}
                <span className="text-foreground font-medium">
                  sub-millisecond latency
                </span>
                , and architected for modern microservices.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="anim-fade-up flex flex-col sm:flex-row flex-wrap gap-3 mb-10"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                size="lg"
                className="h-11 px-7 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-all"
              >
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-7 rounded-full border-border/70 bg-transparent hover:bg-muted/50 text-sm font-medium transition-all"
              >
                <a
                  href="https://github.com/madhav9757/AuthSphere"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitBranch className="mr-2 h-3.5 w-3.5" />
                  Source Code
                </a>
              </Button>

              {isInstallable && (
                <Button
                  onClick={installPWA}
                  size="lg"
                  className="h-11 px-7 rounded-full border border-primary/20 bg-primary/8 text-primary hover:bg-primary/15 text-sm font-medium transition-all"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Install App
                </Button>
              )}
            </div>

            {/* Trust signals */}
            <div
              className="anim-fade-up flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ animationDelay: "320ms" }}
            >
              <TrustPill>OAuth 2.1 compliant</TrustPill>
              <TrustPill>RS256 · PKCE · MFA</TrustPill>
              <TrustPill>Open source · MIT</TrustPill>
            </div>
          </div>

          {/* ─── Right: telemetry card ─── */}
          <div
            className="anim-fade-up w-full lg:w-[380px] xl:w-[400px] shrink-0"
            style={{ animationDelay: "200ms" }}
          >
            <Card className="rounded-2xl border-border/60 bg-background/80 backdrop-blur-sm shadow-[0_24px_56px_-12px_rgba(0,0,0,.12)] overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-muted border border-border/60 flex items-center justify-center">
                    <Cpu className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-tight">
                      System Node
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono leading-tight mt-0.5">
                      ID: AS-9757-X
                    </p>
                  </div>
                </div>
                <Badge className="h-5 px-2 rounded-md text-[10px] font-semibold font-mono bg-emerald-500/8 text-emerald-600 border border-emerald-500/15 hover:bg-emerald-500/8">
                  ONLINE
                </Badge>
              </div>

              {/* Stats */}
              <div className="px-5 pt-1 pb-2">
                <Stat label="Auth Latency" value="1.2ms" color="text-primary" />
                <Stat
                  label="Throughput"
                  value="480k/s"
                  color="text-foreground"
                />
                <Stat
                  label="Global Uptime"
                  value="99.99%"
                  color="text-emerald-500"
                />
              </div>

              {/* Activity bar */}
              <div className="px-5 pb-2">
                <div className="rounded-xl bg-muted/40 border border-border/40 px-4 py-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Request volume · 24h
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      live
                    </span>
                  </div>
                  {/* Sparkline bars */}
                  <div className="flex items-end gap-[3px] h-8">
                    {[
                      40, 55, 48, 70, 62, 80, 74, 90, 68, 85, 78, 95, 88, 72,
                      65, 80, 91, 76, 88, 95, 83, 78, 90, 85,
                    ].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-[2px] bg-primary/20 hover:bg-primary/40 transition-colors"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Live hook row */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Webhook className="h-3.5 w-3.5 text-orange-500/80" />
                    <span className="text-[12px] font-semibold">
                      Live Events Hook
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      4 listeners
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating beneath card — subtle social proof */}
            <p className="text-center text-[11px] text-muted-foreground/50 mt-3">
              Trusted by developers across 40+ countries
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
