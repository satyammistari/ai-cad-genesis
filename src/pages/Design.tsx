import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CADCanvas from "@/components/CADCanvas";
import ModelParameters from "@/components/ModelParameters";
import DFMAPanel from "@/components/DFMAPanel";
import SimulationPanel from "@/components/SimulationPanel";
import AIPromptGenerator from "@/components/AIPromptGenerator";
import { ModelProvider, useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import {
  Save,
  Share,
  Users,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DesignContent = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const { toast } = useToast();
  const { modelType, setModelType, designHistory, isGenerating } = useModelContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (templateId) {
      setIsLoading(true);
      setTimeout(() => {
        switch (templateId) {
          case "spur-gear-standard":
            setModelType("spur-gear");
            break;
          case "helical-gear":
            setModelType("helical-gear");
            break;
          case "flanged-coupling-basic":
            setModelType("flanged-coupling");
            break;
          case "l-bracket":
            setModelType("mounting-bracket");
            break;
          case "finned-heatsink":
            setModelType("heat-sink");
            break;
          default:
            // Keep current model type
        }
        setIsLoading(false);
        
        toast({
          title: "Template loaded",
          description: `Template ${templateId} has been loaded successfully.`,
        });
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [templateId, setModelType, toast]);

  const handleSave = () => {
    toast({
      title: "Model saved",
      description: "Your model has been saved to your account.",
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/design?shared=true&model=${modelType}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Exporting model",
      description: `Exporting as ${format}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your model has been exported as ${format}.`,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h1 className="text-2xl font-bold">{modelType ? modelType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'New Design'}</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/collaboration">
                <Users className="mr-2 h-4 w-4" />
                Collaborate
              </a>
            </Button>
          </div>
        </div>
        
        <AIPromptGenerator />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="dfma">DFMA</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parameters" className="space-y-4">
                <ModelParameters />
              </TabsContent>
              
              <TabsContent value="dfma" className="space-y-4">
                <DFMAPanel />
              </TabsContent>
              
              <TabsContent value="export" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      onClick={() => handleExport("STEP")} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export as STEP
                    </Button>
                    <Button 
                      onClick={() => handleExport("STL")} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export as STL
                    </Button>
                    <Button 
                      onClick={() => handleExport("DWG")} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export Drawing (DWG)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-2 h-[600px] md:h-[700px] relative">
            {isLoading || isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p>{isLoading ? "Loading template..." : "Generating model from prompt..."}</p>
                </div>
              </div>
            ) : (
              <CADCanvas isGenerating={false} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simulation">Simulation</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simulation" className="space-y-4">
                <SimulationPanel />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Design History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                    {designHistory.slice().reverse().map((entry, index) => (
                      <div 
                        key={index} 
                        className={`border-l-2 ${index === 0 ? 'border-primary' : 'border-gray-200 dark:border-gray-700'} pl-4 py-1`}
                      >
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-gray-500">{entry.timestamp.toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
        AI-CAD Genesis &copy; {new Date().getFullYear()} - Powered by AI
      </footer>
    </div>
  );
};

const DesignPage = () => {
  return (
    <ModelProvider>
      <DesignContent />
    </ModelProvider>
  );
};

export default DesignPage;
