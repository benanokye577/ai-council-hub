import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: string;
  type: "insight" | "opportunity" | "pattern";
  message: string;
  source: string;
  actionable?: boolean;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "pattern",
    message: "Based on your patterns, schedule deep work before 11am for best focus",
    source: "Aria (Strategy)",
    actionable: false,
  },
  {
    id: "2",
    type: "opportunity",
    message: "POLY-0x3f has 12% edge opportunity",
    source: "Marcus (Research)",
    actionable: true,
  },
];

const typeIcons = {
  insight: Lightbulb,
  opportunity: TrendingUp,
  pattern: Brain,
};

const typeColors = {
  insight: "text-warning",
  opportunity: "text-success",
  pattern: "text-info",
};

export function CouncilRecommendationsCard() {
  return (
    <Card variant="gradient-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <CardTitle className="text-base">Council Recommendations</CardTitle>
          </div>
          <Badge variant="gradient" className="text-[10px]">
            AI Insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRecommendations.map((rec, index) => {
          const Icon = typeIcons[rec.type];
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-background-hover/50 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${typeColors[rec.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {rec.message}
                  </p>
                  <p className="text-[11px] text-foreground-tertiary mt-1.5">
                    — {rec.source}
                  </p>
                </div>
              </div>
              {rec.actionable && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary-light">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
