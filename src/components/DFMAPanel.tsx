
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const DFMAPanel = () => {
  const fixIssue = (issue: string) => {
    toast.success(`Fixed: ${issue}`, {
      description: "Model has been optimized automatically",
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">DFMA Analysis</CardTitle>
          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
            4 suggestions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0">
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Draft Angle Required
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs"
                onClick={() => fixIssue("Added 2° draft angle for injection molding")}
              >
                Fix
              </Button>
            </div>
            <p className="text-muted-foreground text-xs ml-5">
              Vertical walls need at least 2° draft angle for injection molding
            </p>
            <Separator className="my-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Thin Wall
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs"
                onClick={() => fixIssue("Increased wall thickness from 0.8mm to 1.5mm")}
              >
                Fix
              </Button>
            </div>
            <p className="text-muted-foreground text-xs ml-5">
              Wall thickness (0.8mm) is below minimum for selected material (1.2mm)
            </p>
            <Separator className="my-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="16" />
                </svg>
                Undercut
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs"
                onClick={() => fixIssue("Redesigned to eliminate undercut")}
              >
                Fix
              </Button>
            </div>
            <p className="text-muted-foreground text-xs ml-5">
              Undercut detected on inner gear teeth. Will require complex tooling.
            </p>
            <Separator className="my-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="16" y2="12" />
                  <line x1="12" x2="12.01" y1="8" y2="8" />
                </svg>
                Non-Standard Feature
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs"
                onClick={() => fixIssue("Changed to standard ISO keyway")}
              >
                Fix
              </Button>
            </div>
            <p className="text-muted-foreground text-xs ml-5">
              Custom keyway can be replaced with standard ISO keyway
            </p>
          </div>
        </div>
        
        <div className="pt-4 pb-2">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              toast.success("All issues fixed", {
                description: "Model has been optimized for manufacturing"
              });
            }}
          >
            Apply All Fixes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DFMAPanel;
