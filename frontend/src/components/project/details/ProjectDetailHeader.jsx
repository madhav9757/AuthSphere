import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  Calendar,
  Hash,
  Activity,
  BarChart3,
  ArrowUpRight,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pb-10 border-b border-border/60 mb-10">
      {/* 1. Breadcrumb / Back Navigation */}
      <nav className="flex items-center gap-2 mb-8 animate-in slide-in-from-left-2 duration-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="h-8 rounded-full text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" />
          Workspace
        </Button>
        <span className="text-border">/</span>
        <span className="text-xs font-black text-foreground uppercase tracking-widest opacity-80">{project.name}</span>
      </nav>

      {/* 2. Main Title Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-start gap-4">
          <div className="mt-1 bg-white border border-border/40 p-2.5 rounded-2xl shadow-xl shadow-blue-500/5 transition-transform hover:scale-105 active:scale-95 duration-300">
            <img src="/assets/logo.png" alt="AuthSphere Logo" className="h-7 w-7 object-contain mix-blend-multiply" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-foreground italic">
                {project.name}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-black px-3 py-1 text-[10px] uppercase tracking-tighter">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
                Live Node
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
              Project ID <span className="text-foreground font-bold">{project._id}</span> is fully provisioned and accepting authentication requests.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${projectId}/analytics`)}
            className="rounded-full font-bold border-border shadow-sm hover:bg-muted/50 px-6 transition-all"
          >
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            Vitals
            <ArrowUpRight className="h-3 w-3 ml-2 opacity-40" />
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95 px-8 py-6 h-auto"
          >
            Update Infrastructure
          </Button>
        </div>
      </div>

      {/* 3. Meta Data Strip */}
      <div className="flex flex-wrap items-center gap-8 mt-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={copyId}
                className="group flex items-center gap-3 px-4 py-2 bg-muted/40 hover:bg-muted/70 rounded-xl cursor-pointer transition-all border border-border/40 hover:border-border active:scale-95"
              >
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-tight">Shard ID: {project._id}</span>
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-100" />}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background font-bold text-[10px] rounded-lg">Click to copy Shard ID</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Provisioned</span>
            <span className="text-[11px] font-bold text-foreground">
              {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Engine Version</span>
            <span className="text-[11px] font-bold text-foreground">
              AuthSphere v1.0.4 SDK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;