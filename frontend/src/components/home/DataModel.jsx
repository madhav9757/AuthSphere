import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

/* ─── Single schema card ─── */
const SchemaNode = ({ title, label, icon: Icon, color, fields }) => (
  <div className="group relative flex flex-col bg-background border-r border-b border-border/50 last:border-r-0 p-6 hover:bg-muted/20 transition-colors duration-200">
    {/* Header */}
    <div className="flex items-start justify-between mb-5">
      <div
        className="h-9 w-9 rounded-xl border flex items-center justify-center shrink-0
                   transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: `${color}12`, borderColor: `${color}25` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-border group-hover:text-primary transition-colors duration-200 mt-0.5" />
    </div>

    {/* Title */}
    <div className="mb-5">
      <p className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.18em] mb-1">
        {label}
      </p>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
    </div>

    {/* Field rows */}
    <div className="flex flex-col gap-2.5 font-mono">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
        >
          <span className="text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">
            {field.id}
          </span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: `${color}10`, color }}
          >
            {field.type}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════ */
const DataModel = ({ schemas = [] }) => (
  <section className="relative py-20 sm:py-28 bg-transparent overflow-hidden">
    <div className="mx-auto w-[92%] max-w-7xl">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-16">
        <div className="flex flex-col gap-3">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-primary/20 bg-primary/5 text-primary
                       text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-0.5"
          >
            Technical Specification
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Data{" "}
            <span className="text-muted-foreground/40 font-light italic">
              Architecture.
            </span>
          </h2>
        </div>

        <p className="text-[12px] font-mono text-muted-foreground leading-relaxed max-w-xs md:max-w-sm md:text-right md:pb-1">
          {"// "}Scalable schema for high-throughput environments — built on
          immutable primitives with cryptographic indexing and O(1) retrieval.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border/50 rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border/40">
        {schemas.map((schema) => (
          <SchemaNode key={schema.title} {...schema} />
        ))}
      </div>

      {/* ── Footer note ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 px-1">
        <p className="text-[11px] text-muted-foreground/50 font-mono">
          4 collections · 16 fields · AES-256 encrypted at rest
        </p>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Schema synced
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default DataModel;
