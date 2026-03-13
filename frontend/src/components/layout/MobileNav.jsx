import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Activity,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      label: "Audit",
      icon: Activity,
      href: "/audit-logs",
      active: location.pathname === "/audit-logs",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: location.pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
              item.active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                item.active && "animate-in zoom-in-75 duration-300",
              )}
            />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
            {item.active && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
