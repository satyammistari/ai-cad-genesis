
import { createContext, useContext, useState, ReactNode } from "react";

interface ModelParameters {
  diameter: number[];
  faceWidth: number[];
  teeth: number[];
  holeCount: number[];
  showHoles: boolean;
  // Additional parameters for different model types
  width?: number[];
  height?: number[];
  length?: number[];
  thickness?: number[];
  baseHeight?: number[];
  finCount?: number[];
  finHeight?: number[];
  boltCircleDiameter?: number[];
}

interface SimulationResult {
  type: 'stress' | 'flow' | 'thermal' | null;
  value?: number;
  distribution?: any;
}

interface ModelContextType {
  modelType: string;
  setModelType: (type: string) => void;
  parameters: ModelParameters;
  updateParameter: (name: string, value: any) => void;
  material: string;
  setMaterial: (material: string) => void;
  renderQuality: string;
  setRenderQuality: (quality: string) => void;
  simulationResults: SimulationResult | null;
  runSimulation: (type: string, settings: any) => void;
  // New AI generation methods
  generateFromPrompt: (prompt: string) => Promise<boolean>;
  isGenerating: boolean;
  lastPrompt: string;
  designHistory: Array<{action: string, timestamp: Date}>;
  // Helper methods to get single number values from arrays
  getParameterValue: (name: keyof ModelParameters) => number | boolean;
}

const defaultParameters: ModelParameters = {
  diameter: [30],
  faceWidth: [10],
  teeth: [20],
  holeCount: [6],
  showHoles: true,
  width: [50],
  height: [40],
  length: [60],
  thickness: [5],
  baseHeight: [5],
  finCount: [12],
  finHeight: [15],
  boltCircleDiameter: [30]
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [modelType, setModelType] = useState<string>('spur-gear');
  const [parameters, setParameters] = useState<ModelParameters>(defaultParameters);
  const [material, setMaterial] = useState<string>('steel');
  const [renderQuality, setRenderQuality] = useState<string>('standard');
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [designHistory, setDesignHistory] = useState<Array<{action: string, timestamp: Date}>>([
    {action: "Model Created", timestamp: new Date()}
  ]);

  const updateParameter = (name: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Add to design history
    setDesignHistory(prev => [...prev, {
      action: `Parameter ${name} updated to ${Array.isArray(value) ? value.join(', ') : value}`,
      timestamp: new Date()
    }]);
  };

  const getParameterValue = (name: keyof ModelParameters): number | boolean => {
    if (name === 'showHoles') return parameters.showHoles;
    
    const param = parameters[name];
    if (Array.isArray(param) && param.length > 0) {
      return param[0];
    }
    return 0; // Default fallback value
  };

  const runSimulation = (type: string, settings: any) => {
    // Simulate a backend service call
    console.log(`Running ${type} simulation with settings:`, settings);
    
    // Add to design history
    setDesignHistory(prev => [...prev, {
      action: `${type} simulation started`,
      timestamp: new Date()
    }]);
    
    // Simulate delay for realistic feedback
    setTimeout(() => {
      setSimulationResults({
        type: type as 'stress' | 'flow' | 'thermal',
        value: Math.random() * 100, // Placeholder for actual result value
        distribution: {} // Would contain detailed distribution data in a real app
      });
      
      // Add completion to history
      setDesignHistory(prev => [...prev, {
        action: `${type} simulation completed`,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  // New method to process AI generation from prompt
  const generateFromPrompt = async (prompt: string): Promise<boolean> => {
    try {
      setIsGenerating(true);
      setLastPrompt(prompt);
      
      // Add to design history
      setDesignHistory(prev => [...prev, {
        action: `Model generation started from prompt: "${prompt}"`,
        timestamp: new Date()
      }]);

      // Process the prompt to extract parameters and model type
      // This would be a more sophisticated AI call in a real implementation
      console.log("Processing prompt for AI generation:", prompt);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract potential model type from prompt
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('gear') || lowerPrompt.includes('tooth') || lowerPrompt.includes('teeth')) {
        setModelType('spur-gear');
        
        // Extract teeth count if mentioned
        const teethMatch = lowerPrompt.match(/(\d+)[\s-]*(tooth|teeth)/);
        if (teethMatch && teethMatch[1]) {
          updateParameter('teeth', [parseInt(teethMatch[1])]);
        }
        
        // Extract diameter if mentioned
        const diameterMatch = lowerPrompt.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(diameter)/);
        if (diameterMatch && diameterMatch[1]) {
          updateParameter('diameter', [parseInt(diameterMatch[1])]);
        }
      } 
      else if (lowerPrompt.includes('coupling') || lowerPrompt.includes('flange')) {
        setModelType('flanged-coupling');
        
        // Extract diameter if mentioned
        const diameterMatch = lowerPrompt.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(diameter)/);
        if (diameterMatch && diameterMatch[1]) {
          updateParameter('diameter', [parseInt(diameterMatch[1])]);
        }
      }
      else if (lowerPrompt.includes('bracket') || lowerPrompt.includes('mount')) {
        setModelType('mounting-bracket');
        
        // Extract dimensions if mentioned
        const widthMatch = lowerPrompt.match(/(\d+)[\s-]*(mm|millimeter|millimeters)?[\s-]*(width|wide)/);
        if (widthMatch && widthMatch[1]) {
          updateParameter('width', [parseInt(widthMatch[1])]);
        }
      }
      else if (lowerPrompt.includes('heat sink') || lowerPrompt.includes('heatsink')) {
        setModelType('heat-sink');
        
        // Extract fin count if mentioned
        const finMatch = lowerPrompt.match(/(\d+)[\s-]*(fin|fins)/);
        if (finMatch && finMatch[1]) {
          updateParameter('finCount', [parseInt(finMatch[1])]);
        }
      }
      else if (lowerPrompt.includes('gearbox') || lowerPrompt.includes('assembly')) {
        // For complex assemblies
        setModelType('gearbox-assembly');
        
        // Extract info about multiple parts
        const gearMatch = lowerPrompt.match(/(\d+)[\s-]*(gear|gears)/);
        if (gearMatch && gearMatch[1]) {
          // This would trigger more complex assembly generation
          console.log(`Assembly with ${gearMatch[1]} gears requested`);
        }
      }
      
      // Add material detection
      if (lowerPrompt.includes('aluminum') || lowerPrompt.includes('aluminium')) {
        setMaterial('aluminum');
      } else if (lowerPrompt.includes('steel')) {
        setMaterial('steel');
      } else if (lowerPrompt.includes('plastic')) {
        setMaterial('plastic');
      } else if (lowerPrompt.includes('titanium')) {
        setMaterial('titanium');
      } else if (lowerPrompt.includes('brass')) {
        setMaterial('brass');
      }
      
      // Add to design history
      setDesignHistory(prev => [...prev, {
        action: `Model generated from prompt: "${prompt}"`,
        timestamp: new Date()
      }]);

      return true;
    } catch (error) {
      console.error("Error generating from prompt:", error);
      
      // Add error to design history
      setDesignHistory(prev => [...prev, {
        action: `Error generating model: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      }]);

      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const value = {
    modelType,
    setModelType,
    parameters,
    updateParameter,
    material,
    setMaterial,
    renderQuality,
    setRenderQuality,
    simulationResults,
    runSimulation,
    getParameterValue,
    // New AI methods
    generateFromPrompt,
    isGenerating,
    lastPrompt,
    designHistory
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};
