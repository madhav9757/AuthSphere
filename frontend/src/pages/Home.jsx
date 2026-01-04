import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  LayoutDashboard,
} from "lucide-react";

/* -------------------- FEATURES DATA -------------------- */
const features = [
  {
    title: "Fast Workflows",
    description:
      "Optimized project handling with minimal friction and maximum speed.",
    icon: Zap,
  },
  {
    title: "Secure by Default",
    description:
      "Authentication, authorization, and data protection built-in.",
    icon: ShieldCheck,
  },
  {
    title: "Global Access",
    description:
      "Access your workspace from anywhere, anytime.",
    icon: Globe,
  },
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* ================= HERO ================= */}
        <section className="w-full py-24 lg:py-32">
          <div className="container mx-auto px-6 text-center max-w-4xl space-y-6">

            <Badge variant="secondary" className="mx-auto gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Enterprise Ready
            </Badge>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Build Faster with{" "}
              <span className="text-primary">Precision</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {user
                ? `Welcome back, ${user.username}. Your workspace is ready.`
                : "A modern platform for developers to manage projects with speed, security, and clarity."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {!user && (
                <Button size="lg" variant="outline">
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* ================= FEATURES ================= */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need
              </h2>
              <p className="text-muted-foreground">
                Built to scale from side projects to production systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        {!user && (
          <section className="py-24 bg-muted/40">
            <div className="container mx-auto px-6 max-w-3xl text-center space-y-6">
              <LayoutDashboard className="h-10 w-10 mx-auto text-primary" />
              <h2 className="text-3xl font-bold">
                Start building today
              </h2>
              <p className="text-muted-foreground">
                Create your account and launch your first project in minutes.
              </p>
              <Button size="lg" asChild>
                <Link to="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
