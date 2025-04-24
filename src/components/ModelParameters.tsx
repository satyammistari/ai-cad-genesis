
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useModelContext } from "@/context/ModelContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModelParameters = () => {
  const { 
    modelType, 
    setModelType,
    parameters, 
    updateParameter, 
    material, 
    setMaterial,
    renderQuality,
    setRenderQuality
  } = useModelContext();

  const handleExport = () => {
    toast.success("Model exported successfully", {
      description: `${modelType.charAt(0).toUpperCase() + modelType.slice(1)} exported in selected format`
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg">Model Parameters</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-3 mb-4">
          <Label htmlFor="model-type">Model Type</Label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger id="model-type">
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spur-gear">Spur Gear</SelectItem>
              <SelectItem value="flanged-coupling">Flanged Coupling</SelectItem>
              <SelectItem value="mounting-bracket">Mounting Bracket</SelectItem>
              <SelectItem value="heat-sink">Heat Sink</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="geometry">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="geometry">Geometry</TabsTrigger>
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geometry" className="space-y-4">
            {modelType === 'spur-gear' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="diameter">Pitch Diameter (mm)</Label>
                    <span className="text-sm font-medium">{parameters.diameter}mm</span>
                  </div>
                  <Slider
                    id="diameter"
                    min={10}
                    max={100}
                    step={1}
                    value={parameters.diameter}
                    onValueChange={(value) => updateParameter('diameter', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="face-width">Face Width (mm)</Label>
                    <span className="text-sm font-medium">{parameters.faceWidth}mm</span>
                  </div>
                  <Slider
                    id="face-width"
                    min={5}
                    max={30}
                    step={1}
                    value={parameters.faceWidth}
                    onValueChange={(value) => updateParameter('faceWidth', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="teeth">Number of Teeth</Label>
                    <span className="text-sm font-medium">{parameters.teeth}</span>
                  </div>
                  <Slider
                    id="teeth"
                    min={8}
                    max={50}
                    step={1}
                    value={parameters.teeth}
                    onValueChange={(value) => updateParameter('teeth', value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="holes-switch">Center Holes</Label>
                  <Switch 
                    id="holes-switch"
                    checked={parameters.showHoles}
                    onCheckedChange={(value) => updateParameter('showHoles', value)}
                  />
                </div>
                
                {parameters.showHoles && (
                  <div className="space-y-2 pl-4 border-l-2 border-l-accent mt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hole-count">Hole Count</Label>
                      <span className="text-sm font-medium">{parameters.holeCount}</span>
                    </div>
                    <Slider
                      id="hole-count"
                      min={1}
                      max={12}
                      step={1}
                      value={parameters.holeCount}
                      onValueChange={(value) => updateParameter('holeCount', value)}
                      disabled={!parameters.showHoles}
                    />
                  </div>
                )}
              </>
            )}
            
            {modelType === 'flanged-coupling' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="diameter">Flange Diameter (mm)</Label>
                    <span className="text-sm font-medium">{parameters.diameter}mm</span>
                  </div>
                  <Slider
                    id="diameter"
                    min={20}
                    max={120}
                    step={1}
                    value={parameters.diameter}
                    onValueChange={(value) => updateParameter('diameter', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="face-width">Thickness (mm)</Label>
                    <span className="text-sm font-medium">{parameters.faceWidth}mm</span>
                  </div>
                  <Slider
                    id="face-width"
                    min={5}
                    max={30}
                    step={1}
                    value={parameters.faceWidth}
                    onValueChange={(value) => updateParameter('faceWidth', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bolt-circle">Bolt Circle Diameter (mm)</Label>
                    <span className="text-sm font-medium">{parameters.boltCircleDiameter}mm</span>
                  </div>
                  <Slider
                    id="bolt-circle"
                    min={10}
                    max={100}
                    step={1}
                    value={parameters.boltCircleDiameter || [30]}
                    onValueChange={(value) => updateParameter('boltCircleDiameter', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hole-count">Number of Bolt Holes</Label>
                    <span className="text-sm font-medium">{parameters.holeCount}</span>
                  </div>
                  <Slider
                    id="hole-count"
                    min={0}
                    max={12}
                    step={1}
                    value={parameters.holeCount}
                    onValueChange={(value) => updateParameter('holeCount', value)}
                  />
                </div>
              </>
            )}
            
            {modelType === 'mounting-bracket' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="width">Width (mm)</Label>
                    <span className="text-sm font-medium">{parameters.width}mm</span>
                  </div>
                  <Slider
                    id="width"
                    min={20}
                    max={100}
                    step={1}
                    value={parameters.width || [50]}
                    onValueChange={(value) => updateParameter('width', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="height">Height (mm)</Label>
                    <span className="text-sm font-medium">{parameters.height}mm</span>
                  </div>
                  <Slider
                    id="height"
                    min={20}
                    max={100}
                    step={1}
                    value={parameters.height || [40]}
                    onValueChange={(value) => updateParameter('height', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="thickness">Thickness (mm)</Label>
                    <span className="text-sm font-medium">{parameters.thickness}mm</span>
                  </div>
                  <Slider
                    id="thickness"
                    min={2}
                    max={15}
                    step={0.5}
                    value={parameters.thickness || [5]}
                    onValueChange={(value) => updateParameter('thickness', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hole-count">Mounting Holes</Label>
                    <span className="text-sm font-medium">{parameters.holeCount}</span>
                  </div>
                  <Slider
                    id="hole-count"
                    min={0}
                    max={8}
                    step={1}
                    value={parameters.holeCount}
                    onValueChange={(value) => updateParameter('holeCount', value)}
                  />
                </div>
              </>
            )}
            
            {modelType === 'heat-sink' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="width">Base Width (mm)</Label>
                    <span className="text-sm font-medium">{parameters.width}mm</span>
                  </div>
                  <Slider
                    id="width"
                    min={30}
                    max={120}
                    step={1}
                    value={parameters.width || [60]}
                    onValueChange={(value) => updateParameter('width', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="length">Base Length (mm)</Label>
                    <span className="text-sm font-medium">{parameters.length}mm</span>
                  </div>
                  <Slider
                    id="length"
                    min={30}
                    max={120}
                    step={1}
                    value={parameters.length || [60]}
                    onValueChange={(value) => updateParameter('length', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="base-height">Base Height (mm)</Label>
                    <span className="text-sm font-medium">{parameters.baseHeight}mm</span>
                  </div>
                  <Slider
                    id="base-height"
                    min={2}
                    max={15}
                    step={0.5}
                    value={parameters.baseHeight || [5]}
                    onValueChange={(value) => updateParameter('baseHeight', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fin-count">Number of Fins</Label>
                    <span className="text-sm font-medium">{parameters.finCount}</span>
                  </div>
                  <Slider
                    id="fin-count"
                    min={0}
                    max={24}
                    step={1}
                    value={parameters.finCount || [12]}
                    onValueChange={(value) => updateParameter('finCount', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fin-height">Fin Height (mm)</Label>
                    <span className="text-sm font-medium">{parameters.finHeight}mm</span>
                  </div>
                  <Slider
                    id="fin-height"
                    min={5}
                    max={40}
                    step={1}
                    value={parameters.finHeight || [15]}
                    onValueChange={(value) => updateParameter('finHeight', value)}
                  />
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="material" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material Type</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="aluminum">Aluminum</SelectItem>
                  <SelectItem value="plastic">Plastic (ABS)</SelectItem>
                  <SelectItem value="titanium">Titanium</SelectItem>
                  <SelectItem value="brass">Brass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="density">Density (g/cm³)</Label>
              <Input 
                id="density" 
                type="number" 
                value={material === "steel" ? "7.85" : 
                       material === "aluminum" ? "2.71" : 
                       material === "plastic" ? "1.07" : 
                       material === "titanium" ? "4.51" : "8.73"} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yield-strength">Yield Strength (MPa)</Label>
              <Input 
                id="yield-strength" 
                type="number" 
                value={material === "steel" ? "250" : 
                       material === "aluminum" ? "95" : 
                       material === "plastic" ? "40" : 
                       material === "titanium" ? "880" : "310"} 
                disabled 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="render-quality">Render Quality</Label>
              <Select value={renderQuality} onValueChange={setRenderQuality}>
                <SelectTrigger id="render-quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select defaultValue="step">
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="step">STEP (.step)</SelectItem>
                  <SelectItem value="stl">STL (.stl)</SelectItem>
                  <SelectItem value="obj">OBJ (.obj)</SelectItem>
                  <SelectItem value="iges">IGES (.iges)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button className="w-full" onClick={handleExport}>
                Export Model
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelParameters;
