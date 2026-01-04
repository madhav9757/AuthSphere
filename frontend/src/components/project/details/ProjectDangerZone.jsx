import { Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { deleteProject } from "@/api/ProjectAPI";

const ProjectDangerZone = ({ project }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const res = await deleteProject(project._id);

    if (res?.success) {
      navigate("/dashboard");
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Destructive actions that cannot be undone
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">
            Delete this project
          </p>
          <p className="text-sm text-muted-foreground">
            Permanently remove this project and all associated data.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectDangerZone;
