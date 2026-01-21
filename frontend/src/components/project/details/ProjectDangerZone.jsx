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
        toast.success("Project permanently deleted");
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
    <Card className="border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/[0.02] overflow-hidden transition-all hover:bg-rose-500/10 dark:hover:bg-rose-500/[0.05] group">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-rose-600 dark:text-rose-500 text-lg font-black uppercase tracking-widest">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          Irreversible Actions
        </CardTitle>
        <CardDescription className="text-rose-700/70 dark:text-rose-400/50 font-medium">
          These operations dismantle project infrastructure and cannot be rolled back.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-4 pb-8">
        <div className="space-y-1">
          <p className="font-black text-foreground text-base tracking-tight italic">Purge project ecosystem</p>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg font-medium">
            Decommission all identity shards, invalidate every active session, and purge the user directory from our global graph.
            All API keys for <span className="text-foreground font-bold">{project.name}</span> will be instantly revoked.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-rose-500/20 hover:shadow-none transition-all active:scale-95 border-none"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Terminate Shard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-3xl border-border bg-card shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-600" />

            <DialogHeader className="items-center text-center pt-8">
              <div className="h-20 w-20 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mb-6">
                <AlertTriangle className="h-10 w-10 text-rose-500 animate-bounce hover:pause" />
              </div>
              <DialogTitle className="text-2xl font-black text-foreground italic">Confirm Termination?</DialogTitle>
              <DialogDescription className="text-muted-foreground pt-3 font-medium text-sm leading-relaxed px-4">
                This action is final and will purge all data associated with this identity shard.
                Verify by entering <span className="font-mono font-black text-foreground bg-muted px-2 py-0.5 rounded border border-border">{project.name}</span> below.
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 px-6">
              <Input
                placeholder="Identity Name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="rounded-2xl border-border bg-background focus:ring-4 focus:ring-rose-500/10 text-center font-black text-lg py-8 uppercase tracking-widest"
              />
            </div>

            <DialogFooter className="sm:justify-center gap-3 pb-8 px-6">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-full px-8 font-black text-muted-foreground hover:bg-muted transition-all uppercase tracking-widest text-[10px]"
              >
                Abort
              </Button>
              <Button
                variant="destructive"
                disabled={confirmName !== project.name || isDeleting}
                onClick={handleDelete}
                className="rounded-full px-10 py-6 h-auto font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 active:scale-95 border-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin text-white" />
                    Purging...
                  </>
                ) : (
                  "Confirm Deletion"
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