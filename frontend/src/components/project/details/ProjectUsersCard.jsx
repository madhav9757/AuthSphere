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
import { Users, Loader2, Mail, ShieldCheck, Search } from "lucide-react";
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
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Users className="h-5 w-5 text-primary" />
                            Users
                            <Badge variant="secondary" className="ml-2">{users.length}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            All authenticated users in this project
                        </CardDescription>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {users.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <h3 className="font-semibold mb-2">No users yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Users will appear here once they authenticate through your application
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                        <AvatarFallback>
                                            {user.username?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{user.username || 'Anonymous'}</p>
                                            {user.emailVerified && (
                                                <ShieldCheck className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span className="font-mono text-xs">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 md:mt-0">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Provider</p>
                                        <Badge variant="secondary" className="text-xs capitalize">
                                            {user.provider || "Standard"}
                                        </Badge>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Joined</p>
                                        <p className="text-xs font-medium">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="py-16 text-center">
                                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">No users match your search</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProjectUsersCard;
