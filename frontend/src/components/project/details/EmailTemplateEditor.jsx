import { useState, useMemo } from "react";
import { Mail, Palette, Layout, Type, Laptop, Smartphone, Save, Eye, RefreshCw, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "sonner";

const EmailTemplateEditor = ({ project, onUpdated }) => {
    const [logoUrl, setLogoUrl] = useState(project.emailTemplate?.logoUrl || "");
    const [primaryColor, setPrimaryColor] = useState(project.emailTemplate?.primaryColor || "#4f46e5");
    const [subjectLine, setSubjectLine] = useState(project.emailTemplate?.subjectLine || `Your Verification Code for ${project.name}`);
    const [footerText, setFooterText] = useState(project.emailTemplate?.footerText || "Secure Identity for Developers");

    const [saving, setSaving] = useState(false);
    const [previewDevice, setPreviewDevice] = useState("desktop");

    const hasChanges = useMemo(() => {
        return (
            logoUrl !== (project.emailTemplate?.logoUrl || "") ||
            primaryColor !== (project.emailTemplate?.primaryColor || "#4f46e5") ||
            subjectLine !== (project.emailTemplate?.subjectLine || `Your Verification Code for ${project.name}`) ||
            footerText !== (project.emailTemplate?.footerText || "Secure Identity for Developers")
        );
    }, [logoUrl, primaryColor, subjectLine, footerText, project]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                emailTemplate: {
                    logoUrl,
                    primaryColor,
                    subjectLine,
                    footerText
                }
            };

            const res = await updateProject(project._id, payload);

            if (res?.success) {
                toast.success("Email template updated successfully");
                onUpdated();
            }
        } catch (err) {
            toast.error("Failed to update email template");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const resetToDefault = () => {
        setLogoUrl("");
        setPrimaryColor("#4f46e5");
        setSubjectLine(`Your Verification Code for ${project.name}`);
        setFooterText("Secure Identity for Developers");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Editor Side */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <Card className="border-primary/10 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Mail className="h-4 w-4 text-primary" />
                                        Branding Assets
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Configure the visual identity of your outbound emails.
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetToDefault}
                                    className="text-[10px] h-7 gap-1.5 text-muted-foreground hover:text-primary"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Reset Defaults
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="logo" className="text-xs font-semibold flex items-center gap-1.5">
                                        <Layout className="h-3.5 w-3.5 text-muted-foreground" />
                                        Project Logo
                                    </Label>
                                    <Input
                                        id="logo"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="https://myapp.com/logo.png"
                                        className="h-9 text-sm"
                                    />
                                    <p className="text-[10px] text-muted-foreground px-1 italic">
                                        Use a transparent SVG or high-res PNG (max-height: 48px).
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="color" className="text-xs font-semibold flex items-center gap-1.5">
                                        <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                                        Primary Theme Color
                                    </Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="h-9 w-9 rounded-md border shadow-sm shrink-0 transition-colors"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                        <Input
                                            id="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            placeholder="#4f46e5"
                                            className="h-9 text-sm font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="subject" className="text-xs font-semibold flex items-center gap-1.5">
                                        <Type className="h-3.5 w-3.5 text-muted-foreground" />
                                        Email Subject Line
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={subjectLine}
                                        onChange={(e) => setSubjectLine(e.target.value)}
                                        placeholder="Your Verification Code"
                                        className="h-9 text-sm focus-visible:ring-primary/30"
                                    />
                                    <p className="text-[10px] text-muted-foreground px-1">
                                        First impression matters. Keep it clear and concise.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="footer" className="text-xs font-semibold flex items-center gap-1.5">
                                        <Layout className="h-3.5 w-3.5 text-muted-foreground" />
                                        Footer Information
                                    </Label>
                                    <Input
                                        id="footer"
                                        value={footerText}
                                        onChange={(e) => setFooterText(e.target.value)}
                                        placeholder="Secure Identity powered by AuthSphere"
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 border-t border-primary/5 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${hasChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {hasChanges ? "Unsaved Changes" : "Config Synced"}
                                </span>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                size="sm"
                                className="h-8 px-4 gap-2 text-xs font-bold shadow-md hover:shadow-primary/20 transition-all active:scale-95"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-3 w-3" />
                                        Save Configuration
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest opacity-70">
                                    <Mail className="h-3 w-3 text-primary" />
                                    Best Practice
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <ul className="text-[11px] space-y-2 text-muted-foreground list-disc list-inside">
                                    <li>Use high-contrast colors for primary branding.</li>
                                    <li>Link your logo to your main application URL.</li>
                                    <li>Keep subject lines under 60 characters for mobile.</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest opacity-70">
                                    <Lock className="h-3 w-3 text-primary" />
                                    Safety Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Avoid using external URLs for sensitive information. AuthSphere automatically handles secure token injection into your templates.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Preview Side */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            Rendering Engine
                        </h3>
                        <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg border border-primary/5">
                            <Button
                                variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7 p-0"
                                onClick={() => setPreviewDevice("desktop")}
                            >
                                <Laptop className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7 p-0"
                                onClick={() => setPreviewDevice("mobile")}
                            >
                                <Smartphone className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className={`
            border border-primary/20 rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out mx-auto
            ${previewDevice === "mobile" ? "max-w-[280px]" : "w-full"}
          `}>
                        {/* Browser/Email Header UI */}
                        <div className="bg-[#f0f1f3] px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            </div>
                            <div className="bg-white/80 rounded px-2 py-0.5 text-[9px] text-muted-foreground flex-1 overflow-hidden truncate font-mono">
                                {subjectLine}
                            </div>
                        </div>

                        {/* Email Content Container */}
                        <div className={`
                font-sans overflow-hidden transition-all duration-300
                ${previewDevice === "mobile" ? "p-4 scale-95" : "p-10"}
            `}>
                            <div className="max-w-[600px] mx-auto space-y-8">

                                {/* Email Header */}
                                <div className="text-center">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Project Logo" className="max-h-12 mx-auto transition-transform hover:scale-105 duration-300" />
                                    ) : (
                                        <h1 className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>{project.name}</h1>
                                    )}
                                </div>

                                {/* Main Body */}
                                <div className="text-center space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Verify your account</h2>
                                    <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                                        Use the code below to verify your <strong>{project.name}</strong> account.
                                        This code expires in <strong>10 minutes</strong>.
                                    </p>

                                    <div
                                        className="my-6 p-5 bg-gray-50 rounded-2xl border border-dashed text-center group transition-all"
                                        style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                                    >
                                        <span
                                            className="text-4xl font-mono font-black tracking-[12px] pl-3"
                                            style={{ color: primaryColor }}
                                        >
                                            123456
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-gray-400 font-medium">
                                        If you didn’t request this, you can safely ignore this email.
                                    </p>
                                </div>

                                {/* Footer Section */}
                                <div className="mt-10 pt-6 border-t border-gray-100/10 text-center">
                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                                        © 2026 {project.name} <span className="mx-1">•</span> {footerText}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-2 bg-muted/20 rounded-xl border border-dashed border-primary/10">
                        <p className="text-[9px] leading-relaxed text-muted-foreground text-center italic">
                            Rendering engine: V8 Webkit Standard. Actual layout may shift slightly in legacy clients like Outlook 2013-16 or Lotus Notes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateEditor;
