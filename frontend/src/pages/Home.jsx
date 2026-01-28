import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Icons
import {
  ArrowRight, ShieldCheck, Zap, Code2, Lock, Users, CheckCircle2,
  Github, Globe, Fingerprint, ChevronRight, Terminal, Activity, Star
} from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto">
            {/* Trust Badge */}
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 font-medium">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              Trusted by 2,000+ developers
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight">
              Identity.{" "}
              <span className="text-primary">
                Evolved.
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground mb-8">
              The next generation of authentication. Secure your infrastructure with
              decentralized identity and sub-50ms global latency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {user ? (
                <Button asChild size="lg" className="gap-2 px-8">
                  <Link to="/dashboard">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="gap-2 px-8">
                    <Link to="/register">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 px-8">
                    <Link to="/docs">
                      <Terminal className="h-4 w-4" />
                      Documentation
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Quick Start Code */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="bg-muted/50 border rounded-lg p-4">
                <code className="text-sm font-mono text-foreground/80">
                  npm install @authspherejs/sdk
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 lg:py-24 bg-muted/10 backdrop-blur-[2px]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Why AuthSphere</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for developers who need reliable, scalable authentication
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Sub-50ms response times with global edge network"
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Security",
                desc: "OAuth 2.0, PKCE, and AES-256 encryption out of the box"
              },
              {
                icon: Code2,
                title: "Developer First",
                desc: "Clean APIs, comprehensive docs, and instant deployment"
              },
              {
                icon: Users,
                title: "Social Providers",
                desc: "Google, GitHub, Discord integration in minutes"
              },
              {
                icon: Lock,
                title: "Session Management",
                desc: "Automatic token refresh and secure session handling"
              },
              {
                icon: Globe,
                title: "Global Infrastructure",
                desc: "Distributed edge nodes for worldwide low latency"
              }
            ].map((feature, i) => (
              <Card key={i} className="border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">
              Get up and running in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Project",
                desc: "Set up your authentication project in seconds"
              },
              {
                step: "2",
                title: "Install SDK",
                desc: "Add our lightweight SDK to your application"
              },
              {
                step: "3",
                title: "Go Live",
                desc: "Deploy and start authenticating users worldwide"
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 lg:py-24 bg-muted/10 backdrop-blur-[2px]">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "What is AuthSphere?",
                a: "AuthSphere is a modern authentication service that provides OAuth 2.0, social login, and session management for web and mobile applications."
              },
              {
                q: "Is there a free tier?",
                a: "Yes! We offer a generous free tier for hobby projects and startups. Check our pricing page for details."
              },
              {
                q: "Which providers do you support?",
                a: "We currently support Google, GitHub, and Discord. More providers are being added regularly."
              },
              {
                q: "Is it production-ready?",
                a: "Absolutely. AuthSphere is built on enterprise-grade infrastructure with 99.9% uptime SLA."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of developers using AuthSphere
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {user ? (
                  <Button asChild size="lg" variant="secondary" className="gap-2 px-8">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" variant="secondary" className="gap-2 px-8">
                      <Link to="/register">
                        Create Free Account
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2 px-8 border-primary-foreground/20 hover:bg-primary-foreground/10">
                      <Link to="/docs">
                        View Documentation
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default Home;
