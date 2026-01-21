import React, { useEffect, useState } from "react";

import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import ProjectSkeleton from "./ProjectSkeleton";
import EmptyState from "./EmptyState";

import { getProjects } from "@/api/ProjectAPI";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Plus, FolderKanban, Sparkles } from "lucide-react";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    setProjects(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectSkeleton />
        <ProjectSkeleton />
        <ProjectSkeleton />
      </div>
    );
  }

  return (
    <section className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
            <div className="bg-white border border-border/40 p-1.5 rounded-xl shadow-sm">
              <img src="/assets/logo.png" alt="Logo" className="h-5 w-5 object-contain mix-blend-multiply" />
            </div>
            Active Workspaces
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            Manage and organize your identity infrastructure shards
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
          <Plus className="h-4 w-4 mr-2" />
          Create Shard
        </Button>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}

          {/* Create CTA Placeholder */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group h-full min-h-[220px] rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-indigo-600/50 hover:bg-muted/30 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">Add New Shard</p>
              <p className="text-xs text-muted-foreground p-2">Deploy a new identity project</p>
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
