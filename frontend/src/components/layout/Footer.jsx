import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
    Github,
    Twitter,
    DiscIcon,
    BookOpen,
    CreditCard,
    Activity,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 py-12">
                {/* Top */}
                <div className="grid gap-10 md:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg border flex items-center justify-center">
                                <img
                                    src="/assets/logo.png"
                                    alt="AuthSphere"
                                    className="h-6 w-6 object-contain dark:invert"
                                />
                            </div>
                            <span className="text-lg font-semibold">AuthSphere</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Secure, modern authentication infrastructure built for developers.
                        </p>
                    </div>

                    {/* Resources */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium">Resources</h4>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link to="/pricing" className="flex items-center gap-2 hover:text-primary">
                                <CreditCard className="h-4 w-4" />
                                Pricing
                            </Link>
                            <Link to="/docs" className="flex items-center gap-2 hover:text-primary">
                                <BookOpen className="h-4 w-4" />
                                Documentation
                            </Link>
                            <Link to="#" className="flex items-center gap-2 hover:text-primary">
                                <Activity className="h-4 w-4" />
                                Status
                            </Link>
                        </nav>
                    </div>

                    {/* Community */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium">Community</h4>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link to="#" className="flex items-center gap-2 hover:text-primary">
                                <Github className="h-4 w-4" />
                                GitHub
                            </Link>
                            <Link to="#" className="flex items-center gap-2 hover:text-primary">
                                <Twitter className="h-4 w-4" />
                                Twitter
                            </Link>
                            <Link to="#" className="flex items-center gap-2 hover:text-primary">
                                <DiscIcon className="h-4 w-4" />
                                Discord
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Divider */}
                <Separator className="my-8" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2026 AuthSphere. All rights reserved.</p>

                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-xs">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
