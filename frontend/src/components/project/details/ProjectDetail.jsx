import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";

// Component Imports
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectKeysCard from "./ProjectKeysCard";
import ProjectSettings from "./ProjectSettings";
import ProjectDangerZone from "./ProjectDangerZone";
import ProjectUsersCard from "./ProjectUsersCard";
import ProjectDetailSkeleton from "./ProjectDetailSkeleton";

// UI Imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProject(projectId);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to load project");
      }

      setProject(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  /* -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-700">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Pulling project resources...</p>
      </div>
    );
  }

  /* -------------------- ERROR STATE -------------------- */
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 animate-in fade-in zoom-in-95 duration-300">
        <Card className="border-rose-100 dark:border-rose-900 shadow-xl shadow-rose-500/5 bg-card">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-20 w-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground italic">Resource Error.</h2>
            <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              We encountered an issue while retrieving the details for this project: <br />
              <span className="text-rose-600 dark:text-rose-400 font-bold">{error}</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full px-6 border-border font-bold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Exit to Dashboard
                </Button>
              </Link>
              <Button onClick={loadProject} className="bg-foreground text-background hover:bg-muted-foreground rounded-full px-8 font-bold transition-all">
                <RefreshCw className="mr-2 h-4 w-4" /> Force Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------- MAIN RENDER -------------------- */
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Branding & Meta */}
      <ProjectDetailHeader project={project} />

      <div className="grid grid-cols-1 gap-14">

        {/* Section 1: API & Credentials */}
        <section className="space-y-6">
          <div className="px-1 flex items-center gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
              Security Credentials
            </h3>
            <div className="h-[1px] w-full bg-border opacity-50" />
          </div>
          <ProjectKeysCard
            project={project}
            onKeysRotated={loadProject}
          />
        </section>

        {/* Section 2: User Directory */}
        <section className="space-y-6">
          <div className="px-1 flex items-center gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
              Identity Graph
            </h3>
            <div className="h-[1px] w-full bg-border opacity-50" />
          </div>
          <ProjectUsersCard projectId={projectId} />
        </section>

        {/* Section 3: Configuration */}
        <section className="space-y-6">
          <div className="px-1 flex items-center gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
              Environment Variables
            </h3>
            <div className="h-[1px] w-full bg-border opacity-50" />
          </div>
          <ProjectSettings
            project={project}
            onUpdated={loadProject}
          />
        </section>

        {/* Section 4: Critical Actions */}
        <section className="pt-8 border-t border-border/50">
          <ProjectDangerZone
            project={project}
          />
        </section>

      </div>
    </div>
  );
};

export default ProjectDetail;