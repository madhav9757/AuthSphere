import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";

// Component Imports
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectKeysCard from "./ProjectKeysCard";
import ProjectSettings from "./ProjectSettings";

import ProjectUsersCard from "./ProjectUsersCard";

// UI Imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  /* ERROR STATE */
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button onClick={loadProject} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* MAIN RENDER */
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <ProjectDetailHeader project={project} />

      <div className="space-y-8">

        {/* API Keys */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground">API Credentials</h3>
            <Separator className="flex-1" />
          </div>
          <ProjectKeysCard
            project={project}
            onKeysRotated={loadProject}
          />
        </section>

        {/* Users */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Users</h3>
            <Separator className="flex-1" />
          </div>
          <ProjectUsersCard projectId={projectId} />
        </section>

        {/* Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Settings</h3>
            <Separator className="flex-1" />
          </div>
          <ProjectSettings
            project={project}
            onUpdated={loadProject}
          />
        </section>



      </div>
    </div>
  );
};

export default ProjectDetail;
