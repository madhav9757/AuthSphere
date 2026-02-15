import React, { useState } from "react";
import useAuthStore from "@/store/authStore";

// Home Components
import Hero from "@/components/home/Hero";
import Architecture from "@/components/home/Architecture";
import FunctionalSpecs from "@/components/home/FunctionalSpecs";
import Integration from "@/components/home/Integration";
import DataModel from "@/components/home/DataModel";
import ErrorCodes from "@/components/home/ErrorCodes";

// Icons
import { Fingerprint, Terminal, Shield, Globe } from "lucide-react";

// -----------------------------------------------------------------------------
// STATIC CONTENT & CONFIGURATION
// -----------------------------------------------------------------------------

const SYSTEM_MODULES = [
  {
    title: "Auth Core (OIDC)",
    icon: <Fingerprint className="h-6 w-6 text-primary" />,
    description:
      "A high-throughput implementation of OAuth 2.0 and OpenID Connect 1.0. The engine manages the full identity lifecycle—from JIT provisioning via PKCE to cryptographically signed RS256 token rotation and session persistence across distributed clusters.",
    details: [
      "OAuth2.1 / OIDC compliance: full spec support",
      "Stateless RS256 JWTs: with dynamic key rotation",
      "PKCE + Authorization Code: secure mobile/web flows",
      "MFA (TOTP/WebAuthn): multi-layer verification",
      "Brute-force mitigation: adaptive rate limiting",
      "Stateless revocation: using Bloom filters",
    ],
  },
  {
    title: "DX & Event Mesh",
    icon: <Terminal className="h-6 w-6 text-primary" />,
    description:
      "A developer-first control plane. Exposes a gRPC-enabled Management API and an event-driven webhook mesh. Automates project orchestration, granular permission scoping, and real-time identity stream synchronization across your entire service ecosystem.",
    details: [
      "RESTful / gRPC Management: full API exposure",
      "Scoped API Keys: precise permission guarding",
      "HMAC-SHA256 Webhooks: real-time event sync",
      "CLI / SDK Surface: Node, Python, Go, and React",
      "OpenAPI v3.0 specs: auto-generated documentation",
      "Project Isolation: logical multi-tenant separation",
    ],
  },
  {
    title: "Security & Auditing",
    icon: <Shield className="h-6 w-6 text-primary" />,
    description:
      "Deep security integration providing immutable audit trails and real-time anomaly detection. Every request is scrubbed against a zero-trust policy engine, ensuring strictly isolated data environments and compliance with SOC2/GDPR identity standards.",
    details: [
      "Immutable Audit Records: per-request logging",
      "AES-256-GCM Encryption: for sensitive PII data",
      "Strict Security Headers: HSTS, CSP, and XFO",
      "IP Geofencing: regional access control policies",
      "Vulnerability Scanning: automated threat detection",
      "Anomaly Detection: ML-driven login patterns",
    ],
  },
  {
    title: "Edge Distribution",
    icon: <Globe className="h-6 w-6 text-primary" />,
    description:
      "Engineered for sub-10ms response times at any scale. The global infrastructure utilizes a tiered caching strategy—segregating high-frequency read operations from transactional write consistency to ensure zero-downtime identity resolution.",
    details: [
      "L1/L2 Cache Layer: multi-tier Redis clusters",
      "Sharded Database Mesh: high-availability MongoDB",
      "K8s Ready: automatic horizontal pod scaling",
      "Health Probes: real-time liveness & readiness",
      "Global Load Balancing: intelligent traffic routing",
      "Anycast DNS: low-latency identity discovery",
    ],
  },
];

const API_EXAMPLES = {
  node: `// Initialize the AuthSphere Client
const { AuthSphere } = require('@authsphere/node-sdk');

const auth = new AuthSphere({
  projectId: process.env.AUTH_PROJECT_ID,
  secretKey: process.env.AUTH_SECRET_KEY,
});

// Middleware to protect routes
app.get('/api/protected', auth.middleware(), (req, res) => {
  // Access validated user session
  const user = req.session.user;
  res.json({ message: \`Hello \${user.email}\` });
});

// Manually verify a token
try {
  const payload = await auth.verifyToken(token);
  console.log('Valid token:', payload);
} catch (error) {
  console.error('Invalid token:', error.message);
}`,

  python: `# Install: pip install authsphere
from authsphere import AuthSphereClient

client = AuthSphereClient(
    project_id="proj_123456",
    secret_key="sk_live_abcdef"
)

# Protect a Flask route
@app.route('/api/data')
@client.require_auth
def get_data(user):
    return {"message": f"Welcome {user.email}"}

# Verify token manually
try:
    user = client.verify_token(token_string)
    print(user.id)
except AuthError as e:
    print(f"Authentication failed: {e}")`,

  go: `package main

import (
    "github.com/authsphere/go-sdk"
    "net/http"
)

func main() {
    client := authsphere.NewClient(authsphere.Config{
        ProjectID: "proj_123456",
        SecretKey: "sk_live_abcdef",
    })

    http.Handle("/private", client.Middleware(http.HandlerFunc(handler)))
}

func handler(w http.ResponseWriter, r *http.Request) {
    user := authsphere.GetUser(r.Context())
    w.Write([]byte("Hello " + user.Email))
}`,

  curl: `# Exchange Authorization Code for Token
curl -X POST https://api.authsphere.dev/v1/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "proj_123456",
    "client_secret": "sec_abcdef",
    "code": "auth_code_xyz",
    "redirect_uri": "https://myapp.com/callback"
  }'

# Response
{
  "access_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt_98765..."
}`,
};

const ERROR_CODES = [
  {
    code: "AUTH_001",
    message: "Invalid API Key",
    description:
      "The provided API key is missing, malformed, or has been revoked.",
    solution:
      "Check your dashboard for the correct key and ensure it has the required scopes.",
  },
  {
    code: "AUTH_002",
    message: "Token Expired",
    description:
      "The access token has expired. Use the refresh token to obtain a new one.",
    solution:
      "Implement refresh token rotation and call /oauth/token to get a new access_token.",
  },
  {
    code: "AUTH_003",
    message: "Rate Limit Exceeded",
    description:
      "Too many requests from this IP or Project. Please wait before retrying.",
    solution:
      "Check X-RateLimit headers and implement exponential backoff in your client.",
  },
  {
    code: "AUTH_004",
    message: "Invalid Scope",
    description:
      "The requested scope is invalid or exceeds the permissions of the client.",
    solution:
      "Verify the scope names in your request and ensure the project allows them.",
  },
  {
    code: "AUTH_005",
    message: "MFA Required",
    description:
      "Multi-factor authentication is required to complete this action.",
    solution:
      "Redirect the user to the MFA verification flow before retrying the operation.",
  },
  {
    code: "AUTH_006",
    message: "Unauthorized Origin",
    description:
      "The request origin (CORS) is not whitelisted for this project.",
    solution:
      "Add your domain to the 'Allowed Origins' list in the project settings.",
  },
  {
    code: "AUTH_007",
    message: "Project Suspended",
    description:
      "The project has been deactivated due to billing or policy violations.",
    solution:
      "Contact AuthSphere support or check the billing console for status updates.",
  },
  {
    code: "AUTH_008",
    message: "Signature Mismatch",
    description:
      "The webhook HMAC-SHA256 signature does not match the payload.",
    solution:
      "Ensure you are using the correct Webhook Secret and raw request body.",
  },
];

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/20 relative overflow-x-hidden">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none -z-20" />

      <Hero user={user} />
      <Architecture />
      <FunctionalSpecs modules={SYSTEM_MODULES} />
      <Integration />
      <DataModel />
      <ErrorCodes errorCodes={ERROR_CODES} />
    </div>
  );
};

export default Home;
