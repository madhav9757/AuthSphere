import React, { useState, useEffect } from "react";
import {
    getSessions,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions
} from "@/api/SessionAPI";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <Card className={`transition-shadow ${session.current ? 'border-primary' : 'hover:shadow-md'}`}>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${session.current
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    <DeviceIcon device={session.deviceInfo?.device} />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-lg mb-1">
                                {session.deviceInfo?.os} • {session.deviceInfo?.browser}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {session.location?.city || 'Unknown'}, {session.location?.country || 'Unknown'}
                                </span>
                                <span className="flex items-center gap-1.5 font-mono text-xs">
                                    <Globe className="h-3.5 w-3.5" />
                                    {session.ipAddress}
                                </span>
                            </div>
                        </div>
                        {session.current && (
                            <Badge className="shrink-0">Current Session</Badge>
                        )}
                    </div>

                    <Separator />

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Created {new Date(session.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Activity className="h-3.5 w-3.5" />
                            <span>Active {formatDistanceToNow(new Date(session.lastActive))} ago</span>
                        </div>
                    </div>
                </div>

                {!session.current && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive self-start"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="h-6 w-6 text-destructive" />
                                </div>
                                <AlertDialogTitle className="text-center">Revoke Session?</AlertDialogTitle>
                                <AlertDialogDescription className="text-center">
                                    This will immediately end this session. The user will need to sign in again on this device.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onRevoke(session._id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Revoke Session
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
            toast.error("Failed to load sessions");
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
                toast.success("All other sessions revoked");
                fetchSessions();
            }
        } catch (error) {
            toast.error("Failed to revoke sessions");
        }
    };

    const handleRevokeAll = async () => {
        try {
            const res = await revokeAllSessions();
            if (res.success) {
                toast.success("All sessions revoked");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Failed to revoke all sessions");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Loading sessions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto py-8 px-6 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            Session Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage active sessions across all your devices
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    Revoke Others
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <AlertTriangle className="h-6 w-6 text-primary" />
                                    </div>
                                    <AlertDialogTitle className="text-center">Revoke Other Sessions?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-center">
                                        This will end all sessions except your current one. You'll need to sign in again on other devices.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRevokeOthers}>
                                        Revoke Others
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Revoke All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                        <LogOut className="h-6 w-6 text-destructive" />
                                    </div>
                                    <AlertDialogTitle className="text-center text-destructive">
                                        Revoke All Sessions?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center">
                                        Warning: This will end ALL sessions including this one. You'll be signed out and redirected to login.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleRevokeAll}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Revoke All Sessions
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Active Sessions ({sessions.length})
                        </p>
                        <Separator className="flex-1" />
                    </div>

                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session._id}
                                session={session}
                                onRevoke={handleRevoke}
                            />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                Security Education & Best Practices
                            </p>
                            <Separator className="flex-1" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-muted/30 border-none">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <CardTitle className="text-lg">Why Revoke Sessions?</CardTitle>
                                    </div>
                                    <CardDescription className="text-sm">
                                        Maintaining a lean list of active sessions is critical for account security.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <ul className="text-sm space-y-2 text-muted-foreground">
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                            <span><b>Unrecognized Activity:</b> If you see a device or location you don't recognize, revoke it immediately.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                            <span><b>Public Computers:</b> If you forgot to sign out on a shared device, you can force a logout from here.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                            <span><b>Lost Devices:</b> Revoking access prevents anyone from accessing your data if your phone or laptop is stolen.</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/30 border-none">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-lg">What Happens Next?</CardTitle>
                                    </div>
                                    <CardDescription className="text-sm">
                                        Understanding the lifecycle of a revoked session.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Upon Revocation:</p>
                                        <p className="text-sm text-muted-foreground">
                                            All Refresh Tokens associated with that session are instantly blacklisted. Any subsequent request from that device will return a <b>401 Unauthorized</b> error, forcing an immediate redirect to the login page.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">If Not Revoked:</p>
                                        <p className="text-sm text-muted-foreground">
                                            The session remains valid for <b>7 days</b> from last activity. An attacker with access to an active session can bypass MFA and access sensitive project keys.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Key className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg">System-Level Security</h4>
                                        <p className="text-sm text-muted-foreground">
                                            AuthSphere uses <b>AES-256-GCM</b> encryption for session storage and <b>SHA-512</b> for token hashing.
                                            Revoking a session is a cryptographic operation that ensures zero-latency access termination across our global edge network.
                                        </p>
                                    </div>
                                    <div className="md:ml-auto">
                                        <Badge variant="outline" className="font-mono px-3 py-1">
                                            Stateless-Sync v2.1
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionManagement;
