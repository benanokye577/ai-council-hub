import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreVertical,
  Play,
  Copy,
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    description: "Convert emails to tasks automatically",
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: "2",
    name: "Daily Standup Summary",
    description: "Summarize Slack standups with AI",
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false,
  },
  {
    id: "3",
    name: "Meeting Notes Processor",
    description: "Extract action items from meeting notes",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Workflows</span>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onNew}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-tertiary" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-7 text-xs"
        />
      </div>

      {/* Workflow List */}
      <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredWorkflows.map((workflow, i) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
              selectedId === workflow.id 
                ? "bg-primary/10 border border-primary/30" 
                : "hover:bg-background-hover border border-transparent"
            )}
            onClick={() => onSelect(workflow)}
          >
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              workflow.isActive ? "bg-success" : "bg-foreground-tertiary"
            )} />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {workflow.name}
              </p>
              {workflow.description && (
                <p className="text-xs text-foreground-tertiary truncate">
                  {workflow.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelect(workflow)}>
                  <Play className="w-3.5 h-3.5 mr-2" />
                  Run
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(workflow)}>
                  <Copy className="w-3.5 h-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-error focus:text-error"
                  onClick={() => handleDelete(workflow.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ))}

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-foreground-tertiary">No workflows found</p>
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="pt-3 border-t border-border">
        <p className="text-xs font-medium text-foreground-secondary mb-2">Templates</p>
        <div className="space-y-1">
          {[
            { name: "Email Automation", icon: "📧" },
            { name: "Task Management", icon: "✅" },
            { name: "AI Pipeline", icon: "🤖" },
          ].map((template) => (
            <div
              key={template.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-background-hover cursor-pointer transition-colors"
              onClick={onNew}
            >
              <span className="text-sm">{template.icon}</span>
              <span className="text-xs text-foreground-secondary">{template.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
