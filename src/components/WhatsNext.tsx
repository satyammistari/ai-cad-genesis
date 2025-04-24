
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WhatsNext = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">What's Next?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Refine & Customize</CardTitle>
            <CardDescription>Fine-tune the AI-powered CAD platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Customize the platform's design through prompts</li>
              <li>Adjust visual elements and layout</li>
              <li>Configure model generation parameters</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Prompting</CardTitle>
            <CardDescription>Learn to craft effective prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Write clear, detailed model descriptions</li>
              <li>Specify precise measurements and features</li>
              <li>Use technical terminology effectively</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug with Ease</CardTitle>
            <CardDescription>Rapid troubleshooting tools</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Access chat mode for immediate help</li>
              <li>Review console logs and error messages</li>
              <li>Get AI-powered debugging suggestions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
            <CardDescription>Version control and collaboration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="list-disc pl-4 space-y-2">
                <li>Track changes and manage versions</li>
                <li>Collaborate with team members</li>
                <li>Backup your project securely</li>
              </ul>
              <Button variant="outline" className="w-full">
                <Github className="mr-2" />
                Connect to GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsNext;
