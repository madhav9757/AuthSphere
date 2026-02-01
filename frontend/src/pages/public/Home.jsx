import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Icons
import {
  Shield, Zap, Code2, Lock, Users, Terminal, Activity,
  Database, Server, Cpu, Layers, BarChart3, Globe, Key,
  CheckCircle2, AlertCircle, FileCode, Network, LayoutDashboard,
  Settings, Plus, ChevronRight, History
} from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* SECTION 1: TECHNICAL OVERVIEW */}
      <section className="pt-20 pb-12 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4 rounded-md font-mono text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
              System Specification v2.4.0
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {user ? `Welcome back, ${user.username.split(' ')[0]}` : "AuthSphere Identity Infrastructure"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {user
                ? "You have active projects ready for management. Review your security logs or configure a new authentication provider below."
                : "A high-performance authentication engine building on top of OAuth 2.0 and OpenID Connect standards. Designed for stateless session management and secure identity propagation across distributed systems."}
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/register">
                      <Plus className="h-4 w-4" />
                      Create Project
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/docs">
                      <FileCode className="h-4 w-4" />
                      API Reference
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC SECTION: QUICK ACTIONS (ONLY FOR LOGGED IN) */}
      {user && (
        <section className="py-12 border-b bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
                <p className="text-sm text-muted-foreground">Jump back into your workflow</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <Link to="/audit-logs" className="group p-4 bg-background border rounded-lg hover:border-primary transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <History className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-foreground">Review Logs</span>
                </div>
                <p className="text-xs text-muted-foreground">Check recent authentication events across your projects.</p>
              </Link>
              <Link to="/settings/sessions" className="group p-4 bg-background border rounded-lg hover:border-primary transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-foreground">Security Audit</span>
                </div>
                <p className="text-xs text-muted-foreground">Manage your personal account security and active sessions.</p>
              </Link>
              <Link to="/docs" className="group p-4 bg-background border rounded-lg hover:border-primary transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-foreground">API Explorer</span>
                </div>
                <p className="text-xs text-muted-foreground">Test endpoints and browse technical implementation guides.</p>
              </Link>
              <div className="p-4 bg-primary text-primary-foreground rounded-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm">Need Help?</h4>
                  <p className="text-xs opacity-80 mt-1 text-primary-foreground">Our technical support is available 24/7 for standard tiers.</p>
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-4 text-xs font-bold" asChild>
                  <Link to="/docs">Contact Ops</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: CORE TECHNICAL CAPABILITIES */}
      <section className="py-20 border-b bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Core Engine Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  OAuth 2.0 & OIDC
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Full implementation of Authorization Code Grant with PKCE protection. Supports OpenID Connect (OIDC) for standard identity token structure.</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">PKCE</Badge>
                  <Badge variant="secondary" className="text-[10px]">JWT</Badge>
                  <Badge variant="secondary" className="text-[10px]">JWS/JWE</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  Stateless Session
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Distributed session handling using cryptographically signed refresh tokens. Eliminates the need for centralized database lookups on every request.</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">7-Day Persistence</Badge>
                  <Badge variant="secondary" className="text-[10px]">Auto-Refresh</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Security Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Multi-factor Authentication (MFA) via TOTP, Rate limiting, and brute-force protection integrated at the protocol level.</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">TOTP</Badge>
                  <Badge variant="secondary" className="text-[10px]">Rate Limiting</Badge>
                  <Badge variant="secondary" className="text-[10px]">IP Tracking</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROTOCOL & ENCRYPTION SPECS */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold mb-6">Security & Cryptography</h2>
              <div className="space-y-6 text-sm">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">AES-256-GCM Encryption</h4>
                    <p className="text-muted-foreground">All sensitive project data and client secrets are encrypted at rest using AES-256-GCM with unique initialization vectors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                    <Database className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">SHA-512 Hashing</h4>
                    <p className="text-muted-foreground">Password verification uses salted SHA-512 iterations with high entropy, ensuring resistance to dictionary and rainbow table attacks.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Full Audit Logging</h4>
                    <p className="text-muted-foreground">Comprehensive tracking of every authentication event, metadata change, and API request for compliance and debugging.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl border p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Integration Schema
              </h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-2">
                  <p className="text-primary font-bold">// Initialize AuthSphere</p>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-muted-foreground">POST /v1/auth/login</p>
                    <p className="mt-2">&#123;</p>
                    <p className="ml-4">"apiKey": "pk_live_28h9x...",</p>
                    <p className="ml-4">"email": "user@example.com",</p>
                    <p className="ml-4">"password": "••••••••"</p>
                    <p>&#125;</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-primary font-bold">// Success Response</p>
                  <div className="p-4 bg-background rounded-lg border">
                    <p>&#123;</p>
                    <p className="ml-4">"status": 200,</p>
                    <p className="ml-4">"accessToken": "eyJhbG...",</p>
                    <p className="ml-4">"expiresIn": 3600</p>
                    <p>&#125;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DEPLOYMENT & SCALABILITY */}
      <section className="py-20 border-b bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold mb-4">Infrastructure Architecture</h2>
            <p className="text-muted-foreground">AuthSphere is designed as a global stateless service, allowing for horizontal scalability without session persistence bottlenecks.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-background border rounded-lg">
              <Globe className="h-5 w-5 mb-4 text-primary" />
              <h4 className="font-bold mb-2">Global Edge</h4>
              <p className="text-xs text-muted-foreground">Low-latency token verification via distributed nodes.</p>
            </div>
            <div className="p-6 bg-background border rounded-lg">
              <Network className="h-5 w-5 mb-4 text-primary" />
              <h4 className="font-bold mb-2">Internal Cache</h4>
              <p className="text-xs text-muted-foreground">Redis-backed transient data storage for speed.</p>
            </div>
            <div className="p-6 bg-background border rounded-lg">
              <FileCode className="h-5 w-5 mb-4 text-primary" />
              <h4 className="font-bold mb-2">OpenAPI v3</h4>
              <p className="text-xs text-muted-foreground">Fully typed API definitions for automated client generation.</p>
            </div>
            <div className="p-6 bg-background border rounded-lg">
              <BarChart3 className="h-5 w-5 mb-4 text-primary" />
              <h4 className="font-bold mb-2">Real-time Metrics</h4>
              <p className="text-xs text-muted-foreground">Prometheus-compatible ingestion for service monitoring.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ & PROTOCOL DETAILS */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-10 text-center">Frequently Asked Technical Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1" className="border rounded-lg px-6">
              <AccordionTrigger className="font-bold">How are tokens verified?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                AuthSphere uses RS256 (RSA Signature with SHA-256) for signing Access Tokens.
                Your application can verify these tokens locally using your project's Public Key,
                eliminating the need for an API call to AuthSphere on every request.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="border rounded-lg px-6">
              <AccordionTrigger className="font-bold">What protocols are supported for Social Login?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We currently support OAuth 2.0 and OpenID Connect for GitHub, Google, and Discord.
                The system standardizes all provider responses into a unified user object for your backend.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="border rounded-lg px-6">
              <AccordionTrigger className="font-bold">Is there a rate limit on the API?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, to ensure system stability, we apply adaptive rate limiting based on your project tier.
                The default limit for the Hobbyist tier is 100 requests per minute per IP.
                Enterprise users have custom throughput limits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Home;
