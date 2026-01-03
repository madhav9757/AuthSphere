import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "@/components/layout/Navbar"; 
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar /> {/* Reusable Navbar here */}

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
              Build Faster with <span className="text-blue-600">Precision</span>
            </h1>

            <p className="mx-auto max-w-[600px] mt-6 text-gray-600 text-lg md:text-xl leading-relaxed">
              {user
                ? `Welcome back, ${user.username}. Your workspace is updated and ready.`
                : "The ultimate platform for developers to manage workflows with enterprise-grade speed and security."}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8 h-12 text-md" asChild>
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "View Dashboard" : "Get Started Now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 h-12 text-md">
                Live Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Rest of your Feature sections... */}
      </main>
    </div>
  );
};

export default Home;