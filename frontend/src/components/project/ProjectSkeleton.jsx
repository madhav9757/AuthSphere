const ProjectSkeleton = () => {
  return (
    <div className="animate-pulse bg-muted rounded-3xl p-8 h-[240px] border border-border/50 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 bg-background/50 rounded-2xl" />
          <div className="h-5 w-16 bg-background/30 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-background/50 rounded-lg" />
          <div className="h-4 w-1/2 bg-background/30 rounded-lg" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-1/4 bg-background/20 rounded-full" />
        <div className="h-10 w-full bg-background/40 rounded-xl" />
      </div>
    </div>
  );
};

export default ProjectSkeleton;
