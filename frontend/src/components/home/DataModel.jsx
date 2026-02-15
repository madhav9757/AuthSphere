import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Box, Shield, Zap, ArrowUpRight } from "lucide-react";

const DataModel = () => {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Technical Specification
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Data <span className="text-zinc-400">Architecture.</span>
            </h2>
          </div>
          <div className="max-w-sm pb-2">
            <p className="text-sm leading-relaxed text-zinc-500 font-mono">
              // Scalable schema optimized for high-throughput environments.
              Built on immutable primitives with native support for
              cryptographic indexing and O(1) retrieval.
            </p>
          </div>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
          <SchemaNode
            title="Project"
            label="Base"
            icon={<Box className="w-4 h-4" />}
            fields={[
              { id: "id", type: "UUID" },
              { id: "slug", type: "STR" },
              { id: "meta", type: "JSON" },
              { id: "active", type: "BOOL" },
            ]}
          />
          <SchemaNode
            title="Identity"
            label="Auth"
            icon={<Shield className="w-4 h-4" />}
            fields={[
              { id: "uid", type: "PK" },
              { id: "hash", type: "ARG2" },
              { id: "mfa", type: "BOOL" },
              { id: "role", type: "ENUM" },
            ]}
          />
          <SchemaNode
            title="Ledger"
            label="Log"
            icon={<Database className="w-4 h-4" />}
            fields={[
              { id: "tid", type: "UUID" },
              { id: "ts", type: "UNIX" },
              { id: "op", type: "OP_CODE" },
              { id: "sig", type: "HEX" },
            ]}
          />
          <SchemaNode
            title="Session"
            label="Edge"
            icon={<Zap className="w-4 h-4" />}
            fields={[
              { id: "token", type: "JWT" },
              { id: "exp", type: "TTL" },
              { id: "geo", type: "IP" },
              { id: "agent", type: "STR" },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

const SchemaNode = ({ title, label, fields, icon }) => (
  <Card className="rounded-none border-none bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
    <CardHeader className="p-8 pb-4">
      <div className="flex justify-between items-start mb-6">
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
      </div>
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
          {label}
        </span>
        <CardTitle className="text-xl font-bold tracking-tight">
          {title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-8 pt-4">
      <div className="space-y-3 font-mono">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between text-[11px]"
          >
            <span className="text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              {field.id}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              {field.type}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default DataModel;
