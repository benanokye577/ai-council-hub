import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  initialMinutes?: number;
  breakMinutes?: number;
  onComplete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  taskTitle?: string;
  className?: string;
}

export function FocusTimer({
  initialMinutes = 25,
  breakMinutes = 5,
  onComplete,
  onStart,
  onPause,
  taskTitle,
  className,
}: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);

  const totalSeconds = isBreak ? breakMinutes * 60 : initialMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(initialMinutes * 60);
      }
      onComplete?.();
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, breakMinutes, initialMinutes, onComplete]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      onPause?.();
    } else {
      onStart?.();
    }
    setIsRunning(!isRunning);
  }, [isRunning, onPause, onStart]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(initialMinutes * 60);
  }, [initialMinutes]);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Task Title */}
      {taskTitle && (
        <div className="flex items-center gap-2 mb-6 text-sm text-foreground-secondary">
          <Target className="w-4 h-4 text-primary" />
          <span>Focusing on: <span className="text-foreground font-medium">{taskTitle}</span></span>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative w-64 h-64">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke={isBreak ? "hsl(var(--success))" : "hsl(var(--primary))"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold text-foreground tabular-nums"
            key={`${minutes}:${seconds}`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </motion.span>
          <span className={cn(
            "text-sm font-medium mt-2",
            isBreak ? "text-success" : "text-primary"
          )}>
            {isBreak ? (
              <span className="flex items-center gap-1">
                <Coffee className="w-4 h-4" />
                Break Time
              </span>
            ) : (
              "DEEP FOCUS"
            )}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          className={cn(
            "h-16 w-16 rounded-full",
            isRunning ? "bg-error hover:bg-error/90" : "btn-gradient"
          )}
          onClick={toggleTimer}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>

        <div className="w-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Sessions */}
      <div className="flex items-center gap-2 mt-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              i < sessionsCompleted ? "bg-primary" : "bg-border"
            )}
            animate={i < sessionsCompleted ? { scale: [1, 1.2, 1] } : {}}
          />
        ))}
        <span className="text-xs text-foreground-tertiary ml-2">
          {sessionsCompleted}/5 sessions
        </span>
      </div>
    </div>
  );
}
