
import { Github, Code, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const WhatsNext = () => {
  const [githubConnecting, setGithubConnecting] = useState(false);

  const handleGithubConnect = () => {
    setGithubConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setGithubConnecting(false);
      toast.success("GitHub repository connected successfully!", {
        description: "Your project is now linked to version control"
      });
    }, 2000);
  };

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
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="w-full mt-4" variant="outline">
                  <Wrench className="mr-2 h-4 w-4" />
                  Open Customization Panel
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Refine & Customize</DrawerTitle>
                  <DrawerDescription>
                    Adjust your platform's appearance and behavior
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="theme" className="text-sm font-medium">UI Theme</label>
                    <select id="theme" className="w-full p-2 border rounded-md">
                      <option value="default">Modern Dark</option>
                      <option value="light">Modern Light</option>
                      <option value="engineering">Engineering Dark</option>
                      <option value="blueprint">Blueprint</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="units" className="text-sm font-medium">Default Units</label>
                    <select id="units" className="w-full p-2 border rounded-md">
                      <option value="mm">Millimeters (mm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="m">Meters (m)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rendering" className="text-sm font-medium">Rendering Quality</label>
                    <select id="rendering" className="w-full p-2 border rounded-md">
                      <option value="standard">Standard</option>
                      <option value="high">High Definition</option>
                      <option value="performance">Performance Mode</option>
                    </select>
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={() => toast.success("Settings saved successfully!")}>
                    Save Changes
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Prompting</CardTitle>
            <CardDescription>Learn to craft effective prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <HoverCard>
                  <HoverCardTrigger className="cursor-help">
                    Write clear, detailed model descriptions
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm">
                      Example: "Design a 20-tooth spur gear with 10mm face width and 30mm pitch diameter"
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </li>
              <li>
                <HoverCard>
                  <HoverCardTrigger className="cursor-help">
                    Specify precise measurements and features
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm">
                      Example: "Add 6 equally spaced M5 holes on a 40mm bolt circle diameter"
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </li>
              <li>
                <HoverCard>
                  <HoverCardTrigger className="cursor-help">
                    Use technical terminology effectively
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm">
                      Example: "Create a boss-extrude feature 15mm high with 5° draft angle"
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </li>
            </ul>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => toast.info("Prompt library loaded", {
                description: "Browse example prompts for common CAD operations"
              })}
            >
              <Code className="mr-2 h-4 w-4" />
              View Prompt Library
            </Button>
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
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Open Debug Console
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Debug Console</DrawerTitle>
                  <DrawerDescription>
                    Troubleshoot issues with your models and simulations
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="bg-black text-green-500 p-4 rounded-md font-mono text-sm h-40 overflow-y-auto">
                    <div>{"[INFO] CAD system initialized successfully"}</div>
                    <div>{"[INFO] Simulation engine ready"}</div>
                    <div>{"[INFO] DFMA module loaded"}</div>
                    <div>{"[INFO] Model renderer initialized"}</div>
                    <div>{"[WARNING] High polygon count may affect performance"}</div>
                    <div>{"[INFO] Ready to accept model generation commands"}</div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium">Ask for help</label>
                    <div className="flex mt-2">
                      <input 
                        type="text"
                        placeholder="Describe your issue..."
                        className="flex-1 p-2 border rounded-l-md"
                      />
                      <Button className="rounded-l-none">Get Help</Button>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGithubConnect}
                disabled={githubConnecting}
              >
                {githubConnecting ? (
                  <>
                    <svg 
                      className="mr-2 h-4 w-4 animate-spin" 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    Connect to GitHub
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsNext;
