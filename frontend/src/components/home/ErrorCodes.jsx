import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ErrorCodes = ({ errorCodes }) => {
  // Mapping codes to specific colors for a "colorful" but sleek look
  const getStatusColor = (code) => {
    if (code.startsWith("4")) return "text-amber-500 bg-amber-500";
    if (code.startsWith("5")) return "text-rose-500 bg-rose-500";
    return "text-blue-500 bg-blue-500";
  };

  return (
    <section className="py-24 bg-transparent relative border-b overflow-hidden">
      {/* Subtle background detail */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 flex flex-col items-start">
          <Badge
            variant="outline"
            className="mb-4 border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-widest text-[9px] px-3 py-0.5 rounded-full"
          >
            Dictionary v1.0
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Predictable{" "}
            <span className="text-muted-foreground/40 font-light italic">
              Response Flows
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-normal max-w-2xl leading-relaxed">
            Deterministic status codes for sub-millisecond error resolution.
            Automate handling with machine-readable primitives.
          </p>
        </div>

        <div className="max-w-6xl mx-auto border border-border/50 rounded-3xl bg-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[160px] font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 py-5 pl-10">
                  Identifier
                </TableHead>
                <TableHead className="w-[220px] font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                  Status Label
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 pr-10">
                  Resolution Analysis
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorCodes.map((err) => {
                const colors = getStatusColor(err.code).split(" ");
                return (
                  <TableRow
                    key={err.code}
                    className="group border-b border-border/40 last:border-0 transition-all hover:bg-muted/20"
                  >
                    {/* The "Colorful" minimalist accent bar */}
                    <TableCell className="relative font-mono text-sm py-8 pl-10">
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[3px] ${colors[1]} opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                      <span className={`${colors[0]} font-bold tracking-tight`}>
                        {err.code}
                      </span>
                    </TableCell>

                    <TableCell className="font-semibold text-[15px] text-foreground">
                      {err.message}
                    </TableCell>

                    <TableCell className="pr-10">
                      <div className="flex flex-col gap-3">
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                          {err.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight py-1 px-3 rounded-full border ${colors[1]}/10 ${colors[0]} bg-background`}
                          >
                            <span className="text-muted-foreground/60">
                              Solution:
                            </span>
                            {err.solution}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default ErrorCodes;
