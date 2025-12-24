import { motion } from "framer-motion";
import { Search, Code, PenTool, ArrowRight, MessageSquare } from "lucide-react";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { QuickChatCard } from "@/components/dashboard/QuickChatCard";
import { RecentConversationsCard } from "@/components/dashboard/RecentConversationsCard";
import { KnowledgeBaseCard } from "@/components/dashboard/KnowledgeBaseCard";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";
import { TodaysFocusCard } from "@/components/dashboard/TodaysFocusCard";
import { CouncilHeroCard } from "@/components/dashboard/CouncilHeroCard";
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
    nickname: "The Fact-Finder",
  },
  {
    name: "Code Agent",
    specialty: "Programming assistant and code reviewer",
    status: "online" as const,
    messageCount: 1203,
    icon: Code,
    lastActive: "2m ago",
    nickname: "The Builder",
  },
  {
    name: "Writing Agent",
    specialty: "Content creation and editing",
    status: "idle" as const,
    messageCount: 392,
    icon: PenTool,
    lastActive: "1h ago",
    nickname: "The Wordsmith",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner with prominent CTA */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h1 text-foreground mb-2">
              Good evening, <span className="gradient-text">John</span>
            </h1>
            <p className="text-foreground-secondary">
              Your AI council is assembled and ready. What shall we deliberate on today?
            </p>
          </div>
          <Button
            variant="gradient"
            size="lg"
            className="gap-2 shrink-0"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="w-5 h-5" />
            Quick Chat
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Hero Section: Council Chamber */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <CouncilHeroCard />
      </motion.div>

      {/* Today's Focus + Quick Chat Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TodaysFocusCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <QuickChatCard />
        </motion.div>
      </div>

      {/* Active Agents Section */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-foreground">Your Council Members</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary-light"
            onClick={() => navigate("/agents")}
          >
            Manage Council
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
            >
              <AgentCard {...agent} onClick={() => navigate("/chat")} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentConversationsCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <KnowledgeBaseCard />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
}
