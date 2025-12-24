import { motion } from "framer-motion";
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
  MessageSquare,
  Sparkles,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeType, NODE_TEMPLATES } from "@/types/workflow";

interface NodeTemplate {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  lucideIcon: typeof Mail;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  { id: "email_trigger", type: "trigger", label: "Email Received", description: "Triggers when email arrives", icon: "📧", lucideIcon: Mail },
  { id: "schedule_trigger", type: "trigger", label: "Schedule", description: "Run on a schedule", icon: "🕐", lucideIcon: Clock },
  { id: "webhook_trigger", type: "trigger", label: "Webhook", description: "HTTP webhook trigger", icon: "🔗", lucideIcon: Webhook },
  { id: "file_trigger", type: "trigger", label: "File Created", description: "When file is created", icon: "📁", lucideIcon: FileText },
  
  // Conditions
  { id: "branch", type: "condition", label: "Branch", description: "Split based on condition", icon: "🔀", lucideIcon: GitBranch },
  { id: "filter", type: "condition", label: "Filter", description: "Filter by criteria", icon: "🔍", lucideIcon: Filter },
  
  // Actions
  { id: "create_task", type: "action", label: "Create Task", description: "Add a new task", icon: "✅", lucideIcon: CheckCircle },
  { id: "send_message", type: "action", label: "Send Message", description: "Send Slack/email", icon: "💬", lucideIcon: Send },
  { id: "update_db", type: "action", label: "Update Database", description: "Write to database", icon: "🗄️", lucideIcon: Database },
  { id: "notify", type: "action", label: "Notification", description: "Send notification", icon: "🔔", lucideIcon: Bell },
  
  // AI
  { id: "ai_extract", type: "ai", label: "AI Extract", description: "Extract data with AI", icon: "🤖", lucideIcon: Brain },
  { id: "ai_summarize", type: "ai", label: "AI Summarize", description: "Summarize content", icon: "✨", lucideIcon: Sparkles },
  { id: "ai_generate", type: "ai", label: "AI Generate", description: "Generate content", icon: "🪄", lucideIcon: Wand2 },
  { id: "ai_respond", type: "ai", label: "AI Respond", description: "Generate response", icon: "💭", lucideIcon: MessageSquare },
];

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

  const groupLabels: Record<NodeType, string> = {
    trigger: 'Triggers',
    condition: 'Conditions',
    action: 'Actions',
    ai: 'AI Nodes',
  };

  return (
    <div className={cn("space-y-4 p-3", className)}>
      <h3 className="text-sm font-semibold text-foreground px-1">Node Palette</h3>
      
      {(Object.keys(groupedNodes) as NodeType[]).map((type) => (
        <div key={type} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: NODE_TEMPLATES[type].color }}
            />
            <span className="text-xs font-medium text-foreground-secondary">
              {groupLabels[type]}
            </span>
          </div>
          
          <div className="space-y-1">
            {groupedNodes[type].map((template) => (
              <motion.div
                key={template.id}
                draggable
                onDragStart={(e) => onDragStart(template, e as any)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 rounded-md cursor-grab active:cursor-grabbing",
                  "border border-transparent hover:border-border",
                  "transition-colors"
                )}
                style={{ backgroundColor: NODE_TEMPLATES[template.type].bgColor }}
              >
                <span className="text-base">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {template.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { NodeTemplate };
