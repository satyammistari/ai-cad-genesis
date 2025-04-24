
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

  const updateParameter = (name: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const runSimulation = (type: string, settings: any) => {
    // Simulate a backend service call
    console.log(`Running ${type} simulation with settings:`, settings);
    
    // Simulate delay for realistic feedback
    setTimeout(() => {
      setSimulationResults({
        type: type as 'stress' | 'flow' | 'thermal',
        value: Math.random() * 100, // Placeholder for actual result value
        distribution: {} // Would contain detailed distribution data in a real app
      });
    }, 1500);
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
    runSimulation
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
