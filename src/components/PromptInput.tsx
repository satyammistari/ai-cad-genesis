
import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Code, Lightbulb } from "lucide-react";
import { useModelContext } from "@/context/ModelContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptInput = ({ onGenerate, isGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const { setModelType, updateParameter } = useModelContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    // Process prompt to extract model information
    processPrompt(prompt);
    
    // Pass to parent for generating
    onGenerate(prompt);
  };

  // Basic prompt processing to adjust model parameters based on input
  const processPrompt = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Detect model type
    if (lowerInput.includes("gear") || lowerInput.includes("tooth") || lowerInput.includes("teeth")) {
      setModelType("spur-gear");
      
      // Extract teeth count if mentioned
      const teethMatch = lowerInput.match(/(\d+)[\s-]*(tooth|teeth)/);
      if (teethMatch && teethMatch[1]) {
        updateParameter("teeth", [parseInt(teethMatch[1])]);
      }
      
      // Extract diameter if mentioned (in mm)
      const diameterMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(diameter)/);
      if (diameterMatch && diameterMatch[1]) {
        updateParameter("diameter", [parseInt(diameterMatch[1])]);
      }
      
      // Extract face width if mentioned
      const faceWidthMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(face width|width)/);
      if (faceWidthMatch && faceWidthMatch[1]) {
        updateParameter("faceWidth", [parseInt(faceWidthMatch[1])]);
      }
    } 
    else if (lowerInput.includes("coupling") || lowerInput.includes("flange")) {
      setModelType("flanged-coupling");
      
      // Extract diameter if mentioned
      const diameterMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(diameter)/);
      if (diameterMatch && diameterMatch[1]) {
        updateParameter("diameter", [parseInt(diameterMatch[1])]);
      }
      
      // Extract bolt hole count if mentioned
      const holeMatch = lowerInput.match(/(\d+)[\s-]*(bolt|hole|holes)/);
      if (holeMatch && holeMatch[1]) {
        updateParameter("holeCount", [parseInt(holeMatch[1])]);
      }
    }
    else if (lowerInput.includes("bracket") || lowerInput.includes("mount")) {
      setModelType("mounting-bracket");
      
      // Extract width if mentioned
      const widthMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(width|wide)/);
      if (widthMatch && widthMatch[1]) {
        updateParameter("width", [parseInt(widthMatch[1])]);
      }
      
      // Extract height if mentioned
      const heightMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(height|high)/);
      if (heightMatch && heightMatch[1]) {
        updateParameter("height", [parseInt(heightMatch[1])]);
      }
      
      // Extract hole count if mentioned
      const holeMatch = lowerInput.match(/(\d+)[\s-]*(hole|holes)/);
      if (holeMatch && holeMatch[1]) {
        updateParameter("holeCount", [parseInt(holeMatch[1])]);
      }
    }
    else if (lowerInput.includes("heat sink") || lowerInput.includes("heatsink") || lowerInput.includes("cooler")) {
      setModelType("heat-sink");
      
      // Extract fin count if mentioned
      const finMatch = lowerInput.match(/(\d+)[\s-]*(fin|fins)/);
      if (finMatch && finMatch[1]) {
        updateParameter("finCount", [parseInt(finMatch[1])]);
      }
      
      // Extract base dimensions if mentioned
      const baseMatch = lowerInput.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(base)/);
      if (baseMatch && baseMatch[1]) {
        updateParameter("baseHeight", [parseInt(baseMatch[1])]);
      }
    }
  };

  const promptExamples = [
    "Design a 20-tooth spur gear with 10mm face width",
    "Create a flanged coupling with 6 bolt holes on a 60mm bolt circle",
    "Design a mounting bracket with 4 holes and 50mm width",
    "Model a heat sink with 12 fins and 5mm base",
    "Create a 30mm diameter gear with 24 teeth"
  ];

  const insertExample = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-2 w-full animate-fade-in"
    >
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
                  <li>Add material preferences when needed</li>
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
  );
};

export default PromptInput;
