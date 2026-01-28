import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
    return (
        <footer className="border-t py-12 px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg border flex items-center justify-center">
                                <img
                                    src="/assets/logo.png"
                                    alt="AuthSphere"
                                    className="h-6 w-6 object-contain dark:invert"
                                />
                            </div>
                            <span className="font-bold text-xl">AuthSphere</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            The identity infrastructure for the modern web. Built by developers, for developers.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Resources</h4>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                            <Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                            <Link to="#" className="hover:text-primary transition-colors">SDK Reference</Link>
                            <Link to="#" className="hover:text-primary transition-colors">Status</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Company</h4>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link to="#" className="hover:text-primary transition-colors">Twitter</Link>
                            <Link to="#" className="hover:text-primary transition-colors">GitHub</Link>
                            <Link to="#" className="hover:text-primary transition-colors">Discord</Link>
                        </div>
                    </div>
                </div>

                <Separator className="mb-6" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 AuthSphere. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
