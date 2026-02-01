import React from 'react';
import { cn } from '../lib/utils';
import { RefreshCw } from 'lucide-react';

export const Button = ({ children, className, variant = "default", size = "default", loading, icon: Icon, ...props }) => {
    const variants = {
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
        outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
        ghost: "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading}
            {...props}
        >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : Icon && <Icon size={16} />}
            {children}
        </button>
    );
};

export const Input = ({ label, error, ...props }) => (
    <div className="space-y-1.5 mb-4 group">
        {label && <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">{label}</label>}
        <input
            className={cn(
                "w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm transition-all focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 outline-none placeholder:text-zinc-400 group-hover:border-zinc-300",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/5"
            )}
            {...props}
        />
        {error && <p className="text-[11px] text-red-500 font-medium ml-1">{error}</p>}
    </div>
);

export const Card = ({ children, className, ...props }) => (
    <div className={cn("bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm", className)} {...props}>
        {children}
    </div>
);

export const AuthLayout = ({ children, title, subtitle }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 font-inter">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
                {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    </div>
);
