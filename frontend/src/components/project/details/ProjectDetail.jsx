import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";

// Component Imports
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectKeysCard from "./ProjectKeysCard";
import ProjectSettings from "./ProjectSettings";
import ProvidersPage from "@/pages/project/ProvidersPage";

import ProjectUsersCard from "./ProjectUsersCard";
import ProjectWebhooksCard from "./ProjectWebhooksCard";
import LiveEventsStream from "../LiveEventsStream";

// UI Imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Key,
  Users,
  Webhook,
  Settings2,
  Globe,
  Terminal,
} from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProject(projectId);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to load project");
      }

      setProject(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  /* ERROR STATE */
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button onClick={loadProject} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* MAIN RENDER */
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <ProjectDetailHeader project={project} />

      <Tabs defaultValue="keys" className="space-y-8 bg-transparent">
        <div className="sticky top-16 z-10 py-4 bg-transparent backdrop-blur-sm border-b border-white/5">
          <TabsList className="h-12 p-1 bg-transparent rounded-xl border border-white/5">
            <TabsTrigger
              value="keys"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="webhooks"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Settings2 className="h-4 w-4" />
              Project Settings
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Globe className="h-4 w-4" />
              Identity Catalog
            </TabsTrigger>
            <TabsTrigger
              value="telemetry"
              className="rounded-lg px-6 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Terminal className="h-4 w-4" />
              Live Telemetry
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="keys"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectKeysCard project={project} onKeysRotated={loadProject} />
        </TabsContent>

        <TabsContent
          value="users"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectUsersCard projectId={projectId} />
        </TabsContent>

        <TabsContent
          value="webhooks"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectWebhooksCard project={project} onUpdated={loadProject} />
        </TabsContent>

        <TabsContent
          value="settings"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <ProjectSettings project={project} onUpdated={loadProject} />
        </TabsContent>

        <TabsContent
          value="catalog"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="bg-card/50 rounded-2xl border border-primary/10 overflow-hidden p-8">
            <ProvidersPage embedded={true} onUpdated={loadProject} />
          </div>
        </TabsContent>

        <TabsContent
          value="telemetry"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                Command Center Telemetry
              </h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Monitor authentication flows, token lifecycle, and cryptographic
                handshakes in real-time. Perfect for debugging integrations and
                monitoring system health.
              </p>
            </div>
            <LiveEventsStream projectId={projectId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
