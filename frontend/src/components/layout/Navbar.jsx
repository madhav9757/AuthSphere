import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  User, LogOut, LayoutDashboard, Settings,
  Menu, Shield, ChevronDown, Github, Activity
} from "lucide-react";

const Navbar = () => {
  const { user, loading, logout, loggingOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "Templates", href: "/templates" },
    { name: "Documentation", href: "/docs" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all ${isScrolled
      ? "border-b bg-background/95 backdrop-blur"
      : "bg-transparent"
      }`}>
      <div className="w-[90vw] mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg border flex items-center justify-center">
            <img
              src="/assets/logo.png"
              alt="AuthSphere"
              className="h-6 w-6 object-contain dark:invert"
            />
          </div>
          <span className="font-bold text-xl">AuthSphere</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`hover:text-primary transition-colors ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">

          <Button variant="ghost" size="icon" asChild className="rounded-full w-9 h-9">
            <a
              href="https://github.com/madhav9757/AuthSphere"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">GitHub repository</span>
            </a>
          </Button>
          <AnimatedThemeToggler />

          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 flex items-center gap-2 rounded-full"
                >
                  <div className="h-7 w-7 rounded-full border flex items-center justify-center bg-muted">
                    {user.picture ? (
                      <img src={user.picture} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/settings/sessions")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/audit-logs")}>
                  <Activity className="mr-2 h-4 w-4" />
                  Audit Logs
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  disabled={loggingOut}
                  className="text-destructive focus:text-destructive"
                >
                  {loggingOut ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <DropdownMenuSeparator />
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Log In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
