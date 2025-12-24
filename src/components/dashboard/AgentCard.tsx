import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusIndicatorProps {
  status: "online" | "idle" | "offline";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function StatusIndicator({
  status,
  size = "md",
  pulse = true,
}: StatusIndicatorProps) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const statusClasses = {
    online: "status-online",
    idle: "status-idle",
    offline: "status-offline",
  };

  return (
    <span
      className={cn(
        "rounded-full inline-block",
        sizes[size],
        statusClasses[status],
        pulse && status === "online" && "animate-pulse-glow"
      )}
    />
  );
}

interface AgentCardProps {
  name: string;
  specialty: string;
  status: "online" | "idle" | "offline";
  messageCount: number;
  icon: LucideIcon;
  lastActive?: string;
  onClick?: () => void;
}

export function AgentCard({
  name,
  specialty,
  status,
  messageCount,
  icon: Icon,
  lastActive,
  onClick,
}: AgentCardProps) {
  return (
    <motion.div
      className="gradient-border-card p-4 cursor-pointer hover-lift group"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        {/* Agent Avatar */}
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-strong transition-shadow">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <StatusIndicator status={status} size="sm" />
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {name}
            </h4>
          </div>
          <p className="text-xs text-foreground-secondary truncate mt-0.5">
            {specialty}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-4">
          <div className="text-xs">
            <span className="text-foreground-tertiary">Messages: </span>
            <span className="text-foreground font-medium">
              {messageCount.toLocaleString()}
            </span>
          </div>
        </div>
        {lastActive && (
          <span className="text-[10px] text-foreground-tertiary">
            {lastActive}
          </span>
        )}
      </div>

      {/* Sparkline Placeholder */}
      <div className="mt-3 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 30">
          <defs>
            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,20 Q10,15 20,18 T40,12 T60,22 T80,8 T100,15"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="sparkline-animated"
          />
          <path
            d="M0,20 Q10,15 20,18 T40,12 T60,22 T80,8 T100,15 V30 H0 Z"
            fill="url(#sparklineGradient)"
            className="opacity-50"
          />
        </svg>
      </div>
    </motion.div>
  );
}
