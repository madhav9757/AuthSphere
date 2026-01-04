import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import ProjectList from "@/components/project/ProjectList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  User,
  Mail,
  FolderKanban,
  Activity,
  ShieldCheck,
} from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  /* -------------------- LOADING STATE -------------------- */
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------- DASHBOARD -------------------- */
  return (
    <div className="min-h-screen bg-muted/40 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Overview of your account and projects
            </p>
          </div>

          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-4 w-4" />
            Secure
          </Badge>
        </div>

        <Separator />

        {/* ================= PROFILE ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal account information
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.picture} alt={user.username} />
                <AvatarFallback>
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  {user.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <FolderKanban className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Projects
                </p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Activity
                </p>
                <p className="text-2xl font-bold">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Account Status
                </p>
                <p className="text-2xl font-bold">Verified</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= PROJECTS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Your Projects
            </CardTitle>
            <CardDescription>
              Manage and organize your workspaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectList />
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
