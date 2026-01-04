import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  Calendar,
  Hash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="space-y-3">

        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="w-fit px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">
              {project.name}
            </CardTitle>
            <CardDescription>
              Project overview & configuration
            </CardDescription>
          </div>
        </div>

      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-4 text-sm">

        {/* Project ID */}
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            ID:
          </span>
          <Badge variant="secondary">
            {project._id}
          </Badge>
        </div>

        {/* Created At */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Created:
          </span>
          <span>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProjectDetailHeader;
