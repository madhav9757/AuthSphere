import React from "react";
import { Command, Shield } from "lucide-react";

export const SplitScreenLogin = () => {
    return (
        <div className="w-full h-[600px] lg:grid lg:grid-cols-2 rounded-xl overflow-hidden shadow-2xl bg-white text-zinc-950 font-sans">

            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                {/* Abstract Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-zinc-700 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-2 text-lg font-bold">
                    <Command className="h-6 w-6" /> Acme Corp
                </div>
                <div className="relative z-10 z space-y-2">
                    <blockquote className="text-xl font-medium leading-relaxed italic border-l-2 pl-6 border-zinc-600">
                        "This authentication library changed the way we handle users. It's secure, fast, and unbelievably easy to integrate."
                    </blockquote>
                    <p className="pl-6 text-zinc-400 font-semibold">— Sofia Davis, CTO</p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-zinc-500">
                            Enter your email below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                                id="password"
                                placeholder="********"
                                type="password"
                            />
                        </div>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 h-9 px-4 w-full">
                            Sign In with Email
                        </button>
                    </div>

                    <p className="px-8 text-center text-sm text-zinc-500">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-zinc-900">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-zinc-900">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};
