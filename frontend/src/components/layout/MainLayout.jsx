import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative z-0 overflow-hidden bg-background">
      {/* Background Flickering Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
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
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
