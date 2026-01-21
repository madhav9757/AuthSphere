import { Button } from "@/components/ui/button";
import { FolderPlus, Sparkles } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border p-20 text-center bg-muted/20 animate-in fade-in zoom-in-95 duration-500">
      <div className="h-20 w-20 rounded-3xl bg-background border border-border flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-xl shadow-blue-500/5 transition-transform hover:rotate-6">
        <FolderPlus size={32} />
      </div>

      <h3 className="text-2xl font-black text-foreground italic flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        Fresh Slate.
      </h3>

      <p className="text-muted-foreground mt-2 max-w-sm font-medium">
        It looks like you haven't deployed any identity shards yet. Start building your ecosystem in seconds.
      </p>

      <Button onClick={onCreate} className="mt-10 rounded-full px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
        <FolderPlus className="h-5 w-5 mr-3" />
        Provision My First Project
      </Button>

      <p className="mt-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
        Takes less than 30 seconds
      </p>
    </div>
  );
};

export default EmptyState;
