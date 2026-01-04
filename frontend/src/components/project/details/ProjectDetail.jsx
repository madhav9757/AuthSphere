import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";

import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectKeysCard from "./ProjectKeysCard";
import ProjectSettings from "./ProjectSettings";
import ProjectDangerZone from "./ProjectDangerZone";
import ProjectDetailSkeleton from "./ProjectDetailSkeleton";

import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      setLoading(true);
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
    loadProject();
  }, [projectId]);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  /* -------------------- ERROR -------------------- */
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <Card className="p-6 border-destructive/40">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-semibold">Unable to load project</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {error}
          </p>
        </Card>
      </div>
    );
  }

  /* -------------------- CONTENT -------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProjectDetailHeader project={project} />

      <ProjectKeysCard project={project} />

      <ProjectSettings
        project={project}
        onUpdated={loadProject}
      />

      <ProjectDangerZone
        project={project}
      />
    </div>
  );
};

export default ProjectDetail;
