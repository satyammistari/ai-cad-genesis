
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModelParameters = () => {
  const [diameter, setDiameter] = useState<number[]>([30]);
  const [faceWidth, setFaceWidth] = useState<number[]>([10]);
  const [teeth, setTeeth] = useState<number[]>([20]);
  const [material, setMaterial] = useState("steel");
  const [renderQuality, setRenderQuality] = useState("standard");
  const [showHoles, setShowHoles] = useState(true);
  const [holeCount, setHoleCount] = useState<number[]>([6]);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg">Model Parameters</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <Tabs defaultValue="geometry">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="geometry">Geometry</TabsTrigger>
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="geometry" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="diameter">Pitch Diameter (mm)</Label>
                <span className="text-sm font-medium">{diameter}mm</span>
              </div>
              <Slider
                id="diameter"
                min={10}
                max={100}
                step={1}
                value={diameter}
                onValueChange={setDiameter}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="face-width">Face Width (mm)</Label>
                <span className="text-sm font-medium">{faceWidth}mm</span>
              </div>
              <Slider
                id="face-width"
                min={5}
                max={30}
                step={1}
                value={faceWidth}
                onValueChange={setFaceWidth}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="teeth">Number of Teeth</Label>
                <span className="text-sm font-medium">{teeth}</span>
              </div>
              <Slider
                id="teeth"
                min={8}
                max={50}
                step={1}
                value={teeth}
                onValueChange={setTeeth}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="holes-switch">Center Holes</Label>
              <Switch 
                id="holes-switch"
                checked={showHoles}
                onCheckedChange={setShowHoles}
              />
            </div>
            
            {showHoles && (
              <div className="space-y-2 pl-4 border-l-2 border-l-accent mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hole-count">Hole Count</Label>
                  <span className="text-sm font-medium">{holeCount}</span>
                </div>
                <Slider
                  id="hole-count"
                  min={1}
                  max={12}
                  step={1}
                  value={holeCount}
                  onValueChange={setHoleCount}
                  disabled={!showHoles}
                />
              </div>
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
              <Button className="w-full">
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
