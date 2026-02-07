import { useState } from "react";
import { addWebhook, deleteWebhook } from "@/api/ProjectAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Webhook,
  Plus,
  Trash2,
  Key,
  Globe,
  CheckCircle2,
  ChevronDown,
  Check,
  HelpCircle,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AVAILABLE_EVENTS = [
  { id: "user.registered", label: "User Registered" },
  { id: "user.login", label: "User Login" },
  { id: "user.deleted", label: "User Deleted" },
  { id: "api_key.rotated", label: "API Key Rotated" },
];

const ProjectWebhooksCard = ({ project, onUpdated }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(["user.registered"]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Please enter a webhook URL");
    if (selectedEvents.length === 0)
      return toast.error("Select at least one event");

    try {
      setLoading(true);
      await addWebhook(project._id, { url, events: selectedEvents });
      toast.success("Webhook added successfully");
      setUrl("");
      setSelectedEvents(["user.registered"]);
      setIsAdding(false);
      onUpdated();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (webhookId) => {
    if (!window.confirm("Are you sure you want to delete this webhook?"))
      return;

    try {
      await deleteWebhook(project._id, webhookId);
      toast.success("Webhook deleted");
      onUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleEvent = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  return (
    <Card className="overflow-hidden border-primary/10 shadow-lg">
      <CardHeader className="bg-muted/30 pb-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Webhook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Webhooks</CardTitle>
              <CardDescription>
                Receive real-time notifications on your server when events
                happen.
              </CardDescription>
            </div>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Webhook
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="mb-8 p-6 rounded-xl border bg-muted/20 animate-in slide-in-from-top duration-300"
          >
            <CardTitle className="text-lg mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Configure New Webhook
            </CardTitle>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">Payload URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://your-api.com/webhooks/auth"
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  We'll send POST requests to this URL with an HMAC signature in
                  the X-AuthSphere-Signature header.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Select Events</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedEvents.includes(event.id)
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                          selectedEvents.includes(event.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedEvents.includes(event.id) && (
                          <Check className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{event.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Register Webhook
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {project.webhooks?.length > 0 ? (
            project.webhooks.map((webhook) => (
              <div
                key={webhook._id}
                className="group p-5 rounded-xl border bg-card hover:bg-muted/10 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-semibold truncate text-primary">
                        {webhook.url}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {webhook.events.map((ev) => (
                        <Badge
                          key={ev}
                          variant="outline"
                          className="text-[10px] font-normal px-2 py-0 border-primary/20 bg-primary/5"
                        >
                          {ev}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        Signing Secret
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted p-1 px-2 rounded">
                        <Key className="h-3 w-3" />
                        {webhook.secret.substring(0, 8)}...
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(webhook._id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Webhook className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No webhooks configured</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Add a webhook URL to receive real-time updates on your server.
              </p>
            </div>
          )}
        </div>

        {/* Informational Section */}
        <div className="mt-12 pt-8 border-t border-dashed">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Understanding Webhooks</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium mb-1 text-sm">What they are</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Webhooks are "reverse APIs". Instead of you calling us, we push
                data to your server as soon as an event occurs, enabling
                instantaneous reactions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="font-medium mb-1 text-sm">The Advantages</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Eliminate polling overhead, reduce latency, and build seamless
                automation. Sync user data, trigger welcome emails, or update
                external logs in real-time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-medium mb-1 text-sm">Security First</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every request includes an HMAC signature. Use your unique
                Signing Secret to verify that payloads are authentic and haven't
                been tampered with.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/10">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Implementation Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                "Expose a public HTTP POST endpoint",
                "Parse the JSON payload from the request body",
                "Verify the 'X-AuthSphere-Signature' header",
                "Return a 2xx status code quickly to acknowledge",
                "Handle idempotency to prevent duplicate processing",
                "Select only the events your system needs",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                    {i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">
              Verification Example (Node.js)
            </h4>
            <div className="relative group">
              <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 text-[10px] overflow-x-auto font-mono leading-relaxed border border-white/10">
                {`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return signature === digest;
}`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectWebhooksCard;
