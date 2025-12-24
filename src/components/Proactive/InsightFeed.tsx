import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InsightCard, Insight, InsightType } from "./InsightCard";
import { cn } from "@/lib/utils";

interface InsightFeedProps {
  insights: Insight[];
  onDismiss: (id: string) => void;
  onAction: (id: string, action: string) => void;
  maxVisible?: number;
  collapsible?: boolean;
  className?: string;
}

export function InsightFeed({
  insights,
  onDismiss,
  onAction,
  maxVisible = 3,
  collapsible = true,
  className,
}: InsightFeedProps) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<InsightType | 'all'>('all');

  const filteredInsights = insights.filter(i => 
    !i.dismissed && (filter === 'all' || i.type === filter)
  );

  const visibleInsights = expanded 
    ? filteredInsights 
    : filteredInsights.slice(0, maxVisible);

  const hasMore = filteredInsights.length > maxVisible;
  const unreadCount = filteredInsights.length;

  if (filteredInsights.length === 0) {
    return (
      <div className={cn("glass-card rounded-lg p-6 text-center", className)}>
        <Bell className="w-8 h-8 text-foreground-tertiary mx-auto mb-2" />
        <p className="text-sm text-foreground-secondary">No new insights</p>
        <p className="text-xs text-foreground-tertiary mt-1">
          You're all caught up!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Insights</span>
          {unreadCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-foreground-secondary"
          >
            <Filter className="w-3 h-3 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Insight Cards */}
      <AnimatePresence mode="popLayout">
        {visibleInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <InsightCard
              insight={insight}
              onDismiss={onDismiss}
              onAction={onAction}
              compact={!expanded && index > 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Expand/Collapse */}
      {collapsible && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs text-foreground-secondary hover:text-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Show {filteredInsights.length - maxVisible} more
            </>
          )}
        </Button>
      )}
    </div>
  );
}
