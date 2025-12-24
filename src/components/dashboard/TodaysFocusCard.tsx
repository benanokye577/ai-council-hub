import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/council";

const priorityColors: Record<TaskPriority, string> = {
  urgent: "bg-error/20 text-error border-error/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-info/20 text-info border-info/30",
  low: "bg-foreground-tertiary/20 text-foreground-secondary border-border",
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review market positions",
    status: "pending",
    priority: "urgent",
    tags: ["finance"],
    estimatedMinutes: 30,
  },
  {
    id: "2",
    title: "Complete project proposal",
    status: "in_progress",
    priority: "high",
    tags: ["work"],
    estimatedMinutes: 60,
  },
  {
    id: "3",
    title: "Weekly planning session",
    status: "pending",
    priority: "medium",
    tags: ["planning"],
    estimatedMinutes: 45,
  },
];

export function TodaysFocusCard() {
  const portfolioChange = 45.20;

  return (
    <Card variant="gradient-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Today's Focus</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {mockTasks.length} tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-background-hover/50 hover:bg-background-hover transition-colors cursor-pointer group"
          >
            <button className="mt-0.5 shrink-0">
              {task.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <Circle className="w-4 h-4 text-foreground-tertiary group-hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                task.status === "completed" ? "text-foreground-tertiary line-through" : "text-foreground"
              )}>
                {task.title}
              </p>
              {task.estimatedMinutes && (
                <div className="flex items-center gap-1 mt-1 text-foreground-tertiary">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{task.estimatedMinutes}m</span>
                </div>
              )}
            </div>
            <Badge 
              variant="outline" 
              className={cn("text-[10px] shrink-0", priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
          </motion.div>
        ))}

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-success/10 to-transparent border border-success/20"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground-secondary">Portfolio</span>
          </div>
          <span className={cn(
            "text-sm font-semibold",
            portfolioChange >= 0 ? "text-success" : "text-error"
          )}>
            {portfolioChange >= 0 ? "+" : ""}${portfolioChange.toFixed(2)} today
          </span>
        </motion.div>
      </CardContent>
    </Card>
  );
}
