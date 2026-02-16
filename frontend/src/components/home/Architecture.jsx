import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
  Globe,
  Cpu,
  Terminal,
  ShieldCheck,
  Zap,
  Fingerprint,
  Radio,
  Server,
  Database,
  Workflow,
  BarChart3,
  History,
  Lock,
  Search,
  HardDrive,
  Share2,
} from "lucide-react";

const nodes = {
  left: [
    { id: "web", icon: Globe, title: "Web Client", color: "#3b82f6" }, // Blue
    { id: "mobile", icon: Cpu, title: "Mobile", color: "#a855f7" }, // Purple
    { id: "server", icon: Terminal, title: "Server SDK", color: "#f97316" }, // Orange
    { id: "oauth", icon: ShieldCheck, title: "OAuth 2.1", color: "#ec4899" }, // Pink
    { id: "iot", icon: Zap, title: "IoT Edge", color: "#eab308" }, // Yellow
    {
      id: "fingerprint",
      icon: Fingerprint,
      title: "Biometrics",
      color: "#f43f5e",
    }, // Rose
  ],
  right: [
    { id: "rpc", icon: Server, title: "gRPC Cluster", color: "#10b981" }, // Emerald
    { id: "db", icon: Database, title: "Postgres XL", color: "#f59e0b" }, // Amber
    { id: "stream", icon: Workflow, title: "Kafka Mesh", color: "#6366f1" }, // Indigo
    {
      id: "analytics",
      icon: BarChart3,
      title: "Realtime BI",
      color: "#06b6d4",
    }, // Cyan
    { id: "vault", icon: Lock, title: "Vault", color: "#8b5cf6" }, // Violet
    { id: "cache", icon: HardDrive, title: "Redis", color: "#84cc16" }, // Lime
  ],
};

const ArchNode = React.forwardRef(({ icon: Icon, title, color }, ref) => (
  <div
    ref={ref}
    className="z-40 flex items-center px-3 py-2.5 rounded-xl bg-background border border-border/60 hover:border-border transition-all duration-300 w-full max-w-[175px] group"
  >
    <div
      style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
      className="p-2 rounded-lg border transition-all duration-500 group-hover:scale-105"
    >
      <Icon style={{ color: color }} className="h-4 w-4" />
    </div>
    <span className="ml-3 text-[11px] font-semibold tracking-tight text-foreground/70 group-hover:text-foreground transition-colors truncate">
      {title}
    </span>
  </div>
));
ArchNode.displayName = "ArchNode";

const Architecture = () => {
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const leftRefs = useRef(nodes.left.map(() => React.createRef()));
  const rightRefs = useRef(nodes.right.map(() => React.createRef()));

  return (
    <section
      className="py-24 border-b bg-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Precision Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-3 mb-24 text-center">
          <Badge
            variant="outline"
            className="w-fit mx-auto rounded-full border-primary/20 bg-primary/5 text-primary font-bold tracking-wider text-[9px] px-3 py-0.5 uppercase"
          >
            System Topology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Integrated{" "}
            <span className="text-muted-foreground/40 font-light italic">
              Security Mesh
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto font-normal">
            A visual map of real-time data orchestration between edge nodes and
            core infrastructure.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4 relative">
          {/* Left Inputs */}
          <div className="flex flex-col gap-4 w-full max-w-[175px]">
            {nodes.left.map((node, i) => (
              <ArchNode
                key={node.id}
                ref={leftRefs.current[i]}
                icon={node.icon}
                title={node.title}
                color={node.color}
              />
            ))}
          </div>

          {/* Core Hub - Solid & Defined */}
          <div className="relative group">
            <div
              ref={coreRef}
              className="z-50 size-44 rounded-[2.5rem] bg-background border border-border shadow-xl flex flex-col items-center justify-center p-8 text-center relative"
            >
              <div className="p-5 bg-muted rounded-3xl border border-border mb-4 transition-transform duration-500 group-hover:scale-110">
                <Share2 className="h-8 w-8 text-foreground" />
              </div>
              <span className="text-xs font-bold tracking-widest text-foreground uppercase">
                AuthSphere
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-muted-foreground tracking-tighter uppercase">
                  Primary Hub
                </span>
              </div>
            </div>
          </div>

          {/* Right Infrastructure */}
          <div className="flex flex-col gap-4 w-full max-w-[175px]">
            {nodes.right.map((node, i) => (
              <ArchNode
                key={node.id}
                ref={rightRefs.current[i]}
                icon={node.icon}
                title={node.title}
                color={node.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Colorful, Minimal Beams */}
      {nodes.left.map((node, i) => (
        <AnimatedBeam
          key={`l-${node.id}`}
          containerRef={containerRef}
          fromRef={leftRefs.current[i]}
          toRef={coreRef}
          duration={3 + i * 0.5}
          curvature={i < 3 ? -40 : 40}
          pathColor={node.color}
          gradientStartColor={node.color}
          gradientStopColor={node.color}
          pathWidth={1.5}
          pathOpacity={0.25} // Slightly higher opacity since we aren't using glows
        />
      ))}

      {nodes.right.map((node, i) => (
        <AnimatedBeam
          key={`r-${node.id}`}
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={rightRefs.current[i]}
          duration={3 + i * 0.4}
          curvature={i < 3 ? -40 : 40}
          pathColor={node.color}
          gradientStartColor={node.color}
          gradientStopColor={node.color}
          pathWidth={1.5}
          pathOpacity={0.25}
        />
      ))}
    </section>
  );
};

export default Architecture;
