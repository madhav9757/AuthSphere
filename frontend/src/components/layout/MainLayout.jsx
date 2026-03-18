import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { WifiOff } from "lucide-react";

const MainLayout = ({ children, showNavAndFooter = true }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-0 overflow-hidden bg-background font-sans">
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-100 bg-destructive text-destructive-foreground py-1 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <WifiOff className="h-3 w-3" />
          Offline Mode - Using Cached Data
        </div>
      )}
      {/* Background Flickering Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40 mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#6366f1"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {showNavAndFooter && <Navbar />}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        {showNavAndFooter && (
          <>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
