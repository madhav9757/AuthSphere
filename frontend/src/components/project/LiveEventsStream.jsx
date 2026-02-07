import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Terminal,
  Zap,
  Shield,
  Key,
  RefreshCcw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const LiveEventsStream = ({ projectId }) => {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const socket = io(backendUrl, {
      query: { projectId },
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      addEvent({
        type: "SYSTEM",
        message: "Real-time telemetry link established.",
        icon: Wifi,
        color: "text-emerald-500",
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      addEvent({
        type: "SYSTEM",
        message: "Telemetry link severed. Reconnecting...",
        icon: WifiOff,
        color: "text-rose-500",
      });
    });

    // Listen for Auth Request
    socket.on("AUTH_REQUEST", (data) => {
      addEvent({
        type: "AUTHORIZE",
        message: `Incoming ${data.provider} handshake initiated.`,
        details: `Request ID: ${data.requestId.slice(0, 8)}... | IP: ${data.ip}`,
        icon: Zap,
        color: "text-amber-500",
        timestamp: data.timestamp,
      });
    });

    // Listen for Auth Code Issued
    socket.on("AUTH_CODE_ISSUED", (data) => {
      addEvent({
        type: "IDENTITY",
        message: `Identity verified for user: ${data.email}`,
        details: `Protocol: ${data.provider} | Authorization code issued.`,
        icon: Shield,
        color: "text-blue-500",
        timestamp: data.timestamp,
      });
    });

    // Listen for Token Exchanged
    socket.on("TOKEN_EXCHANGED", (data) => {
      addEvent({
        type: "TOKEN",
        message: `Secure token exchange completed for ${data.email}`,
        details: `IP: ${data.ip} | Session established successfully.`,
        icon: Key,
        color: "text-emerald-500",
        timestamp: data.timestamp,
      });
    });

    // Listen for Token Refreshed
    socket.on("TOKEN_REFRESHED", (data) => {
      addEvent({
        type: "REFRESH",
        message: `Access rotation performed for ${data.email}`,
        details: `New JWT issued | Session lease extended.`,
        icon: RefreshCcw,
        color: "text-purple-500",
        timestamp: data.timestamp,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  const addEvent = (event) => {
    setEvents((prev) => [
      ...prev.slice(-49),
      { ...event, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventStyle = (type) => {
    switch (type) {
      case "SYSTEM":
        return "border-blue-500/20 bg-blue-500/5";
      case "AUTHORIZE":
        return "border-amber-500/20 bg-amber-500/5";
      case "IDENTITY":
        return "border-blue-500/20 bg-blue-500/5";
      case "TOKEN":
        return "border-emerald-500/20 bg-emerald-500/5";
      case "REFRESH":
        return "border-purple-500/20 bg-purple-500/5";
      default:
        return "border-primary/10 bg-muted/20";
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-2xl overflow-hidden bg-[#0A0A0B] shadow-2xl relative group">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#121214] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Live Telemetry Stream
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <Badge
              variant="outline"
              className="h-5 border-emerald-500/20 text-emerald-500 bg-emerald-500/10 text-[9px] font-black uppercase tracking-tighter gap-1.5"
            >
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              Live Link Ready
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-5 border-rose-500/20 text-rose-500 bg-rose-500/10 text-[9px] font-black uppercase tracking-tighter gap-1.5"
            >
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
              <Zap className="h-12 w-12 mb-4 animate-pulse" />
              <p className="text-xs font-mono tracking-widest uppercase">
                Awaiting incoming signals...
              </p>
            </div>
          ) : (
            events.map((event) => {
              const Icon = event.icon || Terminal;
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${getEventStyle(event.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 p-1.5 rounded-lg bg-background border border-white/5 ${event.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${event.color}`}
                        >
                          {event.type}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/50">
                          {event.timestamp
                            ? format(new Date(event.timestamp), "HH:mm:ss.SSS")
                            : format(new Date(), "HH:mm:ss.SSS")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white/90 leading-snug">
                        {event.message}
                      </p>
                      {event.details && (
                        <p className="text-[11px] font-mono text-muted-foreground mt-1.5 py-1 px-2 rounded bg-black/40 border border-white/5 truncate">
                          $ {event.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-[#121214] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground/40">
          <span>Buffer: {events.length}/50</span>
          <span>Encryption: AES-256-GCM</span>
        </div>
        <div className="text-[9px] font-mono text-primary/40 animate-pulse">
          _System_Operational_
        </div>
      </div>
    </div>
  );
};

export default LiveEventsStream;
