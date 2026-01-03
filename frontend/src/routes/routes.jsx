import { Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home'; // We'll create this next
import ProtectedRoute from './ProtectedRoute';

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div className="flex h-screen items-center justify-center">404 - Page Not Found</div>,
  },
];