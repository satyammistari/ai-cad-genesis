
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptInput = ({ onGenerate, isGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    onGenerate(prompt);
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
      
      <div className="text-xs text-muted-foreground">
        Try: "Create a valve body with 1/2 inch inlet" or "Design a mounting bracket with 4 holes"
      </div>
    </form>
  );
};

export default PromptInput;
