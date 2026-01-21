import { useEffect, useState } from "react";
import { getProjectUsers } from "@/api/ProjectAPI";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Mail, ShieldCheck, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const ProjectUsersCard = ({ projectId }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getProjectUsers(projectId);
                if (res.success) {
                    setUsers(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchUsers();
    }, [projectId]);

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Card className="border-border shadow-sm bg-card">
                <CardContent className="flex flex-col items-center justify-center py-24 gap-6">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-blue-500/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Syncing identity ledger...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border shadow-sm bg-card overflow-hidden transition-all duration-300">
            <CardHeader className="border-b border-border bg-muted/20 pb-8 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <div className="space-y-2">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black text-foreground italic">
                            <Users size={24} className="text-blue-600 dark:text-blue-400" />
                            Identity Registry
                            <Badge className="ml-3 bg-blue-600 text-white dark:bg-blue-500 border-none font-black text-xs px-3">
                                {users.length} Total
                            </Badge>
                        </CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">
                            Global view of authenticated personas within this shard.
                        </CardDescription>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Find character by email or alias..."
                            className="pl-12 pr-4 rounded-2xl bg-background border-border focus:ring-4 focus:ring-blue-500/10 py-6 font-medium text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Filter size={14} className="text-muted-foreground/30" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {users.length === 0 ? (
                    <div className="text-center py-32 px-6 animate-in fade-in duration-700">
                        <div className="h-20 w-20 bg-muted/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-border">
                            <Users className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-foreground font-black text-xl italic">Empty Registry</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2 font-medium">
                            Once entities begin authenticating via your decentralized keys, their profiles will propagate here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredUsers.map((user, idx) => (
                            <div
                                key={user._id}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:px-10 hover:bg-muted/30 transition-all cursor-default animate-in fade-in slide-in-from-right-4 duration-300"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-xl ring-1 ring-border">
                                            <AvatarImage src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                            <AvatarFallback className="bg-muted text-foreground font-black text-xs">
                                                {user.username?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-foreground text-base tracking-tight">{user.username || 'Anonymous User'}</p>
                                            {user.emailVerified && (
                                                <Badge variant="outline" className="h-5 px-1.5 border-blue-500/30 bg-blue-500/5 text-blue-500">
                                                    <ShieldCheck className="h-3 w-3" />
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5 opacity-50" />
                                            <span className="text-xs font-mono font-bold tracking-tighter select-all">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 opacity-60">Source Provider</p>
                                        <Badge variant="secondary" className="text-[10px] font-black py-1 px-3 bg-muted border-none text-foreground uppercase tracking-widest">
                                            {user.provider || "Standard Auth"}
                                        </Badge>
                                    </div>

                                    <div className="text-left md:text-right min-w-[120px]">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 opacity-60">Onboarded</p>
                                        <p className="text-xs font-black text-foreground uppercase">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="py-32 text-center text-muted-foreground flex flex-col items-center gap-4 animate-in fade-in duration-500">
                                <Search className="h-10 w-10 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero matches in current registry subspace.</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <div className="bg-muted/10 p-4 border-t border-border flex justify-center">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
                    Encrypted Identity Stream • Real-time Sync Active
                </p>
            </div>
        </Card>
    );
};

export default ProjectUsersCard;