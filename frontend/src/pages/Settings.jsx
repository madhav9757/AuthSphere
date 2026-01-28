import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Palette,
    Globe,
    Trash2,
    Save,
    AlertCircle,
    UserCircle,
    Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateProfile, deleteAccount } from "@/api/DeveloperAPI";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Profile State
    const [profileData, setProfileData] = useState({
        username: user?.username || "",
        email: user?.email || "",
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await updateProfile({ username: profileData.username });
            if (res.success) {
                setUser({ ...user, username: res.data.username });
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete your AuthSphere account and ALL associated projects. This action cannot be undone. Are you absolutely sure?")) {
            return;
        }

        try {
            setLoading(true);
            const res = await deleteAccount();
            if (res.success) {
                toast.success("Account deleted. We're sorry to see you go.");
                logout();
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-6 max-w-5xl">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground italic">
                    Manage your account settings, security preferences, and dashboard experience.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] h-auto p-1 bg-muted/50">
                    <TabsTrigger value="profile" className="gap-2 py-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2 py-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 py-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2 py-2">
                        <Smartphone className="h-4 w-4" />
                        Advanced
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>
                                This information will be displayed on your developer profile and API interactions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center bg-muted overflow-hidden">
                                            {user?.picture ? (
                                                <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserCircle className="h-12 w-12 text-muted-foreground" />
                                            )}
                                        </div>
                                        <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-xs font-medium">
                                            Change
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center max-w-[100px]">
                                        JPG, GIF or PNG. 1MB Max.
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Developer Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="username"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            This is your public display name. It can be your real name or a pseudonym.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                disabled
                                                value={profileData.email}
                                                className="pl-10 bg-muted/30"
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            Emails cannot be changed for social-linked accounts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/10 px-6 py-4 rounded-b-xl flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <AlertCircle className="h-3 w-3" />
                                <span>Updates sync across all linked projects</span>
                            </div>
                            <Button onClick={handleProfileUpdate} disabled={loading} className="gap-2">
                                {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle>Interface Customization</CardTitle>
                            <CardDescription>
                                Personalize how AuthSphere looks and feels on your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium">Theme Mode</h4>
                                    <p className="text-sm text-muted-foreground italic">
                                        Switch between light, dark, and system themes.
                                    </p>
                                </div>
                                <ModeToggle />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium italic">High Contrast Mode</h4>
                                    <p className="text-sm text-muted-foreground italic">
                                        Increase visibility of borders and text.
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" disabled>Coming Soon</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle>Security & Authentication</CardTitle>
                            <CardDescription>
                                Manage how you access your account and protect your data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium">Active Sessions</h4>
                                    <p className="text-sm text-muted-foreground">
                                        View and manage devices currently signed into your account.
                                    </p>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link to="/settings/sessions" className="gap-2">
                                        Manage Sessions <Globe className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between opacity-50">
                                <div className="space-y-1">
                                    <h4 className="font-medium italic">Two-Factor Authentication (2FA)</h4>
                                    <p className="text-sm text-muted-foreground italic">
                                        Add an extra layer of security to your account.
                                    </p>
                                </div>
                                <Badge variant="secondary">Enterprise Only</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle>Advanced Options</CardTitle>
                            <CardDescription>
                                Sensitive account operations and developer-specific controls.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1 text-destructive">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" /> Delete Account
                                    </h4>
                                    <p className="text-sm opacity-80 italic">
                                        Permanently remove all projects, members, and personal data.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Execute Deletion"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-dashed border-primary/20">
                        <CardContent className="p-6 flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-primary italic">Developer Compliance</h4>
                                <p className="text-sm text-muted-foreground italic leading-relaxed">
                                    Deleting your account will immediately revoke all API keys for your <b>{user?.username}</b> projects.
                                    Any applications relying on AuthSphere for this account will stop working instantly.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
