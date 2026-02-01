import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "@/api/ProjectAPI";
import EmailTemplateEditor from "@/components/project/details/EmailTemplateEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EmailCustomizationPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProject = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getProject(projectId);
            if (!res?.success) throw new Error(res?.message || "Failed to load project");
            setProject(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            if (projectId) await loadProject();
        };
        fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading email settings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 px-6">
                <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Error Loading Settings</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <div className="flex items-center justify-center gap-3">
                            <Link to={`/projects/${projectId}`}>
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Project
                                </Button>
                            </Link>
                            <Button onClick={loadProject} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto px-6 py-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b">
                <div className="flex items-start gap-5">
                    <Link to={`/projects/${projectId}`}>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shadow-sm hover:bg-primary/5 hover:text-primary transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-widest">Branding Engine</span>
                            <span className="text-muted-foreground text-xs">•</span>
                            <span className="text-muted-foreground text-xs font-medium">{project.name}</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Email Customization</h1>
                        <p className="text-sm text-muted-foreground max-w-lg">
                            Design a seamless brand experience by customizing the look and feel of your automated verification emails.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</p>
                        <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 justify-end">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Ready for Production
                        </div>
                    </div>
                </div>
            </div>

            <EmailTemplateEditor project={project} onUpdated={loadProject} />
        </div>
    );
};

export default EmailCustomizationPage;
