
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
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
import { FileText, Users, Layout, Sparkles } from "lucide-react";

const MainContent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const { setModelType } = useModelContext();
  const navigate = useNavigate();

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
      
      // Navigate to design page after successful generation
      setTimeout(() => {
        navigate('/design');
      }, 1000);
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
        {/* Hero section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              AI-Powered CAD
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design complex 3D models and assemblies with natural language. 
            No CAD experience required.
          </p>
        </div>
        
        {/* Quick Access Bar */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <Button asChild>
            <Link to="/design">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Designing
            </Link>
          </Button>
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
          <Button asChild variant="outline">
            <Link to="/design">
              <Layout className="mr-2 h-4 w-4" />
              Open Design Studio
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
        
        {/* Feature Highlights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">🧠 AI-Native Modeling</h3>
              <p className="text-sm text-muted-foreground">Generate complex 3D parts and assemblies from natural language descriptions with parametric controls.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">🖼️ Fully Editable Models</h3>
              <p className="text-sm text-muted-foreground">Modify parameters, apply features like fillets or chamfers, and see changes reflected instantly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">🧪 Built-in Simulation</h3>
              <p className="text-sm text-muted-foreground">Run stress, thermal, and flow analyses with AI-assisted setup of boundary conditions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">📦 Smart Assemblies</h3>
              <p className="text-sm text-muted-foreground">Auto-align parts, create constraints, and build complex mechanisms with intuitive controls.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">🧠 DFMA Support</h3>
              <p className="text-sm text-muted-foreground">Get AI feedback on manufacturability including draft angles, thin walls, and undercuts.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">📄 Auto Documentation</h3>
              <p className="text-sm text-muted-foreground">Generate technical drawings, BOMs, and export to industry-standard formats like STEP and STL.</p>
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
