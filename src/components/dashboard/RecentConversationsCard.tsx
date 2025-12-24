import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const conversations = [
  {
    id: 1,
    title: "Help me refactor this React component",
    agent: "Code Agent",
    agentColor: "info",
    timestamp: "2 min ago",
    preview: "Sure! Let me analyze the component structure...",
  },
  {
    id: 2,
    title: "Research latest AI developments",
    agent: "Research Agent",
    agentColor: "success",
    timestamp: "1 hour ago",
    preview: "I found several key developments in the AI space...",
  },
  {
    id: 3,
    title: "Write a blog post about productivity",
    agent: "Writing Agent",
    agentColor: "warning",
    timestamp: "3 hours ago",
    preview: "Here's an outline for your productivity blog post...",
  },
  {
    id: 4,
    title: "Analyze this sales data",
    agent: "Analysis Agent",
    agentColor: "default",
    timestamp: "Yesterday",
    preview: "Based on the data, I can see a clear upward trend...",
  },
];

export function RecentConversationsCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card variant="gradient-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Recent Conversations
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-primary-light"
              onClick={() => navigate("/chat")}
            >
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-background-hover/50 cursor-pointer transition-all"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                whileHover={{ x: 2 }}
                onClick={() => navigate("/chat")}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {conv.title}
                    </h4>
                    <Badge
                      variant={conv.agentColor as any}
                      className="text-[10px] px-1.5 py-0 shrink-0"
                    >
                      {conv.agent}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground-secondary truncate">
                    {conv.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-foreground-tertiary">
                    <Clock className="w-3 h-3" />
                    {conv.timestamp}
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
