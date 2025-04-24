
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useModelContext } from "@/context/ModelContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SimulationPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("stress");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Stress analysis settings
  const [load, setLoad] = useState<string>("1000");
  const [constraint, setConstraint] = useState<string>("left-face");
  const [meshDensity, setMeshDensity] = useState<number[]>([2]);
  
  // Flow analysis settings
  const [inletVelocity, setInletVelocity] = useState<string>("5");
  const [fluidType, setFluidType] = useState<string>("water");
  const [turbulenceModel, setTurbulenceModel] = useState<string>("k-epsilon");
  
  // Thermal analysis settings
  const [ambientTemp, setAmbientTemp] = useState<string>("25");
  const [heatSource, setHeatSource] = useState<string>("surface");
  const [heatFlux, setHeatFlux] = useState<string>("1000");
  
  const { runSimulation, simulationResults } = useModelContext();

  const handleRunSimulation = () => {
    setIsRunning(true);
    
    let settings = {};
    
    switch (activeTab) {
      case "stress":
        settings = {
          load: parseFloat(load),
          constraint,
          meshDensity: meshDensity[0]
        };
        break;
      case "flow":
        settings = {
          inletVelocity: parseFloat(inletVelocity),
          fluidType,
          turbulenceModel
        };
        break;
      case "thermal":
        settings = {
          ambientTemp: parseFloat(ambientTemp),
          heatSource,
          heatFlux: parseFloat(heatFlux)
        };
        break;
    }
    
    // Simulate running the analysis
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          runSimulation(activeTab, settings);
          setIsRunning(false);
          resolve();
        }, 1500);
      }),
      {
        loading: "Running simulation...",
        success: "Simulation complete",
        error: "Simulation failed",
      }
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Simulation</CardTitle>
        {simulationResults && (
          <Badge variant={simulationResults.type === 'stress' ? 'destructive' : 
                          simulationResults.type === 'flow' ? 'secondary' : 
                          simulationResults.type === 'thermal' ? 'outline' : 'default'}>
            {simulationResults.type.charAt(0).toUpperCase() + simulationResults.type.slice(1)} Active
          </Badge>
        )}
      </CardHeader>
      <CardContent className="px-4">
        <Tabs defaultValue="stress" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="thermal">Thermal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stress" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="load">Applied Load (N)</Label>
              <Input 
                id="load" 
                type="number" 
                value={load}
                onChange={(e) => setLoad(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraint">Constraint Location</Label>
              <Select value={constraint} onValueChange={setConstraint}>
                <SelectTrigger id="constraint">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left-face">Left Face</SelectItem>
                  <SelectItem value="right-face">Right Face</SelectItem>
                  <SelectItem value="center-bore">Center Bore</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mesh-density">Mesh Density</Label>
                <span className="text-xs text-muted-foreground">
                  {meshDensity[0] === 1 ? "Low" : meshDensity[0] === 2 ? "Medium" : "High"}
                </span>
              </div>
              <Slider
                id="mesh-density"
                min={1}
                max={3}
                step={1}
                value={meshDensity}
                onValueChange={setMeshDensity}
              />
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              {isRunning ? (
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
                  Running...
                </>
              ) : (
                "Run Stress Analysis"
              )}
            </Button>
            
            {simulationResults && simulationResults.type === 'stress' && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2">
                <h4 className="font-medium text-sm">Analysis Results:</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Max Stress:</span>
                    <span className="font-medium">{(simulationResults.value || 0).toFixed(2)} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Factor:</span>
                    <span className="font-medium">{(250 / (simulationResults.value || 1)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="flow" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inlet-velocity">Inlet Velocity (m/s)</Label>
              <Input 
                id="inlet-velocity" 
                type="number" 
                value={inletVelocity}
                onChange={(e) => setInletVelocity(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fluid-type">Fluid Type</Label>
              <Select value={fluidType} onValueChange={setFluidType}>
                <SelectTrigger id="fluid-type">
                  <SelectValue placeholder="Select fluid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="custom">Custom Fluid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="turbulence-model">Turbulence Model</Label>
              </div>
              <Select value={turbulenceModel} onValueChange={setTurbulenceModel}>
                <SelectTrigger id="turbulence-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="k-epsilon">k-epsilon</SelectItem>
                  <SelectItem value="k-omega">k-omega</SelectItem>
                  <SelectItem value="sst">SST</SelectItem>
                  <SelectItem value="laminar">Laminar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run Flow Analysis"}
            </Button>
            
            {simulationResults && simulationResults.type === 'flow' && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2">
                <h4 className="font-medium text-sm">Flow Results:</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Max Velocity:</span>
                    <span className="font-medium">{(simulationResults.value || 0).toFixed(2)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure Drop:</span>
                    <span className="font-medium">{((simulationResults.value || 0) * 0.2).toFixed(2)} kPa</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="thermal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ambient-temp">Ambient Temperature (°C)</Label>
              <Input 
                id="ambient-temp" 
                type="number"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heat-source">Heat Source</Label>
              <Select value={heatSource} onValueChange={setHeatSource}>
                <SelectTrigger id="heat-source">
                  <SelectValue placeholder="Select heat source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">Surface Heat</SelectItem>
                  <SelectItem value="volumetric">Volumetric Heat</SelectItem>
                  <SelectItem value="point">Point Sources</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heat-flux">Heat Flux (W/m²)</Label>
              <Input 
                id="heat-flux" 
                type="number"
                value={heatFlux}
                onChange={(e) => setHeatFlux(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={handleRunSimulation}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run Thermal Analysis"}
            </Button>
            
            {simulationResults && simulationResults.type === 'thermal' && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2">
                <h4 className="font-medium text-sm">Thermal Results:</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Max Temperature:</span>
                    <span className="font-medium">
                      {(parseFloat(ambientTemp) + (simulationResults.value || 0) / 2).toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heat Dissipation:</span>
                    <span className="font-medium">
                      {((simulationResults.value || 0) * 3.5).toFixed(1)} W
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
