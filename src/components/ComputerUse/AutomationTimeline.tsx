import { motion } from "framer-motion";
import { Check, Circle, Loader2, MousePointer, Keyboard, Globe, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionType } from "./ActionConfirmModal";

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AutomationStep {
  id: string;
  type: ActionType;
  description: string;
  status: StepStatus;
  timestamp?: Date;
  error?: string;
}

interface AutomationTimelineProps {
  steps: AutomationStep[];
  className?: string;
}

const typeIcons: Record<ActionType, typeof MousePointer> = {
  click: MousePointer,
  type: Keyboard,
  scroll: MousePointer,
  navigate: Globe,
  wait: Clock,
};

const statusIcons: Record<StepStatus, typeof Circle> = {
  pending: Circle,
  running: Loader2,
  completed: Check,
  failed: AlertCircle,
};

const statusColors: Record<StepStatus, string> = {
  pending: "text-foreground-tertiary border-foreground-tertiary/30",
  running: "text-primary border-primary",
  completed: "text-success border-success",
  failed: "text-error border-error",
};

export function AutomationTimeline({ steps, className }: AutomationTimelineProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Actions</span>
        <span className="text-xs text-foreground-tertiary">
          {steps.filter(s => s.status === 'completed').length}/{steps.length} completed
        </span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const TypeIcon = typeIcons[step.type];
            const StatusIcon = statusIcons[step.status];
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-start gap-3 pl-1"
              >
                {/* Status indicator */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2 bg-background transition-colors",
                  statusColors[step.status]
                )}>
                  {step.status === 'running' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    <StatusIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Step content */}
                <div className={cn(
                  "flex-1 pb-3",
                  !isLast && "border-b border-border/50"
                )}>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-3.5 h-3.5 text-foreground-secondary" />
                    <span className={cn(
                      "text-sm font-medium",
                      step.status === 'completed' && "text-foreground-secondary",
                      step.status === 'failed' && "text-error"
                    )}>
                      {step.description}
                    </span>
                  </div>

                  {step.error && (
                    <p className="text-xs text-error mt-1">{step.error}</p>
                  )}

                  {step.timestamp && step.status === 'completed' && (
                    <p className="text-xs text-foreground-tertiary mt-1">
                      {step.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
