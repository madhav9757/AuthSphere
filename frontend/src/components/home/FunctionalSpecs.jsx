import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const FunctionalSpecs = ({ modules }) => {
  return (
    <section className="py-24 border-b bg-background relative overflow-hidden">
      {/* Subtle Ambient Light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 opacity-50" />

      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-24">
          <Badge
            variant="outline"
            className="w-fit border-primary/20 bg-primary/5 text-primary font-medium tracking-widest text-[10px] px-3 py-0.5 rounded-full uppercase"
          >
            Technical Architecture
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Enterprise{" "}
            <span className="text-muted-foreground/50 font-light">
              Subsystems
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
            Deep dive into the core primitives that drive the AuthSphere
            environment. Architected for sub-millisecond execution and
            horizontal scale.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
          {modules.map((module, idx) => (
            <div key={idx} className="group relative flex flex-col gap-6">
              {/* Refined Index Indicator */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs font-mono text-primary/60 bg-primary/5 px-2 py-1 rounded">
                  0{idx + 1}
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
              </div>

              <div className="flex items-start gap-5">
                {/* Icon Container - Sleeker geometry */}
                <div className="relative shrink-0">
                  <div className="p-3.5 rounded-xl bg-background border border-border group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-all duration-500">
                    {React.cloneElement(module.icon, {
                      className:
                        "h-6 w-6 text-primary/80 group-hover:text-primary transition-colors",
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {module.title}
                  </h3>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center text-[10px] font-medium text-emerald-500/80">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      SYSTEM_READY
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/60">
                      // SCALABLE_NODE
                    </span>
                  </div>
                </div>
              </div>

              {/* Description with subtle accent line */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border group-hover:bg-primary/40 transition-colors" />
                <p className="text-muted-foreground leading-relaxed text-base font-normal">
                  {module.description}
                </p>
              </div>

              {/* Detail Cards - Cleaner, smaller text, more breathable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {module.details.map((detail, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all flex flex-col gap-2 group/item"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 group-hover/item:text-primary transition-colors" />
                      <span className="text-[11px] font-semibold uppercase tracking-tight text-foreground/70">
                        {detail.split(":")[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {detail.split(":")[1] ||
                        "Automated security handshake with global propagation."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunctionalSpecs;
