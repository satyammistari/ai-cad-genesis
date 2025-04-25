
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lightbulb, Code } from "lucide-react";
import { useModelContext } from "@/context/ModelContext";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const AIPromptGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const { generateFromPrompt, isGenerating } = useModelContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    const success = await generateFromPrompt(prompt);
    
    if (success) {
      toast.success("Model generated successfully", {
        description: "Your CAD model has been created based on your prompt"
      });
      
      // Don't clear prompt, so user can see what they entered
    } else {
      toast.error("Failed to generate model", {
        description: "Please try again with a different prompt"
      });
    }
  };

  const promptExamples = [
    "Design a 20-tooth spur gear with 10mm face width",
    "Create a flanged coupling with 6 bolt holes on a 60mm bolt circle",
    "Design a mounting bracket with 4 holes and 50mm width",
    "Model a heat sink with 12 fins and 5mm base",
    "Generate a gearbox assembly with 3 gears (20, 30, and 40 teeth)"
  ];

  const insertExample = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  return (
    <div className="border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm mb-4">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-primary" />
        AI Model Generator
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full animate-fade-in">
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Describe your 3D model (e.g., 'Design a 20-tooth spur gear with 10mm face width')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isGenerating || !prompt.trim()}
            className="whitespace-nowrap"
          >
            {isGenerating ? (
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
                Generating...
              </>
            ) : (
              <>Generate Model</>
            )}
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center">
            <HoverCard>
              <HoverCardTrigger className="underline cursor-help flex items-center">
                <Lightbulb className="h-3 w-3 mr-1" />
                Prompt tips
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Effective CAD Prompts</h4>
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    <li>Specify the model type (gear, bracket, etc.)</li>
                    <li>Include dimensions with units (e.g., 30mm diameter)</li>
                    <li>Mention quantity of features (20 teeth, 6 holes)</li>
                    <li>Add material preferences (aluminum, steel, etc.)</li>
                    <li>Include functional descriptions for assemblies</li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center"
            onClick={() => setShowExamples(!showExamples)}
          >
            <Code className="h-3 w-3 mr-1" />
            {showExamples ? "Hide examples" : "Show examples"}
          </Button>
        </div>
        
        {showExamples && (
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md mt-1 border text-sm">
            <div className="font-medium text-xs mb-2">Example prompts:</div>
            <div className="space-y-2">
              {promptExamples.map((example, i) => (
                <div 
                  key={i} 
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
                  onClick={() => insertExample(example)}
                >
                  "{example}"
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AIPromptGenerator;
