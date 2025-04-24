
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Code } from "lucide-react";
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    onGenerate(prompt);
  };

  const promptExamples = [
    "Design a 20-tooth spur gear with 10mm face width",
    "Create a valve body with 1/2 inch inlet",
    "Design a mounting bracket with 4 holes",
    "Model a heat sink with 12 fins and 5mm base",
    "Create a flange with 6 bolt holes on a 60mm bolt circle"
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
        <div className="text-xs text-muted-foreground">
          <HoverCard>
            <HoverCardTrigger className="underline cursor-help">Prompt tips</HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Effective CAD Prompts</h4>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>Be specific about dimensions (mm, inches)</li>
                  <li>Mention quantity of features (holes, fillets)</li>
                  <li>Specify materials when relevant</li>
                  <li>Include surface finishes if needed</li>
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
