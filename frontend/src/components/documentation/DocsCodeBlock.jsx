import React, { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";

const DocsCodeBlock = ({ code, id, language = "bash" }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4">
            <div className="absolute left-4 -top-2.5 px-2 py-0.5 bg-card rounded text-xs font-mono text-muted-foreground border shadow-sm z-10">
                {language}
            </div>
            <div className="absolute right-3 top-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyCode}
                    className="p-1.5 bg-muted hover:bg-muted/80 rounded text-muted-foreground border transition-all"
                >
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <pre className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-5 pt-8 overflow-x-auto border border-zinc-800 shadow-sm">
                <code className="text-sm font-mono leading-relaxed text-zinc-50">{code}</code>
            </pre>
        </div>
    );
};

export default DocsCodeBlock;
