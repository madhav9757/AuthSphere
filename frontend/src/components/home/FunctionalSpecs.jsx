import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

/* ─── Single feature detail pill ─── */
const DetailCard = ({ detail }) => {
  const [label, ...rest] = detail.split(":");
  const body = rest.join(":").trim() || "Automated with global propagation.";

  return (
    <div className="group/item flex items-start gap-2.5 p-3.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/70 transition-all duration-200">
      <CheckCircle2 className="h-3.5 w-3.5 mt-px shrink-0 text-primary/50 group-hover/item:text-primary transition-colors" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70 leading-none mb-1">
          {label.trim()}
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
};

/* ─── Single module card ─── */
const ModuleCard = ({ module, idx }) => (
  <div className="group relative flex flex-col gap-5">
    {/* Index rule */}
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono font-semibold text-primary/60 bg-primary/6 border border-primary/12 px-2 py-0.5 rounded-md tabular-nums">
        0{idx + 1}
      </span>
      <div className="h-px flex-1 bg-linear-to-r from-border/60 to-transparent" />
    </div>

    {/* Title + icon row */}
    <div className="flex items-start gap-4">
      <div
        className="shrink-0 h-10 w-10 rounded-xl bg-background border border-border/60 flex items-center justify-center
                      group-hover:border-primary/30 group-hover:shadow-[0_0_16px_rgba(var(--primary-rgb),.08)]
                      transition-all duration-300"
      >
        {React.cloneElement(module.icon, {
          className:
            "h-4.5 w-4.5 text-primary/70 group-hover:text-primary transition-colors",
        })}
      </div>

      <div className="flex flex-col gap-1 pt-0.5 min-w-0">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground leading-tight">
          {module.title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500/80 uppercase tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Active
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/40 hidden sm:inline">
            // scalable_node
          </span>
        </div>
      </div>
    </div>

    {/* Description with accent line */}
    <div className="relative pl-5">
      <div className="absolute left-0 top-0 bottom-0 w-[1.5px] rounded-full bg-border group-hover:bg-primary/30 transition-colors duration-300" />
      <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
        {module.description}
      </p>
    </div>

    {/* Detail grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {module.details.map((detail, i) => (
        <DetailCard key={i} detail={detail} />
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════ */
const FunctionalSpecs = ({ modules }) => (
  <section className="relative py-20 sm:py-28 bg-transparent overflow-hidden">
    {/* Ambient glows */}
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/4 blur-[100px] pointer-events-none -z-10" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/4 blur-[100px] pointer-events-none -z-10" />

    <div className="mx-auto w-[92%] max-w-7xl">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 mb-14 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
          Enterprise{" "}
          <span className="text-muted-foreground/40 font-light italic">
            Subsystems
          </span>
        </h2>

        <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
          Deep dive into the core primitives driving AuthSphere. Architected for
          sub-millisecond execution and horizontal scale.
        </p>
      </div>

      {/* ── Modules grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-20 gap-y-14 sm:gap-y-16">
        {modules.map((module, idx) => (
          <ModuleCard key={idx} module={module} idx={idx} />
        ))}
      </div>
    </div>
  </section>
);

export default FunctionalSpecs;
