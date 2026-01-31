import { Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register"; // ADD THIS
import Dashboard from "@/pages/Dashboard";
import Documentation from "@/pages/Documentation";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ProjectAnalytics from "@/pages/ProjectAnalytics";
import SessionManagement from "@/pages/SessionManagement";
import Pricing from "@/pages/Pricing";
import Settings from "@/pages/Settings";
import AuditLogs from "@/pages/AuditLogs";
import ProvidersPage from "@/pages/ProvidersPage";

import TemplatesPage from "@/pages/TemplatesPage";

export const routes = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/templates",
    element: (
      <MainLayout>
        <TemplatesPage />
      </MainLayout>
    ),
  },
  {
    path: "/pricing",
    element: (
      <MainLayout>
        <Pricing />
      </MainLayout>
    ),
  },
  {
    path: "/docs",
    element: (
      <MainLayout>
        <Documentation />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <MainLayout>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/register", // ADD THIS ROUTE
    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProjectDetailPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId/analytics",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProjectAnalytics />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId/providers",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProvidersPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/sessions",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SessionManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/audit-logs",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AuditLogs />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <div className="flex h-[calc(100vh-160px)] items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground">Page Not Found</p>
          </div>
        </div>
      </MainLayout>
    ),
  },
];