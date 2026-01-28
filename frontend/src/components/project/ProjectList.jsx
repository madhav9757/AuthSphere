import React, { useEffect, useState } from "react";

import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import ProjectSkeleton from "./ProjectSkeleton";
import EmptyState from "./EmptyState";

import { getProjects } from "@/api/ProjectAPI";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    setProjects(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectSkeleton />
        <ProjectSkeleton />
        <ProjectSkeleton />
      </div>
    );
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground text-sm">
            Manage your authentication projects
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}

          {/* Create CTA */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group h-full min-h-[200px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Add New Project</p>
              <p className="text-xs text-muted-foreground">Deploy a new auth project</p>
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadProjects}
      />
    </section>
  );
};

export default ProjectList;
