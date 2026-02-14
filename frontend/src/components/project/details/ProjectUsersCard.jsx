import { useEffect, useState } from "react";
import {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  toggleUserBlock,
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
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Loader2,
  Mail,
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  UserX,
  CheckCircle,
  XCircle,
  RefreshCw,
  Ban,
  Unlock,
  Lock,
  Info,
  Activity,
  UserMinus,
  AlertTriangle,
  Fingerprint,
  Calendar,
  ArrowRight,
  ShieldIcon,
  CheckCircle2,
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
        toast.success("User profile permanently removed");
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
      toast.error(error.message || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await toggleUserBlock(projectId, userId);
      if (res.success) {
        toast.success(res.message);
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u,
          ),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update block status");
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
      <div className="flex flex-col items-center justify-center p-20 gap-4 bg-background/50 backdrop-blur-sm rounded-3xl border border-dashed">
        <Loader2 className="h-12 w-12 animate-spin text-primary/50" />
        <div className="text-center space-y-1">
          <p className="font-semibold text-foreground">
            Loading identity database...
          </p>
          <p className="text-xs text-muted-foreground italic">
            Fetching secure user records from the vault
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header Card */}
      <Card className="bg-card/30 border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Users size={180} />
        </div>
        <CardHeader className="pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Identity Vault
                  </CardTitle>
                  <CardDescription className="text-sm mt-1 max-w-xl leading-relaxed">
                    Manage and audit end-user authentication profiles. Control
                    verification status, monitor registration channels, and
                    enforce account suspensions for your project.
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter identities by email or name..."
                  className="pl-9 h-11 bg-background/40 border-border/50 focus:bg-background/80 transition-all rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-background/40 hover:bg-background/80 border-border/50"
                onClick={fetchUsers}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Metric Cards (Brief Explanation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Total Identities
              </p>
              <h4 className="text-2xl font-bold font-mono">{users.length}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Verified Channels
              </p>
              <h4 className="text-2xl font-bold font-mono">
                {users.filter((u) => u.isVerified).length}
              </h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Suspended Accounts
              </p>
              <h4 className="text-2xl font-bold font-mono">
                {users.filter((u) => u.isBlocked).length}
              </h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/50 bg-card/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="h-24 w-24 bg-muted/40 rounded-full flex items-center justify-center mb-6 mx-auto border border-dashed border-border/60">
                <Users className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                No identities discovered yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                As soon as users register through your integrated flow, they
                will appear in this vault.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr className="text-left text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <th className="px-8 py-5">End-User Identity</th>
                  <th className="px-6 py-5">Security Status</th>
                  <th className="px-6 py-5">Auth Channel</th>
                  <th className="px-6 py-5">Registration Date</th>
                  <th className="px-8 py-5 text-right">Vault Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-muted/20 transition-all group ${user.isBlocked ? "opacity-75" : ""}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar
                            className={`h-10 w-10 border-2 shadow-sm transition-all duration-300 ${user.isBlocked ? "grayscale opacity-50 border-red-500/30" : "border-background group-hover:border-primary/30"}`}
                          >
                            <AvatarImage
                              src={
                                user.picture ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                              }
                            />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                              {user.username?.substring(0, 2).toUpperCase() ||
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          {user.isBlocked && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm ring-2 ring-background">
                              <Ban size={10} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`font-bold text-sm truncate ${user.isBlocked ? "text-muted-foreground line-through decoration-red-500/40" : "text-foreground group-hover:text-primary"}`}
                          >
                            {user.username || "Anonymous User"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          {user.isVerified ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] h-5 bg-emerald-500/5 text-emerald-600 border-emerald-500/20 gap-1 pl-1 font-bold tracking-tight"
                            >
                              <CheckCircle2 className="h-3 w-3" /> VERIFIED
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[9px] h-5 bg-amber-500/5 text-amber-600 border-amber-500/20 gap-1 pl-1 font-bold tracking-tight"
                            >
                              <AlertTriangle className="h-3 w-3" /> UNVERIFIED
                            </Badge>
                          )}

                          {user.isBlocked && (
                            <Badge
                              variant="outline"
                              className="text-[9px] h-5 bg-red-500/5 text-red-600 border-red-500/20 gap-1 pl-1 font-bold tracking-tight"
                            >
                              <Ban className="h-3 w-3" /> BLOCKED
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${user.provider === "local" ? "bg-primary" : "bg-blue-400 animate-pulse"}`}
                        />
                        <span className="capitalize text-[11px] font-semibold text-muted-foreground tracking-wide">
                          {user.provider}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[11px] font-medium tracking-tight">
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actionLoading === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary/50 mr-2" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-muted/80 transition-all border border-transparent hover:border-border/50"
                              >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 p-2 rounded-xl border-border/50 shadow-xl bg-background/95 backdrop-blur-md"
                            >
                              <DropdownMenuLabel className="px-2 pb-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                Identity Protocol
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                className="gap-2.5 cursor-pointer rounded-lg py-2.5 px-3 focus:bg-primary/5 focus:text-primary transition-colors"
                                onClick={() => handleToggleVerify(user._id)}
                              >
                                {user.isVerified ? (
                                  <>
                                    {" "}
                                    <ShieldAlert className="h-4 w-4 text-amber-500" />{" "}
                                    <span className="text-sm font-medium">
                                      Revoke Verification
                                    </span>{" "}
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />{" "}
                                    <span className="text-sm font-medium">
                                      Approve Verification
                                    </span>{" "}
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className={`gap-2.5 cursor-pointer rounded-lg py-2.5 px-3 transition-colors ${user.isBlocked ? "focus:bg-emerald-50 focus:text-emerald-600" : "focus:bg-red-50 focus:text-red-600"}`}
                                onClick={() => handleToggleBlock(user._id)}
                              >
                                {user.isBlocked ? (
                                  <>
                                    {" "}
                                    <Unlock className="h-4 w-4 text-emerald-500" />{" "}
                                    <span className="text-sm font-medium">
                                      Release Hold (Unblock)
                                    </span>{" "}
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <Ban className="h-4 w-4 text-red-500" />{" "}
                                    <span className="text-sm font-medium">
                                      Enforce Suspension
                                    </span>{" "}
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="my-2 opacity-50" />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="gap-2.5 text-destructive focus:bg-destructive/5 cursor-pointer rounded-lg py-2.5 px-3 transition-colors"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Permanent Deletion
                                    </span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                                  <AlertDialogHeader>
                                    <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                      <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <AlertDialogTitle className="text-center text-xl">
                                      Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center pt-2">
                                      You are about to permanently purge the
                                      identity <strong>{user.email}</strong>.
                                      This action is irreversible—all session
                                      data and profile information for this user
                                      will be destroyed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="sm:justify-center gap-2 pt-4">
                                    <AlertDialogCancel className="rounded-xl px-6">
                                      Abort
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 text-white hover:bg-red-700 rounded-xl px-6"
                                      onClick={() => handleDelete(user._id)}
                                    >
                                      Expunge Record
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
          )}
        </div>
      </Card>

      {/* No Results Fallback */}
      {filteredUsers.length === 0 && users.length > 0 && (
        <Card className="p-20 text-center bg-muted/10 border-border/50 border-dashed rounded-3xl">
          <UserX className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
          <h4 className="text-lg font-semibold text-foreground">
            Query mismatch
          </h4>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            No records match the provided filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="rounded-xl px-8"
          >
            Clear Search Filter
          </Button>
        </Card>
      )}

      {/* Educational & Security Guidance Section */}
      <div className="pt-10 border-t border-dashed border-border/60">
        <div className="flex items-center gap-3 mb-8">
          <ShieldIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Understanding User Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status & Verification Explanation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" /> IdentityLifecycle
            </h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none">
                    Verified
                  </Badge>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                  />
                  <span className="text-xs font-semibold">Allowed Entry</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Users with verified status have successfully confirmed their
                  email ownership through the OTP flow. This reduces fraud and
                  ensures you have a reliable way to reach your users.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-amber-500/10 text-amber-600 border-none">
                    Unverified
                  </Badge>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                  />
                  <span className="text-xs font-semibold">Limited Access</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  If you have{" "}
                  <code className="text-[10px] bg-muted px-1 rounded">
                    Require Email Verification
                  </code>{" "}
                  enabled in settings, these users will be blocked from full
                  authentication until they complete the handshake.
                </p>
              </div>
            </div>
          </div>

          {/* Account Blocking Explanation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" /> Security Protocol
            </h4>

            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Ban className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h5 className="text-sm font-bold">
                    Account Suspension (Blocking)
                  </h5>
                  <p className="text-[10px] text-muted-foreground tracking-tight">
                    The ultimate deterrent for malicious actors
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  "When you block a user, their identity record remains in your
                  vault for auditing, but all authentication attempts will be
                  hard-rejected with a suspension error."
                </p>
                <div className="space-y-2 pt-1 border-t border-red-500/10">
                  {[
                    "Kills active sessions immediately",
                    "Blocks all social & local login paths",
                    "Prevents password resets & token refreshes",
                    "No notification is sent to the user (Silent Hold)",
                  ].map((impact, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-red-400" />
                      <span className="text-[10px] font-medium text-red-700/80">
                        {impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Best Practices Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldIcon className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-sm">
              Security Best Practice: The Principle of Least Privilege
            </h4>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Regularly audit your user database. Purge old, inactive identities
              or use the <strong>Block</strong> feature for accounts showing
              suspicious activity instead of deleting them immediately to
              maintain audit trails.
            </p>
          </div>
          <div className="md:ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 group text-primary hover:text-primary hover:bg-primary/5"
            >
              Review Security Policy{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectUsersCard;
