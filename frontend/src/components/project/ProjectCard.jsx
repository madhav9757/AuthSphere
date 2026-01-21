import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Shield, Zap, ChevronRight, Activity } from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="group relative cursor-pointer border-border bg-card/50 hover:bg-muted/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6" fill="currentColor" />
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-black text-[9px] uppercase tracking-tighter">
            Active
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          {project.name}
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground line-clamp-1">
          Last deployed: {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground opacity-70">
            <KeyRound className="h-3 w-3" />
            <span>Public Identification Key</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border font-mono text-[11px] text-blue-600 dark:text-blue-400 break-all select-all flex items-center justify-between group/key">
            <span className="truncate pr-4">{project.publicKey}</span>
            <Badge variant="outline" className="text-[8px] opacity-40 group-hover/key:opacity-100 transition-opacity whitespace-nowrap">READ-ONLY</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border mt-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>PKCE Enabled</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <Activity className="h-3 w-3 text-blue-500" />
            <span>1.2k Requests</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
