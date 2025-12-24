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
  Crown,
  Scale,
  Users,
  Gavel,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type CouncilStatus = "active" | "recused" | "disabled";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof Microscope;
  status: CouncilStatus;
  voteWeight: number;
  specialty: string;
  contributions: number;
  color: string;
}

const agents: Agent[] = [
  {
    id: "research",
    name: "Research Agent",
    description: "Deep web research, fact-finding, and information synthesis",
    icon: Microscope,
    status: "active",
    voteWeight: 80,
    specialty: "Facts & Data",
    contributions: 847,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "code",
    name: "Code Agent",
    description: "Programming assistance, code review, and debugging",
    icon: Code,
    status: "active",
    voteWeight: 90,
    specialty: "Technical Solutions",
    contributions: 1203,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "writing",
    name: "Writing Agent",
    description: "Content creation, editing, and copywriting",
    icon: PenTool,
    status: "recused",
    voteWeight: 75,
    specialty: "Communication",
    contributions: 392,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    description: "Data analysis, insights extraction, and reporting",
    icon: BarChart2,
    status: "active",
    voteWeight: 85,
    specialty: "Analytics & Insights",
    contributions: 156,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "creative",
    name: "Creative Agent",
    description: "Brainstorming, ideation, and creative problem-solving",
    icon: Lightbulb,
    status: "disabled",
    voteWeight: 70,
    specialty: "Innovation",
    contributions: 89,
    color: "from-rose-500 to-red-600",
  },
];

const statusConfig: Record<CouncilStatus, { label: string; variant: "success" | "warning" | "outline"; icon: string }> = {
  active: { label: "Active on Council", variant: "success", icon: "●" },
  recused: { label: "Recused", variant: "warning", icon: "○" },
  disabled: { label: "Disabled", variant: "outline", icon: "◌" },
};

function CouncilSettings() {
  const [votingMode, setVotingMode] = useState("weighted");
  const [quorum, setQuorum] = useState("3");
  const [tieBreaker, setTieBreaker] = useState("research");

  const activeAgents = agents.filter((a) => a.status === "active").length;

  return (
    <Card variant="gradient-border" className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Scale className="w-4 h-4 text-primary-foreground" />
          </div>
          <CardTitle className="text-base">Council Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-foreground-secondary font-medium">
              Voting Mode
            </label>
            <Select value={votingMode} onValueChange={setVotingMode}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weighted">Weighted</SelectItem>
                <SelectItem value="equal">Equal</SelectItem>
                <SelectItem value="expertise">Expertise-Based</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-foreground-tertiary">
              How agent votes are counted
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-foreground-secondary font-medium">
              Quorum
            </label>
            <Select value={quorum} onValueChange={setQuorum}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 agents</SelectItem>
                <SelectItem value="3">3 agents</SelectItem>
                <SelectItem value="4">4 agents</SelectItem>
                <SelectItem value="all">All active</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-foreground-tertiary">
              Minimum agents for decisions ({activeAgents} active)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-foreground-secondary font-medium">
              Tie Breaker
            </label>
            <Select value={tieBreaker} onValueChange={setTieBreaker}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents
                  .filter((a) => a.status === "active")
                  .map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-foreground-tertiary">
              Agent with deciding vote on ties
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentCouncilCard({ agent }: { agent: Agent }) {
  const [isRecusing, setIsRecusing] = useState(false);
  const Icon = agent.icon;
  const status = statusConfig[agent.status];

  const handleRecuse = () => {
    setIsRecusing(true);
    setTimeout(() => setIsRecusing(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card
        variant="gradient-border"
        className={cn(
          "h-full transition-all duration-300",
          agent.status === "active" && "hover:shadow-glow",
          agent.status === "disabled" && "opacity-60"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-shadow",
                  agent.status === "active"
                    ? `bg-gradient-to-br ${agent.color} group-hover:shadow-glow`
                    : "bg-background-hover"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    agent.status === "active"
                      ? "text-white"
                      : "text-foreground-tertiary"
                  )}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {agent.name}
                  </h3>
                </div>
                <Badge variant={status.variant} className="text-[10px] mt-1">
                  {status.icon} {status.label}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-foreground-secondary mb-4">
            {agent.description}
          </p>

          {/* Vote Weight */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-foreground-secondary font-medium">
                Vote Weight
              </span>
              <span className="text-xs font-semibold text-foreground">
                {agent.voteWeight}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-background-hover overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  agent.status === "active"
                    ? "bg-gradient-primary"
                    : "bg-foreground-tertiary"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${agent.voteWeight}%` }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-foreground-tertiary mt-1">
              Expertise-based influence
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-border-subtle">
            <div>
              <p className="text-[10px] text-foreground-tertiary uppercase tracking-wider mb-0.5">
                Specialty
              </p>
              <p className="text-sm font-medium text-foreground">
                {agent.specialty}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-foreground-tertiary uppercase tracking-wider mb-0.5">
                Contributions
              </p>
              <p className="text-sm font-medium text-foreground">
                {agent.contributions.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={agent.status === "disabled"}
            >
              <Settings className="w-3.5 h-3.5 mr-1" />
              Configure
            </Button>
            {agent.status === "active" ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-warning hover:text-warning"
                onClick={handleRecuse}
                disabled={isRecusing}
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Recuse
              </Button>
            ) : agent.status === "recused" ? (
              <Button variant="gradient" size="sm" className="flex-1">
                <Users className="w-3.5 h-3.5 mr-1" />
                Reinstate
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Disabled
              </Button>
            )}
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
        <div className="flex flex-col items-center justify-center h-full min-h-[340px] p-6">
          <div className="w-16 h-16 rounded-2xl bg-background-hover flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8 text-foreground-tertiary group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Add Council Member
          </h3>
          <p className="text-sm text-foreground-secondary text-center max-w-[200px]">
            Create a new specialized agent to join the council
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = agents.filter((a) => a.status === "active").length;
  const recusedCount = agents.filter((a) => a.status === "recused").length;
  const disabledCount = agents.filter((a) => a.status === "disabled").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-primary" />
          <h1 className="text-h1 text-foreground">Agent Council</h1>
        </div>
        <p className="text-foreground-secondary">
          Manage your council of specialized AI advisors. All queries are deliberated by the council.
        </p>
      </motion.div>

      {/* Council Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <CouncilSettings />
      </motion.div>

      {/* Search and Status */}
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
            placeholder="Search council members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {activeCount} Active
          </Badge>
          <Badge variant="warning" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            {recusedCount} Recused
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground-tertiary" />
            {disabledCount} Disabled
          </Badge>
        </div>
      </motion.div>

      {/* Council Note */}
      <motion.div
        className="mb-6 p-4 rounded-lg glass-card border border-primary/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-start gap-3">
          <Gavel className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground">
              <span className="font-medium">Council Deliberation Mode:</span>{" "}
              When you ask a question, all active council members contribute based on their expertise.
              Voting weights determine final recommendations.
            </p>
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 h-auto mt-1"
              onClick={() => navigate("/chat")}
            >
              Start a Council Session →
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <AgentCouncilCard agent={agent} />
          </motion.div>
        ))}
        <CreateAgentCard />
      </div>
    </div>
  );
}
