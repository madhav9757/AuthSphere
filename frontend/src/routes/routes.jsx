import { Navigate } from "react-router-dom";

import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import Documentation from "@/pages/public/Documentation";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import ProjectDetailPage from "@/pages/project/ProjectDetailPage";
import ProjectAnalytics from "@/pages/project/ProjectAnalytics";
import SessionManagement from "@/pages/dashboard/SessionManagement";
import Pricing from "@/pages/public/Pricing";
import Settings from "@/pages/dashboard/Settings";
import AuditLogs from "@/pages/dashboard/AuditLogs";
import ProvidersPage from "@/pages/project/ProvidersPage";
import ProjectUsers from "@/pages/project/ProjectUsers";

import TemplatesPage from "@/pages/public/TemplatesPage";
import EmailCustomizationPage from "@/pages/project/EmailCustomizationPage";

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
      <MainLayout showNavAndFooter={false}>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/register", // ADD THIS ROUTE
    element: (
      <MainLayout showNavAndFooter={false}>
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
    path: "/projects/:projectId/users",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProjectUsers />
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
    path: "/projects/:projectId/email-customization",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EmailCustomizationPage />
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