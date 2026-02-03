import { useState, useMemo } from "react";
import { Mail, Palette, Layout, Type, Laptop, Smartphone, Save, Eye, RefreshCw, Lock, Link as LinkIcon, Shield, MapPin, FileText, Send, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateProject, sendTestEmail } from "@/api/ProjectAPI";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const EmailTemplateEditor = ({ project, onUpdated }) => {
    const { user } = useAuthStore();
    const [logoUrl, setLogoUrl] = useState(project.emailTemplate?.logoUrl || "");
    const [primaryColor, setPrimaryColor] = useState(project.emailTemplate?.primaryColor || "#4f46e5");
    const [subjectLine, setSubjectLine] = useState(project.emailTemplate?.subjectLine || `Verify your identity – ${project.name}`);
    const [footerText, setFooterText] = useState(project.emailTemplate?.footerText || "Secure Identity for Developers");
    
    // New Fields
    const [companyAddress, setCompanyAddress] = useState(project.emailTemplate?.companyAddress || "");
    const [supportUrl, setSupportUrl] = useState(project.emailTemplate?.supportUrl || "");
    const [privacyUrl, setPrivacyUrl] = useState(project.emailTemplate?.privacyUrl || "");
    const [securityUrl, setSecurityUrl] = useState(project.emailTemplate?.securityUrl || "");
    const [customBody, setCustomBody] = useState(project.emailTemplate?.customBody || `We received a request to access your <strong>${project.name}</strong> account. To continue, please confirm your identity using the verification code below.`);
    const [showMetadata, setShowMetadata] = useState(project.emailTemplate?.showMetadata ?? true);

    const [saving, setSaving] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    const [previewDevice, setPreviewDevice] = useState("desktop");
    const [testEmail, setTestEmail] = useState(user?.email || "");

    const hasChanges = useMemo(() => {
        const et = project.emailTemplate || {};
        return (
            logoUrl !== (et.logoUrl || "") ||
            primaryColor !== (et.primaryColor || "#4f46e5") ||
            subjectLine !== (et.subjectLine || `Verify your identity – ${project.name}`) ||
            footerText !== (et.footerText || "Secure Identity for Developers") ||
            companyAddress !== (et.companyAddress || "") ||
            supportUrl !== (et.supportUrl || "") ||
            privacyUrl !== (et.privacyUrl || "") ||
            securityUrl !== (et.securityUrl || "") ||
            customBody !== (et.customBody || `We received a request to access your <strong>${project.name}</strong> account. To continue, please confirm your identity using the verification code below.`) ||
            showMetadata !== (et.showMetadata ?? true)
        );
    }, [logoUrl, primaryColor, subjectLine, footerText, companyAddress, supportUrl, privacyUrl, securityUrl, customBody, showMetadata, project]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                emailTemplate: {
                    logoUrl,
                    primaryColor,
                    subjectLine,
                    footerText,
                    companyAddress,
                    supportUrl,
                    privacyUrl,
                    securityUrl,
                    customBody,
                    showMetadata
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

    const handleSendTest = async () => {
        if (!testEmail) return toast.error("Please enter an email address");
        // Save first if there are changes
        if (hasChanges) {
            await handleSave();
        }

        try {
            setSendingTest(true);
            const res = await sendTestEmail(project._id, testEmail);
            if (res?.success) {
                toast.success(`Verification email sent to ${testEmail}`);
            }
        } catch (err) {
            toast.error(err.message || "Failed to send test email");
        } finally {
            setSendingTest(false);
        }
    };

    const resetToDefault = () => {
        setLogoUrl("");
        setPrimaryColor("#4f46e5");
        setSubjectLine(`Verify your identity – ${project.name}`);
        setFooterText("Secure Identity for Developers");
        setCompanyAddress("");
        setSupportUrl("");
        setPrivacyUrl("");
        setSecurityUrl("");
        setCustomBody(`We received a request to access your **${project.name}** account. To continue, please confirm your identity using the verification code below.`);
        setShowMetadata(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Editor Side */}
                <div className="lg:col-span-6 xl:col-span-5 space-y-6 h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
                    <Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Palette className="h-4 w-4 text-primary" />
                                        Customization
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Configure branding, text, and links.
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetToDefault}
                                    className="text-[10px] h-7 gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Reset
                                </Button>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6 pt-6">

                            {/* Branding Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                                    <Layout className="h-3.5 w-3.5" /> Branding
                                </h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo" className="text-xs font-semibold">Project Logo URL</Label>
                                        <Input
                                            id="logo"
                                            value={logoUrl}
                                            onChange={(e) => setLogoUrl(e.target.value)}
                                            placeholder="https://myapp.com/logo.png"
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color" className="text-xs font-semibold">Primary Color</Label>
                                        <div className="flex gap-2">
                                            <div
                                                className="h-9 w-9 rounded-md border shadow-sm shrink-0 transition-all"
                                                style={{ backgroundColor: primaryColor }}
                                            />
                                            <Input
                                                id="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                placeholder="#4f46e5"
                                                className="h-9 text-sm font-mono focus-visible:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Content Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                                    <Type className="h-3.5 w-3.5" /> Content
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-xs font-semibold">Subject Line</Label>
                                        <Input
                                            id="subject"
                                            value={subjectLine}
                                            onChange={(e) => setSubjectLine(e.target.value)}
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="body" className="text-xs font-semibold">
                                            Welcome Message
                                            <span className="ml-2 text-[10px] font-normal text-muted-foreground opacity-60">(Markdown supported)</span>
                                        </Label>
                                        <Textarea
                                            id="body"
                                            value={customBody}
                                            onChange={(e) => setCustomBody(e.target.value)}
                                            className="min-h-[100px] text-xs leading-relaxed focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Footer & Links Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                                    <LinkIcon className="h-3.5 w-3.5" /> Footer & Links
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="address" className="text-xs font-semibold">Company Address</Label>
                                        <Input
                                            id="address"
                                            value={companyAddress}
                                            onChange={(e) => setCompanyAddress(e.target.value)}
                                            placeholder="123 Innovation Dr, Tech City, CA"
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support" className="text-xs font-semibold">Support URL</Label>
                                        <Input
                                            id="support"
                                            value={supportUrl}
                                            onChange={(e) => setSupportUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="privacy" className="text-xs font-semibold">Privacy URL</Label>
                                        <Input
                                            id="privacy"
                                            value={privacyUrl}
                                            onChange={(e) => setPrivacyUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="security" className="text-xs font-semibold">Security URL</Label>
                                        <Input
                                            id="security"
                                            value={securityUrl}
                                            onChange={(e) => setSecurityUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="footerText" className="text-xs font-semibold">Footer Text</Label>
                                        <Input
                                            id="footerText"
                                            value={footerText}
                                            onChange={(e) => setFooterText(e.target.value)}
                                            className="h-9 text-sm focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Settings Section */}
                            <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border border-border/50">
                                <div className="space-y-0.5">
                                    <Label htmlFor="metadata" className="text-xs font-bold flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5 text-emerald-500" />
                                        Include Security Metadata
                                    </Label>
                                    <p className="text-[10px] text-muted-foreground">
                                        Show device, IP info, and timestamp in emails.
                                    </p>
                                </div>
                                <Switch
                                    id="metadata"
                                    checked={showMetadata}
                                    onCheckedChange={setShowMetadata}
                                />
                            </div>

                        </CardContent>
                        
                        <CardFooter className="bg-muted/5 border-t border-border/50 py-4 flex flex-col gap-3 sticky bottom-0 z-10 backdrop-blur-md">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                className="w-full gap-2 font-bold shadow-md transition-all active:scale-[0.98]"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            {!hasChanges && (
                                <p className="text-[10px] text-center text-muted-foreground opacity-60 font-medium">
                                    All configurations are synced.
                                </p>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Send Test Email Card */}
                    <Card className="border-dashed border-primary/20 bg-primary/5">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs flex items-center gap-2 uppercase tracking-widest text-primary font-black">
                                <Send className="h-3 w-3" />
                                Test Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Experience the real template in your own inbox. We'll send a live version of the "Developer Edition" render.
                            </p>
                            <div className="flex gap-2">
                                <Input 
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="your-email@example.com"
                                    className="h-8 text-xs bg-background/50"
                                />
                                <Button 
                                    size="sm" 
                                    onClick={handleSendTest}
                                    disabled={sendingTest || !testEmail}
                                    className="h-8 px-4 gap-2 text-[10px] font-bold"
                                >
                                    {sendingTest ? <RefreshCw className="h-3 w-3 animate-spin"/> : <Send className="h-3 w-3"/>}
                                    Send
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Side (Stick to top on Desktop) */}
                <div className="lg:col-span-6 xl:col-span-7 space-y-4 lg:sticky lg:top-8 h-fit">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                Live Preview
                            </h3>
                            <p className="text-[10px] text-muted-foreground">
                                Real-time render of the "Developer Edition" template.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-background border border-border/50 p-1 rounded-lg shadow-sm">
                                <Button
                                    variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setPreviewDevice("desktop")}
                                >
                                    <Laptop className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setPreviewDevice("mobile")}
                                >
                                    <Smartphone className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSendTest}
                                disabled={sendingTest || !testEmail}
                                className="h-9 px-4 gap-2 text-xs font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                            >
                                {sendingTest ? <RefreshCw className="h-3 w-3 animate-spin"/> : <Send className="h-3 w-3 text-primary"/>}
                                <span className="hidden sm:inline">Send Test</span>
                            </Button>
                        </div>
                    </div>

                    {/* Email Container - Scaling wrapper */}
                    <div className="relative w-full flex justify-center bg-gray-100/50 rounded-xl border border-border/50 p-4 min-h-[600px] shadow-inner">
                        <div 
                            className={`
                                bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 ease-in-out border border-gray-200
                                ${previewDevice === "mobile" ? "w-[320px]" : "w-full max-w-[600px]"}
                            `}
                        >
                            {/* Fake Browser Chrome */}
                            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                                <div className="flex gap-1.5 opacity-60">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="text-[10px] font-medium text-gray-500 truncate max-w-[200px] mx-auto bg-white border border-gray-100 rounded-md py-0.5 px-2">
                                        {subjectLine}
                                    </div>
                                </div>
                            </div>

                            {/* Email Body Content - Matching test-smtp.js output */}
                            <div className="p-8 md:p-10 font-sans text-[#1e293b]">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
                                    <div className="flex items-center gap-3">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                                        ) : null}
                                        <span className="text-lg font-bold text-gray-900">{project.name}</span>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        Secure Auth
                                    </div>
                                </div>

                                {/* Main */}
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-extrabold text-gray-900">Verify your identity</h1>
                                    
                                    <div 
                                        className="text-[15px] leading-relaxed text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: customBody }}
                                    />

                                    {/* OTP Box */}
                                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center my-8">
                                        <div className="text-4xl md:text-5xl font-mono font-extrabold tracking-[0.1em]" style={{ color: primaryColor }}>
                                            892 043
                                        </div>
                                        <div className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Verification Code
                                        </div>
                                        <div className="mt-4 text-xs text-gray-500">
                                            Valid for 10 minutes.<br/>Do not share this code.
                                        </div>
                                    </div>

                                    {/* Info Grid (Metadata) */}
                                    {showMetadata && (
                                        <div className="border-t border-gray-100 pt-8 mt-8">
                                            <div className="grid grid-cols-1 gap-y-2 text-[13px] text-gray-500">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-400">Time</span>
                                                    <span className="font-mono text-gray-700">{new Date().toUTCString().split(' ').slice(4,5).join(' ')} UTC</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-400">Device</span>
                                                    <span className="font-mono text-gray-700">Chrome / Windows</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-400">IP Address</span>
                                                    <span className="font-mono text-gray-700">192.168.1.1</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-400">Location</span>
                                                    <span className="font-mono text-gray-700">San Francisco, US</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-400">Ref ID</span>
                                                    <span className="font-mono text-gray-700">req_a7f92b</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Notice */}
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-5 mt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                                <Shield className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="text-xs text-amber-800 leading-relaxed">
                                                <strong>Security Notice:</strong> If you did not request this verification, your password may be compromised. Please secure your account immediately.
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 mt-10 pt-8 text-center bg-gray-50/50 -mx-10 -mb-10 p-8 pb-10">
                                    <div className="flex flex-wrap justify-center gap-4 mb-5 text-xs font-semibold text-gray-500">
                                        {supportUrl && <span style={{color: primaryColor}}>Support</span>}
                                        {privacyUrl && <span style={{color: primaryColor}}>Privacy</span>}
                                        {securityUrl && <span style={{color: primaryColor}}>Security</span>}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                        © {new Date().getFullYear()} {project.name}. All rights reserved.<br/>
                                        {companyAddress || "Company Address"}
                                    </p>
                                    <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                                        {footerText}
                                    </p>
                                    <div className="mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                                        Powered by AuthSphere
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmailTemplateEditor;
