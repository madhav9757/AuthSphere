import { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProjectKeysCard = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(project.publicKey);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          API Keys
        </CardTitle>
        <CardDescription>
          Use this key to authenticate requests from your app
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Public Key */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Public Key
            </p>
            <Badge
              variant="secondary"
              className="font-mono text-xs break-all"
            >
              {project.publicKey}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="w-fit"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          Keep your API keys secure. Do not expose them in public repositories
          or client-side code.
        </p>

      </CardContent>
    </Card>
  );
};

export default ProjectKeysCard;
