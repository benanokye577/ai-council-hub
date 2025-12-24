import { motion } from "framer-motion";
import { X, Clock, AlertTriangle, CheckCircle, Lightbulb, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InsightType = 'task' | 'warning' | 'suggestion' | 'deadline' | 'opportunity';
export type InsightPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: InsightPriority;
  actions?: { label: string; action: string }[];
  timestamp: Date;
  dismissed?: boolean;
}

const insightIcons: Record<InsightType, typeof Lightbulb> = {
  task: CheckCircle,
  warning: AlertTriangle,
  suggestion: Lightbulb,
  deadline: Calendar,
  opportunity: TrendingUp,
};

const insightColors: Record<InsightType, string> = {
  task: "text-info",
  warning: "text-warning",
  suggestion: "text-primary",
  deadline: "text-error",
  opportunity: "text-success",
};

const priorityStyles: Record<InsightPriority, string> = {
  low: "border-border",
  medium: "border-info/30",
  high: "border-warning/30",
  urgent: "border-error/30 bg-error/5",
};

interface InsightCardProps {
  insight: Insight;
  onDismiss: (id: string) => void;
  onAction: (id: string, action: string) => void;
  compact?: boolean;
}

export function InsightCard({ insight, onDismiss, onAction, compact = false }: InsightCardProps) {
  const Icon = insightIcons[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={cn(
        "glass-card rounded-lg border transition-all hover:bg-background-hover/50",
        priorityStyles[insight.priority],
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg bg-background-elevated shrink-0",
          insightColors[insight.type]
        )}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={cn(
                "font-medium text-foreground",
                compact ? "text-sm" : "text-base"
              )}>
                {insight.title}
              </h4>
              {!compact && (
                <p className="text-sm text-foreground-secondary mt-0.5 line-clamp-2">
                  {insight.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-6 w-6 text-foreground-tertiary hover:text-foreground"
              onClick={() => onDismiss(insight.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {insight.actions && insight.actions.length > 0 && (
            <div className={cn(
              "flex items-center gap-2 flex-wrap",
              compact ? "mt-2" : "mt-3"
            )}>
              {insight.actions.map((action, i) => (
                <Button
                  key={i}
                  variant={i === 0 ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onAction(insight.id, action.action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 text-xs text-foreground-tertiary">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(insight.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
