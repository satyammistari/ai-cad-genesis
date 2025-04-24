
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SimulationPanel = () => {
  const runSimulation = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Running simulation...",
        success: "Simulation complete",
        error: "Simulation failed",
      }
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg">Simulation</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <Tabs defaultValue="stress">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="thermal">Thermal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stress" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="load">Applied Load (N)</Label>
              <Input id="load" type="number" defaultValue="1000" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraint">Constraint Location</Label>
              <Select defaultValue="left-face">
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
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <Slider
                id="mesh-density"
                min={1}
                max={3}
                step={1}
                defaultValue={[2]}
              />
            </div>
            
            <Button className="w-full mt-2" onClick={runSimulation}>
              Run Stress Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="flow" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inlet-velocity">Inlet Velocity (m/s)</Label>
              <Input id="inlet-velocity" type="number" defaultValue="5" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fluid-type">Fluid Type</Label>
              <Select defaultValue="water">
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
              <Select defaultValue="k-epsilon">
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
            
            <Button className="w-full mt-2" onClick={runSimulation}>
              Run Flow Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="thermal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ambient-temp">Ambient Temperature (°C)</Label>
              <Input id="ambient-temp" type="number" defaultValue="25" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heat-source">Heat Source</Label>
              <Select defaultValue="surface">
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
              <Input id="heat-flux" type="number" defaultValue="1000" />
            </div>
            
            <Button className="w-full mt-2" onClick={runSimulation}>
              Run Thermal Analysis
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
