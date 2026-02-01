import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
    Users,
    Loader2,
    Mail,
    ShieldCheck,
    Search,
    Filter,
    ArrowRight,
    ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ProjectUsersCard = ({ projectId }) => {
    const navigate = useNavigate();
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

    return (
        <Card className="border shadow-sm">
            <CardHeader className="border-b bg-muted/40 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Users className="h-5 w-5 text-primary" />
                            Registered Users
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">{users.length}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Monitor and manage users who have authenticated with your project.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-background gap-2"
                            onClick={() => navigate(`/projects/${projectId}/users`)}
                        >
                            <ExternalLink className="h-4 w-4" />
                            Manage All Users
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9 bg-background h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">Syncing user data...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 px-6">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No users found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Users will appear here once they sign up or log in through your application.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background group-hover:border-primary/20 transition-colors">
                                            <AvatarImage src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {user.username?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${user.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-semibold text-sm md:text-base">{user.username || 'Anonymous'}</p>
                                            {user.emailVerified && (
                                                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Verified</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="font-mono text-xs">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 mt-4 md:mt-0 pl-16 md:pl-0">
                                    <div className="text-left md:text-right min-w-[100px]">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Provider</p>
                                        <Badge variant="outline" className="text-xs capitalize font-medium">
                                            {user.provider || "Standard"}
                                        </Badge>
                                    </div>

                                    <div className="text-left md:text-right min-w-[120px]">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Signed Up</p>
                                        <p className="text-xs font-medium text-foreground/80">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {format(new Date(user.createdAt), "h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="py-16 text-center">
                                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">No users match "{searchQuery}"</p>
                                <Button
                                    variant="link"
                                    onClick={() => setSearchQuery("")}
                                    className="mt-2 text-primary"
                                >
                                    Clear search
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            {users.length > 5 && (
                <div className="p-2 border-t bg-muted/20 text-center">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8">
                        View all {users.length} users
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ProjectUsersCard;
