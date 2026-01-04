import { useState } from "react";
import { Save, Settings } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProject } from "@/api/ProjectAPI";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateProject(project._id, { name });

      if (res?.success) {
        onUpdated();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Project Settings
        </CardTitle>
        <CardDescription>
          Update basic project configuration
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="project-name">
            Project Name
          </Label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving || name.trim() === ""}
          className="w-fit"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>

      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
