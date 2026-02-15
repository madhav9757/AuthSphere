import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Terminal as TerminalUI,
  TypingAnimation,
} from "@/components/ui/terminal";
import {
  AlertTriangle,
  Code2,
  Lock,
  Webhook,
  Globe,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from "lucide-react";

const Integration = () => {
  return (
    <section className="py-24 border-b bg-transparent overflow-hidden relative">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-[95vw] mx-auto px-6">
        <div className="grid xl:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="max-w-5xl">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Badge
                  variant="outline"
                  className="text-primary border-primary/20 bg-primary/5 px-4 font-black uppercase tracking-widest text-[10px]"
                >
                  <Code2 className="mr-2 h-3.5 w-3.5" />
                  Edge Integration
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-tighter"
                >
                  v2.4.0 Stable
                </Badge>
              </div>

              <h2 className="text-5xl font-black tracking-tighter mb-6 text-foreground leading-[0.9]">
                Zero-Trust <br />
                <span className="text-primary">Implementation.</span>
              </h2>

              <p className="text-muted-foreground mb-12 text-lg leading-relaxed max-w-xl font-medium">
                AuthSphere's high-performance SDKs automate the cryptography,
                session persistence, and global edge handshakes.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-12">
                <div className="space-y-8">
                  <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-muted rounded-xl border border-border group-hover:border-primary/50 transition-colors">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1 uppercase tracking-tight text-foreground">
                        Stateless Auth
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Signed RS256 Bearer tokens for distributed verification.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-muted rounded-xl border border-border group-hover:border-emerald-500/50 transition-colors">
                      <Webhook className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1 uppercase tracking-tight text-foreground">
                        Event Mesh
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Real-time HMAC-SHA256 webhooks for async processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-muted rounded-xl border border-border group-hover:border-purple-500/50 transition-colors">
                      <Cpu className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1 uppercase tracking-tight text-foreground">
                        JIT Provisioning
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Dynamic user creation and profile synchronization
                        on-fly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-muted rounded-xl border border-border group-hover:border-orange-500/50 transition-colors">
                      <Layers className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1 uppercase tracking-tight text-foreground">
                        Multi-Tenancy
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Logical isolation for enterprise-ready SaaS
                        applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Card to make it "Busy" */}
              <div className="p-6 rounded-2xl border border-border bg-muted/30 grid grid-cols-3 gap-4">
                <div className="text-center border-r border-border">
                  <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">
                    Latency
                  </div>
                  <div className="text-xl font-black text-foreground">
                    &lt;12ms
                  </div>
                </div>
                <div className="text-center border-r border-border">
                  <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">
                    Verification
                  </div>
                  <div className="text-xl font-black text-emerald-500">
                    Fixed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">
                    Uptime
                  </div>
                  <div className="text-xl font-black text-primary">99.99%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Secure Environment Alpha
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-black text-foreground uppercase">
                    Load: 0.14
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-orange-400" />
                  <span className="text-[10px] font-black text-foreground uppercase">
                    Region: US-EAST
                  </span>
                </div>
              </div>
            </div>

            <TerminalUI
              className="shadow-[0_0_50px_-12px_rgba(0,0,0,1)] bg-black border-white/5 min-h-[480px] ring-1 ring-white/5"
              sequence={false}
              copyable
              codeToCopy={`const { AuthSphere } = require('@authsphere/node-sdk');\n\nconst auth = new AuthSphere({\n  projectId: process.env.AUTH_PROJECT_ID,\n  secretKey: process.env.AUTH_SECRET_KEY,\n});\n\napp.get('/api/protected', auth.middleware(), (req, res) => {\n  const user = req.session.user;\n  res.json({ message: \`Hello \${user.email}\` });\n});`}
            >
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Authorized_Shell_v1.0.node
                </span>
              </div>

              <div className="text-gray-500 italic mb-2">
                // 1. Import Security Fabric
              </div>
              <div className="flex flex-wrap gap-x-1.5 mb-4">
                <span className="text-pink-400 font-bold">const</span>
                <span className="text-yellow-200">{"{ AuthSphere }"}</span>
                <span className="text-pink-400">=</span>
                <span className="text-cyan-400">require</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">'@authsphere/node-sdk'</span>
                <span className="text-white">);</span>
              </div>

              <div className="text-gray-500 italic mb-2">
                // 2. Initialize Orchestrator
              </div>
              <div className="flex flex-wrap gap-x-1.5">
                <span className="text-pink-400 font-bold">const</span>
                <span className="text-white font-medium">auth</span>
                <span className="text-pink-400">=</span>
                <span className="text-pink-400">new</span>
                <span className="text-yellow-200">AuthSphere</span>
                <span className="text-white">({"{ "}</span>
              </div>

              <div className="ml-6 flex gap-x-1.5">
                <span className="text-blue-300">projectId:</span>
                <span className="text-orange-400">process.env.APP_ID</span>
                <span className="text-white">,</span>
              </div>

              <div className="ml-6 flex gap-x-1.5 mb-4">
                <span className="text-blue-300">secretKey:</span>
                <span className="text-orange-400">process.env.MASTER_KEY</span>
                <span className="text-white">,</span>
              </div>

              <div className="text-white mb-6">{"});"}</div>

              <div className="text-gray-500 italic mb-2">
                // 3. Enforce Identity Guards
              </div>
              <div className="flex flex-wrap gap-x-1.5">
                <span className="text-white">app.</span>
                <span className="text-cyan-400">get</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">'/v1/user/profile'</span>
                <span className="text-white">,</span>
                <span className="text-white">auth.</span>
                <span className="text-cyan-400">middleware</span>
                <span className="text-white">(),</span>
                <span className="text-white">(req, res)</span>
                <span className="text-pink-400 font-bold">=&gt;</span>
                <span className="text-white">{"{"}</span>
              </div>

              <div className="ml-6 flex flex-wrap gap-x-1.5">
                <span className="text-pink-400">const</span>
                <span className="text-white">user</span>
                <span className="text-pink-400">=</span>
                <span className="text-white">req.session.user;</span>
              </div>

              <div className="ml-6 flex flex-wrap gap-x-1.5 text-white">
                <span>res.</span>
                <span className="text-cyan-400">json</span>
                <span>({"{ "}</span>
                <span className="text-white">ack:</span>
                <span className="text-emerald-400">"SECURE_READY"</span>
                <span className="text-white">, email:</span>
                <span>user.email</span>
                <span>{" } );"}</span>
              </div>

              <div className="text-white">{"});"}</div>

              <div className="mt-8 pt-4 border-t border-white/5 space-y-1">
                <TypingAnimation
                  className="text-emerald-500 font-mono text-[10px] block"
                  duration={30}
                >
                  [SYSTEM] :: Establishing TLS 1.3 Handshake... DONE
                </TypingAnimation>
                <TypingAnimation
                  className="text-primary font-mono text-[10px] block"
                  delay={1000}
                  duration={30}
                >
                  [SYSTEM] :: Syncing Project Scopes [US-EAST]... DONE
                </TypingAnimation>
                <TypingAnimation
                  className="text-gray-400 font-mono text-[10px] block"
                  delay={2000}
                  duration={30}
                >
                  &gt; AuthSphere Node Controller Initialized.
                </TypingAnimation>
              </div>
            </TerminalUI>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">
                  AES-256 Validated
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">
                  Edge-Ready
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">
                  Turbo Optimized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
