import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <FolderPlus className="h-10 w-10 text-muted-foreground mb-4" />

      <h3 className="text-lg font-semibold">
        No projects yet
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        Get started by creating your first project
      </p>

      <Button onClick={onCreate} className="mt-6">
        <FolderPlus className="h-4 w-4 mr-2" />
        Create Project
      </Button>
    </div>
  );
};

export default EmptyState;
