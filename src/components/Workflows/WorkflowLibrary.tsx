import { useState } from "react";
import { Plus, Search, MoreHorizontal, Play, Copy, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Workflow } from "@/types/workflow";

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Email to Task",
    description: "Convert emails to tasks",
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: "2",
    name: "Daily Standup",
    description: "Summarize Slack standups",
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false,
  },
  {
    id: "3",
    name: "Meeting Notes",
    description: "Extract action items",
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

interface WorkflowLibraryProps {
  onSelect: (workflow: Workflow) => void;
  onNew: () => void;
  selectedId?: string;
  className?: string;
}

export function WorkflowLibrary({ onSelect, onNew, selectedId, className }: WorkflowLibraryProps) {
  const [search, setSearch] = useState("");
  const [workflows, setWorkflows] = useState(mockWorkflows);

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const handleDuplicate = (workflow: Workflow) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkflows([...workflows, newWorkflow]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs bg-secondary/30 border-transparent focus:border-border"
        />
      </div>

      {/* New Button */}
      <Button 
        variant="outline" 
        className="w-full h-8 text-xs justify-start border-dashed"
        onClick={onNew}
      >
        <Plus className="w-3.5 h-3.5 mr-2" />
        New Workflow
      </Button>

      {/* Workflow List */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Saved
        </p>
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className={cn(
              "group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
              selectedId === workflow.id 
                ? "bg-primary/10" 
                : "hover:bg-secondary/50"
            )}
            onClick={() => onSelect(workflow)}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              workflow.isActive ? "bg-success" : "bg-muted-foreground/40"
            )} />
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {workflow.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {workflow.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onSelect(workflow)} className="text-xs">
                  <Play className="w-3 h-3 mr-2" />
                  Run
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(workflow)} className="text-xs">
                  <Copy className="w-3 h-3 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-xs text-destructive focus:text-destructive"
                  onClick={() => handleDelete(workflow.id)}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {filteredWorkflows.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No workflows found
          </p>
        )}
      </div>

      {/* Templates */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
          Templates
        </p>
        <div className="space-y-0.5">
          {[
            { name: "Email Automation", desc: "Auto-respond & organize" },
            { name: "Task Pipeline", desc: "Route & assign tasks" },
            { name: "AI Assistant", desc: "Intelligent processing" },
          ].map((template) => (
            <div
              key={template.name}
              className="p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={onNew}
            >
              <p className="text-xs font-medium text-foreground">{template.name}</p>
              <p className="text-[10px] text-muted-foreground">{template.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}