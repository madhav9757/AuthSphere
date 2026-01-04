import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="cursor-pointer transition-all hover:border-primary/40 hover:bg-muted/40"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {project.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <KeyRound className="h-4 w-4" />
          <span className="font-medium">Public Key</span>
        </div>

        <p className="text-sm font-mono break-all">
          {project.publicKey}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
