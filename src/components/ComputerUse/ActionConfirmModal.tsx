import { motion, AnimatePresence } from "framer-motion";
import { MousePointer, Keyboard, AlertCircle, Check, X, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type ActionType = 'click' | 'type' | 'scroll' | 'navigate' | 'wait';

interface PendingAction {
  type: ActionType;
  target: string;
  description: string;
  coordinates?: { x: number; y: number };
  value?: string;
}

interface ActionConfirmModalProps {
  open: boolean;
  action: PendingAction | null;
  onConfirm: () => void;
  onDeny: () => void;
  autoConfirmSeconds?: number;
}

const actionIcons: Record<ActionType, typeof MousePointer> = {
  click: MousePointer,
  type: Keyboard,
  scroll: MousePointer,
  navigate: MousePointer,
  wait: Clock,
};

export function ActionConfirmModal({
  open,
  action,
  onConfirm,
  onDeny,
  autoConfirmSeconds = 0,
}: ActionConfirmModalProps) {
  const [countdown, setCountdown] = useState(autoConfirmSeconds);

  useEffect(() => {
    if (!open || autoConfirmSeconds <= 0) {
      setCountdown(autoConfirmSeconds);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, autoConfirmSeconds, onConfirm]);

  if (!action) return null;

  const Icon = actionIcons[action.type];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onDeny()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-warning/20 w-fit">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <DialogTitle className="text-lg">Confirm Action</DialogTitle>
          <DialogDescription>
            Solaris wants to perform the following action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Details */}
          <div className="p-4 rounded-lg bg-background-elevated border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground capitalize">
                  {action.type}: {action.target}
                </p>
                <p className="text-sm text-foreground-secondary mt-1">
                  {action.description}
                </p>
                {action.coordinates && (
                  <p className="text-xs text-foreground-tertiary mt-2 font-mono">
                    Position: ({action.coordinates.x}, {action.coordinates.y})
                  </p>
                )}
                {action.value && (
                  <p className="text-xs text-foreground-tertiary mt-2">
                    Value: "{action.value}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Auto-confirm countdown */}
          {autoConfirmSeconds > 0 && countdown > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-foreground-tertiary">
                <span>Auto-confirming in {countdown}s</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setCountdown(0)}
                >
                  Cancel auto-confirm
                </Button>
              </div>
              <Progress value={((autoConfirmSeconds - countdown) / autoConfirmSeconds) * 100} className="h-1" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDeny}
            >
              <X className="w-4 h-4 mr-2" />
              Deny
            </Button>
            <Button
              className="flex-1 btn-gradient"
              onClick={onConfirm}
            >
              <Check className="w-4 h-4 mr-2" />
              Allow
            </Button>
          </div>

          {/* Trust hint */}
          <p className="text-xs text-foreground-tertiary text-center">
            You can enable auto-confirm for trusted actions in settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
