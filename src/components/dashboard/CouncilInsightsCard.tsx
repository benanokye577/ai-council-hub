import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Insight {
  id: string;
  type: "productivity" | "recommendation" | "opportunity" | "warning";
  title: string;
  description: string;
  action?: string;
  metric?: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "productivity",
    title: "Peak Productivity Window",
    description: "Your productivity peaks on Thursdays between 9-11am. Consider scheduling deep work then.",
    metric: "+23% focus score",
  },
  {
    id: "2",
    type: "recommendation",
    title: "Agent Balance Suggestion",
    description: "Code Agent is your most-used (45%). Consider engaging Research Agent more for balanced insights.",
    action: "View Agent Stats",
  },
  {
    id: "3",
    type: "opportunity",
    title: "Time Savings Calculation",
    description: "You've saved ~12h this week vs. manual work. That's $600 at your billing rate.",
    metric: "$600 saved",
  },
  {
    id: "4",
    type: "warning",
    title: "Knowledge Base Stale",
    description: "3 documents haven't been updated in 30+ days. Consider refreshing for better accuracy.",
    action: "Review Sources",
  },
];

const typeConfig = {
  productivity: {
    icon: Clock,
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/20",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  opportunity: {
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  warning: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
};

export function CouncilInsightsCard() {
  return (
    <Card variant="gradient-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-base">Council Insights</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">AI-Generated</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor} group cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                    {insight.metric && (
                      <Badge variant="success" className="text-[10px] shrink-0">
                        {insight.metric}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs p-0 h-auto mt-2 text-primary"
                    >
                      {insight.action}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
