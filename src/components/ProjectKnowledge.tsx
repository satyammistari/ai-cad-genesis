
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type KnowledgeCategory = 'architecture' | 'components' | 'specifications' | 'useCases';

interface KnowledgeItem {
  id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  dateAdded: Date;
}

const ProjectKnowledge = () => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([
    {
      id: '1',
      category: 'architecture',
      title: 'CAD Engine Integration',
      content: 'The platform integrates with OpenCascade for solid modeling operations and STEP file generation.',
      dateAdded: new Date('2025-03-15')
    },
    {
      id: '2',
      category: 'components',
      title: 'Parametric Model Generator',
      content: 'Takes parsed prompts and generates parametric models using CADQuery and FreeCAD under the hood.',
      dateAdded: new Date('2025-03-20')
    }
  ]);
  
  const [newKnowledge, setNewKnowledge] = useState({
    category: 'architecture' as KnowledgeCategory,
    title: '',
    content: ''
  });

  const handleSaveKnowledge = () => {
    if (!newKnowledge.title || !newKnowledge.content) {
      toast.error("Please fill all fields");
      return;
    }
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      category: newKnowledge.category,
      title: newKnowledge.title,
      content: newKnowledge.content,
      dateAdded: new Date()
    };
    
    setKnowledge([...knowledge, newItem]);
    setNewKnowledge({
      category: 'architecture',
      title: '',
      content: ''
    });
    
    toast.success("Knowledge base updated", {
      description: "New information has been added to the project"
    });
  };

  const getCategoryLabel = (category: KnowledgeCategory) => {
    switch(category) {
      case 'architecture': return 'Architecture';
      case 'components': return 'Components';
      case 'specifications': return 'Specifications';
      case 'useCases': return 'Use Cases';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Project Knowledge</h2>
        
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Add Knowledge</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Project Knowledge</DrawerTitle>
              <DrawerDescription>
                Add detailed context and specifications about the project
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select 
                  id="category" 
                  className="w-full p-2 border rounded-md"
                  value={newKnowledge.category}
                  onChange={(e) => setNewKnowledge({...newKnowledge, category: e.target.value as KnowledgeCategory})}
                >
                  <option value="architecture">Architecture</option>
                  <option value="components">Components</option>
                  <option value="specifications">Specifications</option>
                  <option value="useCases">Use Cases</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter a concise title"
                  value={newKnowledge.title}
                  onChange={(e) => setNewKnowledge({...newKnowledge, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <textarea
                  id="content"
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Enter detailed information..."
                  value={newKnowledge.content}
                  onChange={(e) => setNewKnowledge({...newKnowledge, content: e.target.value})}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSaveKnowledge}>Save Knowledge</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledge.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No knowledge items have been added yet.</p>
            </CardContent>
          </Card>
        ) : knowledge.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>
                    {getCategoryLabel(item.category)} • Added {item.dateAdded.toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectKnowledge;
