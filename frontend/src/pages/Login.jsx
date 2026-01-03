import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Chrome, Disc } from "lucide-react"; // Icons

const Login = () => {
    const handleSocialLogin = (provider) => {
        window.location.href = `http://localhost:8000/auth/${provider}`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Choose your preferred login method
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => handleSocialLogin('google')}>
                            <Chrome className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('github')}>
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('discord')}>
                        <Disc className="mr-2 h-4 w-4 text-indigo-500" />
                        Continue with Discord
                    </Button>

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* Local Login Form */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Sign In</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;