import React, { useState, useEffect } from "react";
import {
    getSessions,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions
} from "../api/SessionAPI";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    Clock,
    MapPin,
    LogOut,
    Trash2,
    AlertTriangle,
    ChevronLeft,
    Key,
    Activity,
    Loader2
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

const DeviceIcon = ({ device }) => {
    const d = device?.toLowerCase() || "";
    if (d.includes("mobile") || d.includes("phone")) return <Smartphone className="h-5 w-5" />;
    if (d.includes("tablet")) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
};

const SessionCard = ({ session, onRevoke }) => (
    <Card className={`relative group transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden ${session.current ? 'border-indigo-500 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20' : 'hover:border-border hover:bg-muted/30 shadow-sm'}`}>
        {session.current && (
            <Badge className="absolute top-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white font-black text-[9px] rounded-full px-3 py-1 uppercase tracking-tighter shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer">
                ACTIVE IDENTITY
            </Badge>
        )}
        <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className={`h-16 w-16 md:h-20 md:w-20 rounded-[2rem] flex items-center justify-center transition-all ${session.current ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rotate-3' : 'bg-muted text-muted-foreground'}`}>
                    <DeviceIcon device={session.deviceInfo?.device} />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h4 className="font-black text-foreground text-xl tracking-tight">
                            {session.deviceInfo?.os} • {session.deviceInfo?.browser}
                        </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" /> {session.location?.city || 'Unknown Node'}, {session.location?.country || 'Unknown'}</span>
                        <span className="flex items-center gap-2 font-mono text-xs opacity-70"><Globe className="h-4 w-4 text-blue-500" /> {session.ipAddress}</span>
                    </div>
                    <div className="pt-4 flex flex-wrap items-center gap-6">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Provisioned</p>
                            <span className="flex items-center gap-2 text-xs font-bold text-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Last Heartbeat</p>
                            <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                <Activity className="h-3.5 w-3.5" />
                                {formatDistanceToNow(new Date(session.lastActive))} ago
                            </span>
                        </div>
                    </div>
                </div>
                {!session.current && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all h-12 w-12 self-center border border-transparent hover:border-rose-500/20">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-border bg-card shadow-2xl">
                            <AlertDialogHeader className="items-center text-center">
                                <div className="h-16 w-16 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center mb-4">
                                    <AlertTriangle className="h-8 w-8 text-rose-500" />
                                </div>
                                <AlertDialogTitle className="text-2xl font-black italic">Revoke Access?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium pt-2 leading-relaxed">
                                    This will immediately terminate the identity session on this device. The developer will be required to re-authenticate using their private keys.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
                                <AlertDialogCancel className="rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-border shadow-sm">Abort</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onRevoke(session._id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-none shadow-xl shadow-rose-500/20 transition-all active:scale-95"
                                >
                                    Confirm Termination
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </CardContent>
    </Card>
);

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await getSessions();
            if (res.success) setSessions(res.data);
        } catch (error) {
            toast.error("Failed to load active sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        try {
            const res = await revokeSession(id);
            if (res.success) {
                toast.success("Session revoked successfully");
                fetchSessions();
            }
        } catch (error) {
            toast.error("Failed to revoke session");
        }
    };

    const handleRevokeOthers = async () => {
        try {
            const res = await revokeAllOtherSessions();
            if (res.success) {
                toast.success("All secondary nodes decommissioned");
                fetchSessions();
            }
        } catch (error) {
            toast.error("Failed to logout other devices");
        }
    };

    const handleRevokeAll = async () => {
        try {
            const res = await revokeAllSessions();
            if (res.success) {
                toast.success("Global logout successful");
                // Redirect to login
                navigate("/login");
            }
        } catch (error) {
            toast.error("Failed to logout all devices");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 animate-in fade-in duration-1000">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-500/10" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Synchronizing global session graph...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background/50 dark:bg-slate-900/50">
            <div className="container mx-auto py-16 px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                    <div className="space-y-4">
                        <Link
                            to="/dashboard"
                            className="group flex items-center text-[10px] text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all font-black uppercase tracking-[0.2em]"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter text-foreground flex items-center gap-4 italic">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Shield size={28} className="text-white" fill="currentColor" />
                            </div>
                            Privacy Shield.
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium max-w-xl">Audit your active developer credentials and manage secure identities across your fleet.</p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 md:pt-0">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px] border-border bg-background hover:bg-muted transition-all active:scale-95 shadow-sm">
                                    Purge Secondaries
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-border bg-card shadow-2xl">
                                <AlertDialogHeader className="items-center text-center">
                                    <div className="h-16 w-16 bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center mb-4">
                                        <AlertTriangle className="text-amber-500 h-8 w-8" />
                                    </div>
                                    <AlertDialogTitle className="text-2xl font-black italic">Revoke Remote Nodes?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground font-medium pt-2 leading-relaxed">
                                        This will immediately end all sessions except for your current interface. You will be required to re-authenticate on all other devices.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
                                    <AlertDialogCancel className="rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-border">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRevokeOthers} className="bg-foreground text-background hover:bg-muted-foreground rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-none transition-all active:scale-95">
                                        Decommission Now
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-10 py-6 h-auto font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 border-none transition-all active:scale-95">
                                    <LogOut className="h-4 w-4 mr-3" />
                                    Total Purge
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-border bg-card shadow-2xl">
                                <AlertDialogHeader className="items-center text-center">
                                    <div className="h-16 w-16 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center mb-4">
                                        <LogOut className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <AlertDialogTitle className="text-2xl font-black italic text-rose-600">Global Termination</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground font-medium pt-2 leading-relaxed px-4">
                                        Warning: This terminates ALL active sessions globally, including this one. You will be disconnected and redirected to the gateway.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
                                    <AlertDialogCancel className="rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-border">Go Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRevokeAll} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black uppercase tracking-widest text-[10px] px-8 h-12 border-none shadow-xl shadow-rose-500/20 transition-all active:scale-95">
                                        Confirm Global Logout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-8">
                    <div className="flex items-center gap-6 px-4 mb-2 animate-in slide-in-from-left-4 duration-1000">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] whitespace-nowrap">Authenticated Grid Nodes ({sessions.length})</p>
                        <div className="h-[1px] flex-1 bg-border opacity-50" />
                    </div>

                    <div className="space-y-6">
                        {sessions.map((session, idx) => (
                            <div key={session._id} className="animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                                <SessionCard
                                    session={session}
                                    onRevoke={handleRevoke}
                                />
                            </div>
                        ))}
                    </div>

                    <Card className="bg-muted/30 border-dashed border-2 border-border shadow-none mt-16 overflow-hidden rounded-[2.5rem] p-10 py-12">
                        <CardHeader className="text-center pb-4 pt-0">
                            <div className="h-16 w-16 rounded-[1.3rem] bg-background border border-border flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 rotate-6 hover:rotate-12 transition-transform duration-500">
                                <Key className="h-8 w-8 text-amber-500" />
                            </div>
                            <CardTitle className="text-2xl font-black text-foreground italic">Security Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-0">
                            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
                                We recommend ending sessions you don't recognize. AuthSphere automatically expires sessions after <span className="text-foreground font-black">7 days</span> of inactivity for your protection.
                                <br /><br />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Encryption Standard: AES-256-GCM / SHA-512</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <footer className="mt-24 text-center">
                    <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.4em]">
                        SECURED INTERFACE • SESSION LAYER VERIFIED
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default SessionManagement;
