import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Code,
  PenTool,
  BarChart2,
  Lightbulb,
  Microscope,
  Plus,
  Settings,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusIndicator } from "@/components/dashboard/AgentCard";
import { useNavigate } from "react-router-dom";

const agents = [
  {
    id: "research",
    name: "Research Agent",
    description: "Deep web research, fact-finding, and information synthesis",
    icon: Microscope,
    status: "online" as const,
    messageCount: 847,
    successRate: 98.5,
    avgResponse: "2.1s",
    capabilities: ["Web Search", "Fact Checking", "Source Analysis"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "code",
    name: "Code Agent",
    description: "Programming assistance, code review, and debugging",
    icon: Code,
    status: "online" as const,
    messageCount: 1203,
    successRate: 99.2,
    avgResponse: "1.8s",
    capabilities: ["Code Review", "Debugging", "Refactoring"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "writing",
    name: "Writing Agent",
    description: "Content creation, editing, and copywriting",
    icon: PenTool,
    status: "idle" as const,
    messageCount: 392,
    successRate: 97.8,
    avgResponse: "2.5s",
    capabilities: ["Blog Posts", "Copywriting", "Editing"],
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    description: "Data analysis, insights extraction, and reporting",
    icon: BarChart2,
    status: "online" as const,
    messageCount: 156,
    successRate: 99.1,
    avgResponse: "3.2s",
    capabilities: ["Data Analysis", "Visualization", "Reports"],
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "creative",
    name: "Creative Agent",
    description: "Brainstorming, ideation, and creative problem-solving",
    icon: Lightbulb,
    status: "offline" as const,
    messageCount: 89,
    successRate: 96.5,
    avgResponse: "2.8s",
    capabilities: ["Brainstorming", "Ideation", "Creative Writing"],
    color: "from-rose-500 to-red-600",
  },
];

interface AgentCardProps {
  agent: (typeof agents)[0];
}

function AgentGridCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();
  const Icon = agent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card variant="gradient-border" className="h-full hover:shadow-glow transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {agent.name}
                  </h3>
                  <StatusIndicator status={agent.status} size="sm" />
                </div>
                <p className="text-xs text-foreground-secondary capitalize">
                  {agent.status}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-foreground-secondary mb-4">
            {agent.description}
          </p>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="outline" className="text-[10px]">
                {cap}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-border-subtle">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <MessageSquare className="w-3 h-3 text-foreground-tertiary" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {agent.messageCount.toLocaleString()}
              </p>
              <p className="text-[10px] text-foreground-tertiary">Messages</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <TrendingUp className="w-3 h-3 text-foreground-tertiary" />
              </div>
              <p className="text-sm font-semibold text-success">
                {agent.successRate}%
              </p>
              <p className="text-[10px] text-foreground-tertiary">Success</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Zap className="w-3 h-3 text-foreground-tertiary" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {agent.avgResponse}
              </p>
              <p className="text-[10px] text-foreground-tertiary">Avg Time</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="gradient"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              Chat
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CreateAgentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        variant="glass"
        className="h-full border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-all duration-300 group"
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
          <div className="w-16 h-16 rounded-2xl bg-background-hover flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8 text-foreground-tertiary group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Create Custom Agent
          </h3>
          <p className="text-sm text-foreground-secondary text-center max-w-[200px]">
            Design your own specialized AI agent with custom capabilities
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-h1 text-foreground mb-2">Agent Council</h1>
        <p className="text-foreground-secondary">
          Manage and configure your specialized AI agents
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
          <Input
            variant="glass"
            placeholder="Search agents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />3 Online
          </Badge>
          <Badge variant="warning" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />1 Idle
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground-tertiary" />1
            Offline
          </Badge>
        </div>
      </motion.div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            <AgentGridCard agent={agent} />
          </motion.div>
        ))}
        <CreateAgentCard />
      </div>
    </div>
  );
}
