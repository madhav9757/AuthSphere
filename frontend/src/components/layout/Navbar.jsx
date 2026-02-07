import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
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
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  Shield,
  ChevronDown,
  Github,
  Activity,
  Bell,
} from "lucide-react";

const Navbar = () => {
  const { user, loading, logout, loggingOut } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Optional: Polling every 1 minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const navLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "Templates", href: "/templates" },
    { name: "Documentation", href: "/docs" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-md"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto w-[92%] max-w-7xl h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl border bg-background flex items-center justify-center group-hover:shadow-sm transition">
            <img
              src="/assets/logo.png"
              alt="AuthSphere"
              className="h-6 w-6 object-contain dark:invert"
            />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            AuthSphere
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute inset-x-2 -bottom-1 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* GitHub */}
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <a
              href="https://github.com/madhav9757/AuthSphere"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          {/* Notifications */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-normal text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <DropdownMenuItem
                          key={n._id}
                          className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                            !n.read ? "bg-muted/40" : ""
                          }`}
                          onClick={() => {
                            if (!n.read) markAsRead(n._id);
                          }}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {!n.read && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            )}
                            <p
                              className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}
                            >
                              {n.title}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No notifications yet
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-primary text-xs cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  View all activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <AnimatedThemeToggler />

          {/* Auth */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-full px-2">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">
                        {user.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm">
                    {user.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
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

                <DropdownMenuItem
                  onClick={() => navigate("/settings/sessions")}
                >
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
                  className="text-destructive"
                >
                  {loggingOut ? "Logging out…" : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm p-0 bg-background border-l h-fit"
              >
                <div className="px-6 py-5 border-b">
                  <SheetTitle className="text-lg font-semibold">
                    Menu
                  </SheetTitle>
                </div>

                <div className="flex flex-col h-full">
                  <div className="px-6 py-6 flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const active = location.pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          className={`rounded-lg px-4 py-3 text-base font-medium transition
                  ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
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
