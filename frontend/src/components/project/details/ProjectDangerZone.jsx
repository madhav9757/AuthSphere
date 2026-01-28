import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { deleteProject } from "@/api/ProjectAPI";

const ProjectDangerZone = ({ project }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteProject(project._id);

      if (res?.success) {
        toast.success("Project deleted successfully");
        navigate("/dashboard");
      } else {
        toast.error(res?.message || "Failed to delete project");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setOpen(false);
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
          Irreversible actions that will permanently delete this project
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold mb-1">Delete this project</p>
          <p className="text-sm text-muted-foreground max-w-lg">
            Permanently delete all project data, including API keys and user sessions. 
            This action cannot be undone.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              Delete Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="text-center">Delete Project?</DialogTitle>
              <DialogDescription className="text-center">
                This action cannot be undone. Type <strong>{project.name}</strong> to confirm.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Label htmlFor="confirm" className="sr-only">Project name</Label>
              <Input
                id="confirm"
                placeholder={project.name}
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="text-center"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={confirmName !== project.name || isDeleting}
                onClick={handleDelete}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProjectDangerZone;
