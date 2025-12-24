import { motion } from "framer-motion";
import { BookOpen, Plus, FileText, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const sources = [
  { name: "Project Documentation.pdf", type: "pdf", size: "2.4 MB" },
  { name: "API Reference.md", type: "markdown", size: "156 KB" },
  { name: "Meeting Notes.txt", type: "text", size: "12 KB" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4 text-error" />;
    case "markdown":
      return <File className="w-4 h-4 text-info" />;
    case "image":
      return <Image className="w-4 h-4 text-success" />;
    default:
      return <File className="w-4 h-4 text-foreground-secondary" />;
  }
};

export function KnowledgeBaseCard() {
  const totalSources = 24;
  const indexedSources = 24;
  const progress = (indexedSources / totalSources) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card variant="gradient-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Knowledge Base
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <Plus className="w-3 h-3" />
              Add Source
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Progress Ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  strokeWidth="4"
                  stroke="hsl(var(--border))"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  strokeWidth="4"
                  stroke="hsl(var(--primary))"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 1.76} 176`}
                  className="drop-shadow-glow"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">
                  {indexedSources}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {indexedSources} sources indexed
              </p>
              <p className="text-xs text-foreground-tertiary">
                12.4 MB total storage used
              </p>
            </div>
          </div>

          {/* Recent Sources */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground-secondary mb-2">
              Recent Sources
            </p>
            {sources.map((source, index) => (
              <motion.div
                key={source.name}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-hover/50 transition-all cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
              >
                {getFileIcon(source.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {source.name}
                  </p>
                </div>
                <span className="text-[10px] text-foreground-tertiary">
                  {source.size}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
