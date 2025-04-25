
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CADCanvas from "@/components/CADCanvas";
import PromptInput from "@/components/PromptInput";
import ModelParameters from "@/components/ModelParameters";
import DFMAPanel from "@/components/DFMAPanel";
import SimulationPanel from "@/components/SimulationPanel";
import WhatsNext from "@/components/WhatsNext";
import ProjectKnowledge from "@/components/ProjectKnowledge";
import { ModelProvider, useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";

const MainContent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const { setModelType } = useModelContext();

  const generateModel = async (prompt: string) => {
    setIsGenerating(true);
    setLastPrompt(prompt);
    
    // Simulate API call to AI model generation service
    try {
      // In a real implementation, this would be an API call to a backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Model generated successfully", {
        description: "Your CAD model is ready to view and modify"
      });
    } catch (error) {
      toast.error("Failed to generate model", {
        description: "Please try again with a different prompt"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Quick Access Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button asChild variant="outline">
            <Link to="/templates">
              <FileText className="mr-2 h-4 w-4" />
              Browse Templates
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/collaboration">
              <Users className="mr-2 h-4 w-4" />
              Collaboration Projects
            </Link>
          </Button>
        </div>
        
        {/* Prompt Input Section */}
        <div className="mb-6">
          <PromptInput onGenerate={generateModel} isGenerating={isGenerating} />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 3D Viewer - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 h-[500px] md:h-[600px]">
            <CADCanvas isGenerating={isGenerating} />
          </div>
          
          {/* Sidebar panels - Takes up 1 column */}
          <div className="space-y-6">
            <ModelParameters />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <DFMAPanel />
              <SimulationPanel />
            </div>
          </div>
        </div>
        
        {/* What's Next Section */}
        <WhatsNext />
        
        {/* Project Knowledge Section */}
        <ProjectKnowledge />
        
        {/* Status section at the bottom */}
        {lastPrompt && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-1">Last Prompt:</h3>
            <p className="text-sm text-muted-foreground">"{lastPrompt}"</p>
          </div>
        )}
      </main>
      
      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
        AI-CAD Genesis &copy; {new Date().getFullYear()} - Powered by AI
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ModelProvider>
      <MainContent />
    </ModelProvider>
  );
};

export default Index;
