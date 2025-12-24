import { 
  Mail, 
  Clock, 
  Webhook, 
  FileText,
  GitBranch,
  Filter,
  CheckCircle,
  Send,
  Database,
  Bell,
  Brain,
  Sparkles,
  Wand2,
  MessageSquare,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeType } from "@/types/workflow";

interface NodeTemplate {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  lucideIcon: LucideIcon;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  { id: "email_trigger", type: "trigger", label: "Email", description: "On email received", icon: "📧", lucideIcon: Mail },
  { id: "schedule_trigger", type: "trigger", label: "Schedule", description: "Run on schedule", icon: "🕐", lucideIcon: Clock },
  { id: "webhook_trigger", type: "trigger", label: "Webhook", description: "HTTP webhook", icon: "🔗", lucideIcon: Webhook },
  { id: "file_trigger", type: "trigger", label: "File", description: "On file created", icon: "📁", lucideIcon: FileText },
  
  // Conditions
  { id: "branch", type: "condition", label: "Branch", description: "Split on condition", icon: "🔀", lucideIcon: GitBranch },
  { id: "filter", type: "condition", label: "Filter", description: "Filter by criteria", icon: "🔍", lucideIcon: Filter },
  
  // Actions
  { id: "create_task", type: "action", label: "Task", description: "Create task", icon: "✅", lucideIcon: CheckCircle },
  { id: "send_message", type: "action", label: "Message", description: "Send message", icon: "💬", lucideIcon: Send },
  { id: "update_db", type: "action", label: "Database", description: "Update database", icon: "🗄️", lucideIcon: Database },
  { id: "notify", type: "action", label: "Notify", description: "Send notification", icon: "🔔", lucideIcon: Bell },
  
  // AI
  { id: "ai_extract", type: "ai", label: "Extract", description: "AI data extraction", icon: "🤖", lucideIcon: Brain },
  { id: "ai_summarize", type: "ai", label: "Summarize", description: "AI summarization", icon: "✨", lucideIcon: Sparkles },
  { id: "ai_generate", type: "ai", label: "Generate", description: "AI content gen", icon: "🪄", lucideIcon: Wand2 },
  { id: "ai_respond", type: "ai", label: "Respond", description: "AI response", icon: "💭", lucideIcon: MessageSquare },
];

const typeConfig: Record<NodeType, { label: string; color: string }> = {
  trigger: { label: "TRIGGERS", color: "hsl(var(--workflow-trigger))" },
  condition: { label: "LOGIC", color: "hsl(var(--workflow-condition))" },
  action: { label: "ACTIONS", color: "hsl(var(--workflow-action))" },
  ai: { label: "AI", color: "hsl(var(--workflow-ai))" },
};

interface NodePaletteProps {
  onDragStart: (template: NodeTemplate, e: React.DragEvent) => void;
  className?: string;
}

export function NodePalette({ onDragStart, className }: NodePaletteProps) {
  const groupedNodes = {
    trigger: nodeTemplates.filter(n => n.type === 'trigger'),
    condition: nodeTemplates.filter(n => n.type === 'condition'),
    action: nodeTemplates.filter(n => n.type === 'action'),
    ai: nodeTemplates.filter(n => n.type === 'ai'),
  };

  return (
    <div className={cn("py-3", className)}>
      <div className="px-3 mb-4">
        <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Components
        </h3>
      </div>
      
      {(Object.keys(groupedNodes) as NodeType[]).map((type) => (
        <div key={type} className="mb-4">
          <div className="flex items-center gap-2 px-3 mb-2">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: typeConfig[type].color }}
            />
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {typeConfig[type].label}
            </span>
          </div>
          
          <div className="space-y-0.5 px-1.5">
            {groupedNodes[type].map((template) => {
              const Icon = template.lucideIcon;
              return (
                <div
                  key={template.id}
                  draggable
                  onDragStart={(e) => onDragStart(template, e)}
                  className={cn(
                    "group flex items-center gap-2.5 px-2 py-2 rounded-md cursor-grab active:cursor-grabbing",
                    "hover:bg-secondary/50 transition-colors select-none"
                  )}
                >
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: `color-mix(in srgb, ${typeConfig[type].color} 15%, transparent)`,
                    }}
                  >
                    <Icon 
                      className="w-3.5 h-3.5" 
                      style={{ color: typeConfig[type].color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {template.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {template.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { NodeTemplate };