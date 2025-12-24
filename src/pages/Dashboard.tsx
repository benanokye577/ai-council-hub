import { motion } from "framer-motion";
import { Search, Code, PenTool, ArrowRight, Users } from "lucide-react";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { QuickChatCard } from "@/components/dashboard/QuickChatCard";
import { UsageAnalyticsCard } from "@/components/dashboard/UsageAnalyticsCard";
import { RecentConversationsCard } from "@/components/dashboard/RecentConversationsCard";
import { KnowledgeBaseCard } from "@/components/dashboard/KnowledgeBaseCard";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";
import { TodaysFocusCard } from "@/components/dashboard/TodaysFocusCard";
import { CouncilRecommendationsCard } from "@/components/dashboard/CouncilRecommendationsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const agents = [
  {
    name: "Research Agent",
    specialty: "Deep web research and fact-finding",
    status: "online" as const,
    messageCount: 847,
    icon: Search,
    lastActive: "Active now",
  },
  {
    name: "Code Agent",
    specialty: "Programming assistant and code reviewer",
    status: "online" as const,
    messageCount: 1203,
    icon: Code,
    lastActive: "2m ago",
  },
  {
    name: "Writing Agent",
    specialty: "Content creation and editing",
    status: "idle" as const,
    messageCount: 392,
    icon: PenTool,
    lastActive: "1h ago",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-h1 text-foreground mb-2">
          Good evening, <span className="gradient-text">John</span>
        </h1>
        <p className="text-foreground-secondary">
          Your AI council is ready to assist. What would you like to accomplish today?
        </p>
      </motion.div>

      {/* Today's Focus + Council Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <TodaysFocusCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CouncilRecommendationsCard />
        </motion.div>
      </div>

      {/* Active Agents Section */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-h3 text-foreground">Active Agents</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary-light"
            onClick={() => navigate("/agents")}
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <AgentCard {...agent} onClick={() => navigate("/chat")} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickChatCard />
          <RecentConversationsCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UsageAnalyticsCard />
          <KnowledgeBaseCard />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
}
