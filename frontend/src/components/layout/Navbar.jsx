import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ModeToggle } from "@/components/mode-toggle";
import {
  User, LogOut, LayoutDashboard, Settings,
  Menu, Shield, Zap, BookOpen, CreditCard, ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add shadow/border on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features", icon: Zap },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Documentation", href: "/docs", icon: BookOpen },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
      ? "border-b bg-background/80 backdrop-blur-md py-2"
      : "bg-transparent py-4"
      }`}>
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1">
          <img
            src="/assets/logo.png"
            alt="AuthSphere Logo"
            className="w-10 h-10 object-contain 
               /* Light Mode: removes white background */
               mix-blend-multiply 
               /* Dark Mode: inverts black to white and removes blending */
               dark:invert dark:mix-blend-normal 
               transition-all group-hover:scale-110"
          />

          <span className="font-black text-2xl tracking-tighter text-foreground italic">
            AuthSphere<span className="text-blue-600 transition-colors group-hover:text-blue-400">.</span>
          </span>
        </Link>
        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`hover:text-primary transition-colors ${location.pathname === link.href ? "text-primary" : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* AUTH SECTION + TOGGLE */}
        <div className="flex items-center gap-2">

          <ModeToggle />

          {loading ? (
            <div className="h-9 w-9 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 flex items-center gap-2 pl-1 pr-2 rounded-full border border-border bg-card/50 hover:bg-accent transition-all outline-none"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-background shadow-sm">
                      {user.picture ? (
                        <img src={user.picture} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xs">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-foreground">
                      {user.username}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60 mt-2 p-2 rounded-2xl shadow-xl border-border">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2" />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg cursor-pointer py-2.5">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer py-2.5">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/settings/sessions")} className="rounded-lg cursor-pointer py-2.5">
                    <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Security</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="mx-2" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-bold text-muted-foreground transition-colors hover:text-foreground">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-5 shadow-md shadow-blue-100 dark:shadow-blue-900/20 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE MENU (SHEET) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <Menu className="h-5 w-5 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/assets/logo.png" alt="AuthSphere Logo" className="w-8 h-8 object-contain border border-border rounded-lg p-1" />
                    AuthSphere
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-3 p-3 text-lg font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-blue-600" />
                      {link.name}
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                  {!user && (
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start py-6 rounded-xl border-slate-200">
                        Log In
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div >
    </header >
  );
};

export default Navbar;