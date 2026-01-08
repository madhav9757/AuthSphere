import { Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register"; // ADD THIS
import Dashboard from "@/pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import ProjectDetailPage from "@/pages/ProjectDetailPage";

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
    path: "*",
    element: (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Page Not Found</p>
        </div>
      </div>
    ),
  },
];