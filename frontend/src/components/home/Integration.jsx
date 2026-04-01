/* eslint-disable no-unused-vars */
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Terminal as TerminalUI,
  TypingAnimation,
} from "@/components/ui/terminal";
import {
  Code2,
  Lock,
  Webhook,
  Cpu,
  Layers,
  Globe,
  Zap,
  Activity,
  ShieldCheck,
} from "lucide-react";

/* ─── Feature item ─── */
const Feature = ({ icon: Icon, color, title, description }) => (
  <div className="flex items-start gap-3.5 group">
    <div
      className="shrink-0 h-9 w-9 rounded-xl border flex items-center justify-center
                 transition-all duration-200 group-hover:shadow-sm"
      style={{
        backgroundColor: `${color}12`,
        borderColor: `${color}25`,
      }}
    >
      <Icon className="h-4 w-4" style={{ color }} />
    </div>
    <div className="pt-0.5">
      <h4 className="text-[12px] font-semibold text-foreground tracking-tight mb-0.5">
        {title}
      </h4>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

/* ─── Metric cell ─── */
const Metric = ({ label, value, valueClass, border }) => (
  <div
    className={`text-center ${border ? "border-r border-border/60" : ""} px-2`}
  >
    <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.13em] mb-1">
      {label}
    </p>
    <p
      className={`text-lg font-semibold tabular-nums tracking-tight ${valueClass}`}
    >
      {value}
    </p>
  </div>
);

/* ════════════════════════════════════════════════════════════════ */
const Integration = () => (
  <section className="relative py-20 sm:py-28 bg-transparent overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-primary/4 blur-[110px] pointer-events-none -z-10" />

    <div className="mx-auto w-[92%] max-w-7xl">
      <div className="grid xl:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start">
        {/* ── Left: copy ── */}
        <div className="xl:sticky xl:top-24">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/5 text-primary
                         text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-0.5 gap-1.5"
            >
              <Code2 className="h-3 w-3" />
              Edge Integration
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full bg-emerald-500/8 text-emerald-600 border border-emerald-500/15
                         text-[9px] font-bold tracking-wider uppercase px-3 py-0.5"
            >
              v2.4.0 Stable
            </Badge>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[0.95] mb-5">
            Zero-Trust <br />
            <span className="text-primary">Implementation.</span>
          </h2>

          <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed max-w-md mb-10">
            AuthSphere's high-performance SDKs automate cryptography, session
            persistence, and global edge handshakes — so you ship faster.
          </p>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-10">
            <Feature
              icon={Lock}
              color="#3b82f6"
              title="Stateless Auth"
              description="Signed RS256 Bearer tokens for distributed verification."
            />
            <Feature
              icon={Webhook}
              color="#10b981"
              title="Event Mesh"
              description="Real-time HMAC-SHA256 webhooks for async processing."
            />
            <Feature
              icon={Cpu}
              color="#a855f7"
              title="JIT Provisioning"
              description="Dynamic user creation and profile sync on first login."
            />
            <Feature
              icon={Layers}
              color="#f97316"
              title="Multi-Tenancy"
              description="Logical isolation for enterprise-ready SaaS apps."
            />
          </div>

          {/* Metrics row */}
          <div className="flex items-center justify-between p-5 rounded-2xl border border-border/60 bg-muted/20">
            <Metric
              label="Latency"
              value="<12ms"
              valueClass="text-foreground"
              border
            />
            <Metric
              label="Verification"
              value="Fixed"
              valueClass="text-emerald-500"
              border
            />
            <Metric label="Uptime" value="99.99%" valueClass="text-primary" />
          </div>
        </div>

        {/* ── Right: terminal ── */}
        <div className="flex flex-col gap-3">
          {/* Terminal status bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Secure Environment Alpha
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-mono font-semibold uppercase text-foreground/70">
                  Load: 0.14
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-orange-400" />
                <span className="text-[9px] font-mono font-semibold uppercase text-foreground/70">
                  US-EAST
                </span>
              </div>
            </div>
          </div>

          {/* Terminal block */}
          <TerminalUI
            className="shadow-[0_0_50px_-12px_rgba(0,0,0,0.9)] bg-[#0a0a0a] border-white/6
                       min-h-[460px] ring-1 ring-white/5 rounded-2xl"
            sequence={false}
            copyable
            codeToCopy={`const { AuthSphere } = require('@authsphere/node-sdk');\n\nconst auth = new AuthSphere({\n  projectId: process.env.AUTH_PROJECT_ID,\n  secretKey: process.env.AUTH_SECRET_KEY,\n});\n\napp.get('/v1/user/profile', auth.middleware(), (req, res) => {\n  const user = req.session.user;\n  res.json({ ack: "SECURE_READY", email: user.email });\n});`}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/6">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.16em]">
                authorized_shell_v1.0.node
              </span>
            </div>

            {/* Code */}
            <div className="space-y-1 font-mono text-[12px] leading-relaxed">
              <p className="text-white/25 italic">
                // 1. Import Security Fabric
              </p>
              <p>
                <span className="text-pink-400">const </span>
                <span className="text-yellow-200">{"{ AuthSphere } "}</span>
                <span className="text-pink-400">= </span>
                <span className="text-cyan-400">require</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">'@authsphere/node-sdk'</span>
                <span className="text-white">);</span>
              </p>

              <p className="pt-3 text-white/25 italic">
                // 2. Initialize Orchestrator
              </p>
              <p>
                <span className="text-pink-400">const </span>
                <span className="text-white">auth </span>
                <span className="text-pink-400">= new </span>
                <span className="text-yellow-200">AuthSphere</span>
                <span className="text-white">({"{"}</span>
              </p>
              <p className="pl-6">
                <span className="text-blue-300">projectId: </span>
                <span className="text-orange-300">process.env</span>
                <span className="text-white">.AUTH_PROJECT_ID,</span>
              </p>
              <p className="pl-6">
                <span className="text-blue-300">secretKey: </span>
                <span className="text-orange-300">process.env</span>
                <span className="text-white">.AUTH_SECRET_KEY,</span>
              </p>
              <p>
                <span className="text-white">{"});"}</span>
              </p>

              <p className="pt-3 text-white/25 italic">
                // 3. Enforce Identity Guards
              </p>
              <p>
                <span className="text-white">app.</span>
                <span className="text-cyan-400">get</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">'/v1/user/profile'</span>
                <span className="text-white">, auth.</span>
                <span className="text-cyan-400">middleware</span>
                <span className="text-white">(), (req, res) </span>
                <span className="text-pink-400">{"=> {"}</span>
              </p>
              <p className="pl-6">
                <span className="text-pink-400">const </span>
                <span className="text-white">user = req.session.user;</span>
              </p>
              <p className="pl-6">
                <span className="text-white">res.</span>
                <span className="text-cyan-400">json</span>
                <span className="text-white">{"({ ack: "}</span>
                <span className="text-emerald-400">"SECURE_READY"</span>
                <span className="text-white">{", email: user.email });"}</span>
              </p>
              <p>
                <span className="text-white">{"});"}</span>
              </p>
            </div>

            {/* Output lines */}
            <div className="mt-7 pt-4 border-t border-white/6 space-y-1.5">
              <TypingAnimation
                className="text-emerald-500 font-mono text-[10px] block"
                duration={28}
              >
                [SYSTEM] :: Establishing TLS 1.3 Handshake... DONE
              </TypingAnimation>
              <TypingAnimation
                className="text-primary font-mono text-[10px] block"
                delay={1000}
                duration={28}
              >
                [SYSTEM] :: Syncing Project Scopes [US-EAST]... DONE
              </TypingAnimation>
              <TypingAnimation
                className="text-white/40 font-mono text-[10px] block"
                delay={2000}
                duration={28}
              >
                {"> AuthSphere Node Controller Initialized."}
              </TypingAnimation>
            </div>
          </TerminalUI>

          {/* Footer trust row */}
          <div className="flex items-center gap-5 px-1">
            {[
              { icon: ShieldCheck, label: "AES-256 Validated" },
              { icon: Globe, label: "Edge-Ready" },
              { icon: Zap, label: "Turbo Optimized" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <Icon className="h-3 w-3" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Integration;
