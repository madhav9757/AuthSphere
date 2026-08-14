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
          {/* Terminal block */}
          <TerminalUI
            className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden"
            copyable
            codeToCopy={`const { AuthSphere } = require('@authsphere/node-sdk');\n\nconst auth = new AuthSphere({\n  projectId: process.env.AUTH_PROJECT_ID,\n  secretKey: process.env.AUTH_SECRET_KEY,\n});\n\napp.get('/v1/user/profile', auth.middleware(), (req, res) => {\n  const user = req.session.user;\n  res.json({ ack: "SECURE_READY", email: user.email });\n});`}
          >
            {/* Simple Header */}
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
              <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                app.js
              </span>
            </div>

            {/* Clean Code Block */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-white/80 whitespace-pre">
                <code>{`const { AuthSphere } = require('@authsphere/node-sdk');

const auth = new AuthSphere({
  projectId: process.env.AUTH_PROJECT_ID,
  secretKey: process.env.AUTH_SECRET_KEY,
});

app.get('/v1/user/profile', auth.middleware(), (req, res) => {
  const user = req.session.user;
  res.json({ ack: "SECURE_READY", email: user.email });
});`}</code>
              </pre>
            </div>

            {/* Static Output */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
              <span className="text-xs font-mono text-emerald-400">
                {"> AuthSphere Node Controller Initialized."}
              </span>
            </div>
          </TerminalUI>
        </div>
      </div>
    </div>
  </section>
);

export default Integration;
