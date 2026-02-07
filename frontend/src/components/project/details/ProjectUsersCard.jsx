import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  getProject,
} from "@/api/ProjectAPI";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Loader2,
  Mail,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  UserX,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const ProjectUsersCard = ({ projectId }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getProjectUsers(projectId);
      if (res.success) setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchUsers();
  }, [projectId]);

  const handleDelete = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await deleteProjectUser(projectId, userId);
      if (res.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u._id !== userId));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await toggleUserVerification(projectId, userId);
      if (res.success) {
        toast.success(res.message);
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isVerified: !u.isVerified } : u,
          ),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading user database...
        </p>
      </div>
    );
  }

  return (
    <Card className="border shadow-lg overflow-hidden flex flex-col h-full bg-card">
      <CardHeader className="border-b bg-muted/30 pb-6 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2 font-bold">
              <Users className="h-5 w-5 text-primary" />
              User Database
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none font-bold"
              >
                {users.length} Total
              </Badge>
            </CardTitle>
            <CardDescription>
              Full-featured management of your end-users authentication
              profiles.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                className="pl-9 h-10 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={fetchUsers}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-auto">
        {users.length === 0 ? (
          <div className="text-center py-24 px-6 h-full flex flex-col items-center justify-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No users found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              End-users will appear here once they sign up through your
              integrated AuthSphere flow.
            </p>
          </div>
        ) : (
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
                  <tr className="border-b text-left text-xs uppercase font-bold text-muted-foreground tracking-wider">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-9 w-9 border shadow-sm group-hover:border-primary/30 transition-all">
                            <AvatarImage
                              src={
                                user.picture ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                              }
                            />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">
                              {user.username?.substring(0, 2).toUpperCase() ||
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                              {user.username || "Anonymous"}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 pl-1.5 py-0.5 font-medium"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 pl-1.5 py-0.5 font-medium"
                          >
                            <XCircle className="h-3 w-3" />
                            Unverified
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="capitalize text-[10px] font-bold py-0 h-5 border-primary/20"
                        >
                          {user.provider}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(user.createdAt), "h:mm a")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {actionLoading === user._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-muted-foreground/10"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                  User Actions
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="gap-2 cursor-pointer"
                                  onClick={() => handleToggleVerify(user._id)}
                                >
                                  {user.isVerified ? (
                                    <>
                                      <ShieldAlert className="h-4 w-4 text-amber-500" />{" "}
                                      Unverify User
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="h-4 w-4 text-emerald-500" />{" "}
                                      Verify User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the user{" "}
                                        <strong>{user.email}</strong> from this
                                        project. They will lose all session
                                        access and account data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => handleDelete(user._id)}
                                      >
                                        Delete User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>

      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="py-20 text-center bg-muted/10 border-t shrink-0">
          <UserX className="h-10 w-10 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm font-medium">
            No users match your criteria
          </p>
          <Button
            variant="link"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-primary"
          >
            Reset search filter
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProjectUsersCard;
