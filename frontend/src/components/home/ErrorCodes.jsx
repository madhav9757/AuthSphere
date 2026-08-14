import React from "react";

// 1. Move static data outside the component to prevent recreation on every render
const STATUS_COLORS = [
  { text: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  {
    text: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  {
    text: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { text: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

const getStatusTheme = (index) => STATUS_COLORS[index % STATUS_COLORS.length];

// 2. Extract the row item into its own component for better readability
const ErrorCodeRow = ({ error, index }) => {
  const theme = getStatusTheme(index);
  const Icon = error.icon;

  return (
    <div className="flex flex-col sm:flex-row group border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
      {/* Left Column: Icon & Code */}
      <div className="flex items-center gap-5 sm:w-2/5 p-5 sm:border-r border-border/50 shrink-0">
        {Icon && (
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-none border ${theme.border} ${theme.bg}`}
          >
            <Icon className={`w-5 h-5 ${theme.text}`} />
          </div>
        )}
        <span
          className={`font-mono text-base font-bold tracking-tight ${theme.text}`}
        >
          {error.code}
        </span>
      </div>

      {/* Right Column: Title & Description */}
      <div className="flex flex-col justify-center p-5 sm:w-3/5">
        <span className="text-base font-semibold text-foreground mb-1.5 tracking-tight">
          {error.message}
        </span>
        <span className="text-sm text-foreground/80 leading-relaxed font-medium">
          {error.description}
        </span>
      </div>
    </div>
  );
};

const ErrorCodes = ({ errorCodes = [] }) => {
  return (
    <div className="relative border border-border/50 rounded-none bg-background flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-muted/10">
        <h3 className="text-sm font-bold text-foreground/90 tracking-[0.2em] uppercase">
          API Response Codes
        </h3>
      </div>

      {/* List container */}
      <div className="flex flex-col max-h-112.5 overflow-y-auto no-scrollbar">
        {errorCodes.map((err, index) => (
          <ErrorCodeRow key={err.code} error={err} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ErrorCodes;
