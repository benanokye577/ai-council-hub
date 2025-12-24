import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sunrise, 
  Moon, 
  Target, 
  Clock, 
  Lightbulb, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DailyTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueTime?: string;
  completed: boolean;
}

interface DailyBriefData {
  greeting: string;
  userName: string;
  date: Date;
  peakHours: string;
  tasksToday: DailyTask[];
  councilSuggestion: string;
  focusRecommendation: string;
  upcomingDeadlines: { title: string; date: string }[];
  streak?: number;
}

interface DailyBriefPanelProps {
  data: DailyBriefData;
  onStartTask: (taskId: string) => void;
  onOpenChat: () => void;
  className?: string;
}

export function DailyBriefPanel({ data, onStartTask, onOpenChat, className }: DailyBriefPanelProps) {
  const hour = new Date().getHours();
  const isEvening = hour >= 18;
  const GradientIcon = isEvening ? Moon : Sunrise;
  
  const completedTasks = data.tasksToday.filter(t => t.completed).length;
  const progress = data.tasksToday.length > 0 
    ? (completedTasks / data.tasksToday.length) * 100 
    : 0;

  const priorityColors = {
    low: "bg-info/20 text-info",
    medium: "bg-warning/20 text-warning",
    high: "bg-error/20 text-error",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* Main Greeting Card */}
      <Card className="gradient-border-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <GradientIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {data.greeting}, {data.userName}
                </CardTitle>
                <p className="text-sm text-foreground-secondary">
                  {data.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            {data.streak && data.streak > 0 && (
              <Badge variant="gradient" className="gap-1">
                <Zap className="w-3 h-3" />
                {data.streak} day streak
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Today's Focus Section */}
          <div className="p-4 rounded-lg bg-background-elevated/50 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Today's Focus</span>
            </div>

            <div className="space-y-3">
              {/* Tasks Due Today */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {data.tasksToday.filter(t => !t.completed).length}
                </div>
                <span className="text-foreground">tasks due today</span>
              </div>

              {/* Peak Hours */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-foreground-secondary">
                  Your peak hours: <span className="text-foreground font-medium">{data.peakHours}</span>
                </span>
              </div>

              {/* Council Suggestion */}
              <div className="flex items-start gap-2 text-sm p-2 rounded-md bg-primary/10 border border-primary/20">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground-secondary">
                  Council suggests: <span className="text-foreground">{data.councilSuggestion}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-foreground-secondary">Today's progress</span>
              <span className="text-foreground font-medium">{completedTasks}/{data.tasksToday.length} tasks</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {data.tasksToday.slice(0, 3).map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border/50 cursor-pointer transition-colors",
                  task.completed 
                    ? "bg-success/5 border-success/20" 
                    : "bg-background-elevated/30 hover:bg-background-hover"
                )}
                onClick={() => onStartTask(task.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge className={cn("text-xs", priorityColors[task.priority])}>
                    {task.priority}
                  </Badge>
                  <span className={cn(
                    "text-sm",
                    task.completed && "line-through text-foreground-tertiary"
                  )}>
                    {task.title}
                  </span>
                </div>
                {task.dueTime && (
                  <span className="text-xs text-foreground-tertiary">{task.dueTime}</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button 
              className="flex-1 btn-gradient"
              onClick={onOpenChat}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Ask Council
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      {data.upcomingDeadlines.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.upcomingDeadlines.map((deadline, i) => (
              <div 
                key={i}
                className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-background-hover/50 transition-colors cursor-pointer"
              >
                <span className="text-foreground">{deadline.title}</span>
                <div className="flex items-center gap-2 text-foreground-tertiary">
                  <span className="text-xs">{deadline.date}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
