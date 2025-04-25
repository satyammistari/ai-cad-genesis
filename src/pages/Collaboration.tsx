
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Share, User, Users, File, FileText, FilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CollaboratorInterface {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  avatarUrl: string;
  online: boolean;
}

interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lastOpened: string;
  thumbnailUrl: string;
  collaborators: CollaboratorInterface[];
}

// Mock data for projects
const MOCK_PROJECTS: ProjectInterface[] = [
  {
    id: "proj-001",
    name: "Planetary Gear System",
    description: "High-efficiency transmission system with multiple stages",
    createdAt: "2025-04-15T10:30:00Z",
    updatedAt: "2025-04-24T14:22:00Z",
    lastOpened: "2025-04-24T14:22:00Z",
    thumbnailUrl: "placeholder.svg",
    collaborators: [
      {
        id: "user-001",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "owner",
        avatarUrl: "",
        online: true
      },
      {
        id: "user-002",
        name: "Maya Patel",
        email: "maya@example.com",
        role: "editor",
        avatarUrl: "",
        online: false
      }
    ]
  },
  {
    id: "proj-002",
    name: "Cooling System Housing",
    description: "Enclosure for automotive engine cooling system",
    createdAt: "2025-04-10T09:15:00Z",
    updatedAt: "2025-04-22T11:45:00Z",
    lastOpened: "2025-04-23T16:30:00Z",
    thumbnailUrl: "placeholder.svg",
    collaborators: [
      {
        id: "user-001",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "editor",
        avatarUrl: "",
        online: true
      },
      {
        id: "user-003",
        name: "Liam Chen",
        email: "liam@example.com",
        role: "owner",
        avatarUrl: "",
        online: true
      }
    ]
  },
  {
    id: "proj-003",
    name: "Robotic Arm Joint",
    description: "Multi-axis joint design for industrial robot",
    createdAt: "2025-03-28T14:20:00Z",
    updatedAt: "2025-04-20T10:10:00Z",
    lastOpened: "2025-04-20T10:10:00Z",
    thumbnailUrl: "placeholder.svg",
    collaborators: [
      {
        id: "user-001",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "owner",
        avatarUrl: "",
        online: true
      }
    ]
  }
];

// Function to format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

const CollaborationPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"my-projects" | "shared">("my-projects");
  const [projects, setProjects] = useState<ProjectInterface[]>(MOCK_PROJECTS);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectInterface | null>(null);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: ""
  });
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState<"editor" | "viewer">("editor");
  
  const myProjects = projects.filter(
    project => project.collaborators.find(c => c.id === "user-001")?.role === "owner"
  );
  
  const sharedProjects = projects.filter(
    project => {
      const userAsCollab = project.collaborators.find(c => c.id === "user-001");
      return userAsCollab && userAsCollab.role !== "owner";
    }
  );

  const handleCreateProject = () => {
    if (!newProjectData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const newProject: ProjectInterface = {
      id: `proj-00${projects.length + 1}`,
      name: newProjectData.name,
      description: newProjectData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
      thumbnailUrl: "placeholder.svg",
      collaborators: [{
        id: "user-001",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "owner",
        avatarUrl: "",
        online: true
      }]
    };

    setProjects([...projects, newProject]);
    setNewProjectData({ name: "", description: "" });
    setShowNewProjectDialog(false);
    
    toast.success("Project created successfully");
  };

  const handleShareProject = () => {
    if (!selectedProject || !shareEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

    // In a real app, this would make an API call to add the collaborator
    toast.success(`Invitation sent to ${shareEmail}`);
    setShareEmail("");
    setShowShareDialog(false);
  };

  const openProject = (projectId: string) => {
    // This would navigate to the design editor with the project loaded
    navigate(`/design?project=${projectId}`);
  };

  // Simulate connection status for collaborators
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(currentProjects => 
        currentProjects.map(project => ({
          ...project,
          collaborators: project.collaborators.map(collaborator => ({
            ...collaborator,
            online: collaborator.id === "user-001" ? true : Math.random() > 0.5
          }))
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Project Collaboration</h1>
            <p className="text-muted-foreground">Manage and collaborate on design projects</p>
          </div>
          
          <Button onClick={() => setShowNewProjectDialog(true)} className="mt-4 md:mt-0">
            <FilePlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <Tabs value={tab} onValueChange={(value) => setTab(value as "my-projects" | "shared")}>
          <TabsList className="mb-6">
            <TabsTrigger value="my-projects" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Shared with Me
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-projects" className="space-y-4">
            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div 
                      className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                      onClick={() => openProject(project.id)}
                    >
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle 
                          className="text-lg cursor-pointer hover:text-primary"
                          onClick={() => openProject(project.id)}
                        >
                          {project.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-xs text-muted-foreground">
                        Last updated: {formatDate(project.updatedAt)}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2 mr-2">
                          {project.collaborators.map(collaborator => (
                            <Avatar key={collaborator.id} className={`h-6 w-6 border-2 ${collaborator.online ? 'border-green-500' : 'border-gray-200'}`}>
                              <AvatarFallback>
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {project.collaborators.length} collaborators
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2">
                      <div className="flex justify-between w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowShareDialog(true);
                          }}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => openProject(project.id)}
                        >
                          Open Project
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to start designing and collaborating
                  </p>
                  <Button onClick={() => setShowNewProjectDialog(true)}>
                    Create a Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-4">
            {sharedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div 
                      className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                      onClick={() => openProject(project.id)}
                    >
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle 
                          className="text-lg cursor-pointer hover:text-primary"
                          onClick={() => openProject(project.id)}
                        >
                          {project.name}
                        </CardTitle>
                        <Badge>{project.collaborators.find(c => c.id === "user-001")?.role}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <div className="flex items-center mt-1 mb-2">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback>
                            {project.collaborators.find(c => c.role === "owner")?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">
                          Owned by {project.collaborators.find(c => c.role === "owner")?.name}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Last updated: {formatDate(project.updatedAt)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="w-full"
                        onClick={() => openProject(project.id)}
                      >
                        Open Project
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No shared projects</h3>
                  <p className="text-muted-foreground">
                    Projects shared with you will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
        AI-CAD Genesis &copy; {new Date().getFullYear()} - Powered by AI
      </footer>
      
      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add details for your new design project
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input 
                id="project-name" 
                placeholder="Enter project name"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Input 
                id="project-description" 
                placeholder="Briefly describe your project"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Project Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Invite team members to collaborate on "{selectedProject?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collaborator-email">Email Address</Label>
              <Input 
                id="collaborator-email" 
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collaborator-role">Permission</Label>
              <select 
                id="collaborator-role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shareRole}
                onChange={(e) => setShareRole(e.target.value as "editor" | "viewer")}
              >
                <option value="editor">Can edit</option>
                <option value="viewer">Can view</option>
              </select>
            </div>
            
            {selectedProject && (
              <div className="border rounded-md p-3 mt-4">
                <h4 className="text-sm font-medium mb-2">Current collaborators</h4>
                <div className="space-y-2">
                  {selectedProject.collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{collaborator.name}</span>
                      </div>
                      <Badge variant="outline">{collaborator.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareProject}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaborationPage;
