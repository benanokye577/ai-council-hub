import { motion } from "framer-motion";
import { Monitor, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface ScreenPreviewProps {
  screenshot?: string;
  cursorPosition?: CursorPosition;
  clickTarget?: { x: number; y: number; label: string };
  isLive?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function ScreenPreview({
  screenshot,
  cursorPosition,
  clickTarget,
  isLive = false,
  onRefresh,
  className,
}: ScreenPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden border border-border bg-background-card",
      expanded ? "fixed inset-4 z-50" : "aspect-video",
      className
    )}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 bg-gradient-to-b from-background/80 to-transparent">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-foreground-secondary" />
          <span className="text-xs text-foreground-secondary">
            {isLive ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live Preview
              </span>
            ) : (
              "Screen Capture"
            )}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onRefresh}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Screen Content */}
      {screenshot ? (
        <div className="relative w-full h-full">
          <img
            src={screenshot}
            alt="Screen capture"
            className="w-full h-full object-contain"
          />

          {/* Cursor overlay */}
          {cursorPosition && (
            <motion.div
              className="absolute w-4 h-4 pointer-events-none"
              style={{
                left: `${cursorPosition.x}%`,
                top: `${cursorPosition.y}%`,
                transform: 'translate(-25%, -10%)',
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-lg">
                <path
                  d="M5.5 3.21V20.79c0 .45.54.67.85.35l4.87-4.87h7.28c.55 0 1-.45 1-1V3.21c0-.55-.45-1-1-1H6.5c-.55 0-1 .45-1 1z"
                  fill="white"
                  stroke="black"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>
          )}

          {/* Click target highlight */}
          {clickTarget && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: `${clickTarget.x}%`,
                top: `${clickTarget.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs whitespace-nowrap">
                {clickTarget.label}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Monitor className="w-12 h-12 text-foreground-tertiary mx-auto mb-2" />
            <p className="text-sm text-foreground-secondary">No screen capture available</p>
            <p className="text-xs text-foreground-tertiary mt-1">
              Start automation to capture screen
            </p>
          </div>
        </div>
      )}

      {/* Expanded backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-background/80 -z-10"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
