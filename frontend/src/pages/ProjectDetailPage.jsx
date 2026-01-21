import ProjectDetail from "@/components/project/details/ProjectDetail";

const ProjectDetailPage = () => {
  return (
    <main className="min-h-screen bg-background/50 dark:bg-slate-900/50">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* The Core Content */}
        <ProjectDetail />
      </div>
    </main>
  );
};

export default ProjectDetailPage;