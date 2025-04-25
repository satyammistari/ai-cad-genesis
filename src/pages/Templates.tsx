
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

type TemplateCategory = "gear" | "coupling" | "bracket" | "heatsink" | "enclosure" | "mechanical" | "all";
type Template = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory[];
  thumbnail: string;
  complexity: "basic" | "intermediate" | "advanced";
};

const TEMPLATES: Template[] = [
  {
    id: "spur-gear-standard",
    title: "Standard Spur Gear",
    description: "Basic spur gear with configurable teeth and dimensions",
    category: ["gear", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "basic"
  },
  {
    id: "helical-gear",
    title: "Helical Gear System",
    description: "Helical gear with adjustable helix angle and tooth profile",
    category: ["gear", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "intermediate"
  },
  {
    id: "flanged-coupling-basic",
    title: "Basic Flanged Coupling",
    description: "Simple flanged coupling with bolt pattern",
    category: ["coupling", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "basic"
  },
  {
    id: "l-bracket",
    title: "L-Bracket Mount",
    description: "Standard L-shaped mounting bracket with reinforcement",
    category: ["bracket", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "basic"
  },
  {
    id: "finned-heatsink",
    title: "Finned Heat Sink",
    description: "Aluminum heat sink with configurable fin count and dimensions",
    category: ["heatsink", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "intermediate"
  },
  {
    id: "electronic-enclosure",
    title: "Electronic Device Enclosure",
    description: "Parametric enclosure for electronic components",
    category: ["enclosure", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "advanced"
  },
  {
    id: "planetary-gear",
    title: "Planetary Gear System",
    description: "Complete planetary gear system with sun, planet and ring gears",
    category: ["gear", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "advanced"
  },
  {
    id: "quick-connect-coupling",
    title: "Quick-Connect Coupling",
    description: "Fluid coupling with quick-connect mechanism",
    category: ["coupling", "mechanical"],
    thumbnail: "placeholder.svg",
    complexity: "advanced"
  },
];

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category.includes(selectedCategory);
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { value: TemplateCategory; label: string }[] = [
    { value: "all", label: "All Templates" },
    { value: "gear", label: "Gears" },
    { value: "coupling", label: "Couplings" },
    { value: "bracket", label: "Brackets & Mounts" },
    { value: "heatsink", label: "Heat Sinks" },
    { value: "enclosure", label: "Enclosures" },
    { value: "mechanical", label: "Mechanical Parts" },
  ];

  const getComplexityColor = (complexity: Template["complexity"]) => {
    switch (complexity) {
      case "basic": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Design Templates</h1>
            <p className="text-muted-foreground">Start your design from a pre-configured template</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Category Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src={template.thumbnail} 
                  alt={template.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <Badge className={getComplexityColor(template.complexity)} variant="outline">
                    {template.complexity}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-2">
                <Button asChild className="w-full">
                  <Link to={`/design?template=${template.id}`}>Use Template</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No templates found matching your criteria</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
      
      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
        AI-CAD Genesis &copy; {new Date().getFullYear()} - Powered by AI
      </footer>
    </div>
  );
};

export default TemplatesPage;
