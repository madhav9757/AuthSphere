import React, { useState, useEffect } from "react";
import { Terminal, ChevronRight } from "lucide-react";

export const DeveloperLogin = () => {
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setCursorVisible(v => !v), 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[600px] w-full flex items-center justify-center bg-zinc-950 p-4 font-mono text-green-500">
            <div className="w-full max-w-lg border border-green-500/30 rounded bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)] p-6">

                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-green-500/30 pb-4 mb-6 opacity-70">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="text-xs">usr/bin/login</div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-sm opacity-80">Last login: {new Date().toUTCString()} on ttys000</p>
                        <h2 className="text-2xl font-bold tracking-tight text-white mt-4">System Access</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest opacity-50 mb-1">Identity</label>
                            <div className="flex items-center border-b border-green-500/50 py-2 group-focus-within:border-green-400">
                                <span className="mr-2 text-green-600">$</span>
                                <input
                                    type="email"
                                    placeholder="user@domain.com"
                                    className="bg-transparent border-none w-full text-green-400 placeholder-green-800 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest opacity-50 mb-1">Secret</label>
                            <div className="flex items-center border-b border-green-500/50 py-2 group-focus-within:border-green-400">
                                <span className="mr-2 text-green-600">$</span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-transparent border-none w-full text-green-400 placeholder-green-800 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-green-900/20 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black transition-all py-3 px-4 font-bold flex items-center justify-center gap-2 group">
                        <Terminal className="w-4 h-4" />
                        <span>AUTHENTICATE</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </button>

                    <div className="text-xs text-center opacity-40 pt-4">
                        {`> _`} System Integrity Check: OK <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>█</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
