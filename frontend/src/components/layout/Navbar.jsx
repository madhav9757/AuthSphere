import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User, LogOut, LayoutDashboard, Settings, Menu } from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight">Precision</span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-600">
          <Link title="Features" to="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link title="Pricing" to="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          <Link title="Docs" to="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link>
        </nav>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-4">

          {/* LOADING SKELETON */}
          {loading ? (
            <div className="h-9 w-9 animate-pulse bg-gray-200 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3">

              {/* Username */}
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user.username}
              </span>

              {/* AVATAR DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border shadow-sm p-0"
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200 rounded-full">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // If NOT logged in
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
