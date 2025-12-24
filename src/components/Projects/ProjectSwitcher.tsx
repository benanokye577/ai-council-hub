import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MoreHorizontal,
  Check,
  Settings,
  Trash2,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isStarred: boolean;
  lastAccessed: Date;
  taskCount: number;
}

const mockProjects: Project[] = [
  { id: '1', name: 'Solaris Development', description: 'Main AI assistant project', color: '#8B5CF6', isStarred: true, lastAccessed: new Date(), taskCount: 24 },
  { id: '2', name: 'Marketing Campaign', description: 'Q1 2025 marketing initiatives', color: '#06B6D4', isStarred: false, lastAccessed: new Date(Date.now() - 86400000), taskCount: 12 },
  { id: '3', name: 'Research Notes', description: 'AI research and papers', color: '#10B981', isStarred: true, lastAccessed: new Date(Date.now() - 172800000), taskCount: 8 },
  { id: '4', name: 'Personal', description: 'Personal tasks and notes', color: '#F59E0B', isStarred: false, lastAccessed: new Date(Date.now() - 259200000), taskCount: 5 },
];

interface ProjectSwitcherProps {
  currentProjectId?: string;
  onProjectChange?: (project: Project) => void;
  className?: string;
}

export function ProjectSwitcher({ 
  currentProjectId = '1', 
  onProjectChange,
  className 
}: ProjectSwitcherProps) {
  const [projects, setProjects] = useState(mockProjects);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', color: '#8B5CF6' });

  const currentProject = projects.find(p => p.id === currentProjectId);
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const starredProjects = filteredProjects.filter(p => p.isStarred);
  const recentProjects = filteredProjects.filter(p => !p.isStarred);

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    
    const project: Project = {
      id: `project_${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      isStarred: false,
      lastAccessed: new Date(),
      taskCount: 0
    };
    
    setProjects([project, ...projects]);
    setNewProject({ name: '', description: '', color: '#8B5CF6' });
    setShowNewDialog(false);
    onProjectChange?.(project);
  };

  const toggleStar = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, isStarred: !p.isStarred } : p
    ));
  };

  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 px-3">
            <div 
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: currentProject?.color }}
            />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{currentProject?.name || 'Select Project'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentProject?.taskCount} tasks
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72 p-0">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="max-h-64 overflow-y-auto p-1">
            {starredProjects.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Starred
                </p>
                {starredProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    isSelected={project.id === currentProjectId}
                    onSelect={() => {
                      onProjectChange?.(project);
                      setIsOpen(false);
                    }}
                    onStar={() => toggleStar(project.id)}
                  />
                ))}
              </div>
            )}

            {recentProjects.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Recent
                </p>
                {recentProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    isSelected={project.id === currentProjectId}
                    onSelect={() => {
                      onProjectChange?.(project);
                      setIsOpen(false);
                    }}
                    onStar={() => toggleStar(project.id)}
                  />
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && (
              <p className="text-center py-4 text-sm text-muted-foreground">
                No projects found
              </p>
            )}
          </div>

          {/* New Project Button */}
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-8 text-sm"
              onClick={() => {
                setShowNewDialog(true);
                setIsOpen(false);
              }}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Project Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject(s => ({ ...s, name: e.target.value }))}
                placeholder="My New Project"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(s => ({ ...s, description: e.target.value }))}
                placeholder="What is this project about?"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      newProject.color === color && "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewProject(s => ({ ...s, color }))}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectItem({
  project,
  isSelected,
  onSelect,
  onStar
}: {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  onStar: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-secondary/50"
      )}
      onClick={onSelect}
    >
      <div 
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: project.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{project.name}</p>
      </div>
      {isSelected && (
        <Check className="w-4 h-4 text-primary shrink-0" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
        className={cn(
          "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
          project.isStarred && "opacity-100"
        )}
      >
        <Star 
          className={cn(
            "w-3.5 h-3.5",
            project.isStarred ? "fill-warning text-warning" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  );
}