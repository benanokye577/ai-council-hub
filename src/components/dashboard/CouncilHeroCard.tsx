import { motion, AnimatePresence } from "framer-motion";
import { Scale, CheckCircle2, Loader2, PenLine, Users, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CouncilAgent {
  id: string;
  name: string;
  nickname: string;
  status: "active" | "thinking" | "idle" | "recused";
  expertise: string;
  color: string;
  avatar: string;
  lastActivity?: string;
  contributionToday: number;
}

const councilAgents: CouncilAgent[] = [
  {
    id: "aria",
    name: "Aria",
    nickname: "The Strategist",
    status: "active",
    expertise: "Strategy & Planning",
    color: "hsl(var(--primary))",
    avatar: "A",
    lastActivity: "Analyzing your request...",
    contributionToday: 45,
  },
  {
    id: "marcus",
    name: "Marcus",
    nickname: "The Fact-Finder",
    status: "thinking",
    expertise: "Research & Data",
    color: "hsl(280, 70%, 60%)",
    avatar: "M",
    lastActivity: "Verifying sources",
    contributionToday: 32,
  },
  {
    id: "echo",
    name: "Echo",
    nickname: "The Builder",
    status: "active",
    expertise: "Code & Technical",
    color: "hsl(200, 70%, 60%)",
    avatar: "E",
    lastActivity: "Ready to code",
    contributionToday: 58,
  },
  {
    id: "nova",
    name: "Nova",
    nickname: "The Creator",
    status: "idle",
    expertise: "Creative & Writing",
    color: "hsl(340, 70%, 60%)",
    avatar: "N",
    lastActivity: "Idle",
    contributionToday: 18,
  },
];

function AgentAvatar({ agent, index }: { agent: CouncilAgent; index: number }) {
  const getStatusIcon = () => {
    switch (agent.status) {
      case "active":
        return <CheckCircle2 className="w-2.5 h-2.5 text-success" />;
      case "thinking":
        return <Loader2 className="w-2.5 h-2.5 text-warning animate-spin" />;
      case "recused":
        return <PenLine className="w-2.5 h-2.5 text-foreground-tertiary" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1, y: -4 }}
    >
      {/* Avatar with breathing animation for thinking state */}
      <motion.div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg relative overflow-hidden",
          agent.status === "thinking" && "animate-pulse"
        )}
        style={{ backgroundColor: agent.color }}
        animate={
          agent.status === "active"
            ? {
                boxShadow: [
                  `0 0 0 0 ${agent.color}40`,
                  `0 0 20px 4px ${agent.color}40`,
                  `0 0 0 0 ${agent.color}40`,
                ],
              }
            : {}
        }
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {agent.avatar}
        
        {/* Shimmer effect for thinking */}
        {agent.status === "thinking" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* Status indicator */}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background flex items-center justify-center">
        {getStatusIcon()}
      </div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card px-3 py-2 rounded-lg border border-border whitespace-nowrap">
            <p className="text-xs font-semibold text-foreground">{agent.name}</p>
            <p className="text-[10px] text-primary">{agent.nickname}</p>
            <p className="text-[10px] text-foreground-tertiary">{agent.expertise}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CouncilProgress() {
  const totalContributions = councilAgents.reduce((acc, a) => acc + a.contributionToday, 0);
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-foreground-secondary">Today's Activity</span>
        <span className="text-xs font-medium text-foreground">{totalContributions} contributions</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-background-hover">
        {councilAgents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            className="h-full"
            style={{ backgroundColor: agent.color }}
            initial={{ width: 0 }}
            animate={{ width: `${(agent.contributionToday / totalContributions) * 100}%` }}
            transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {councilAgents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color }}
            />
            <span className="text-[10px] text-foreground-tertiary">{agent.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CouncilHeroCard() {
  const navigate = useNavigate();
  const activeCount = councilAgents.filter((a) => a.status === "active" || a.status === "thinking").length;

  return (
    <Card variant="gradient-border" className="relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Council Chamber</CardTitle>
              <p className="text-xs text-foreground-secondary">
                {activeCount} advisors ready • Real-time deliberation
              </p>
            </div>
          </div>
          <Badge variant="success" className="gap-1.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-success"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            Session Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {/* Council Seating Visualization */}
        <div className="flex justify-center items-end gap-4 py-6">
          {councilAgents.map((agent, index) => (
            <AgentAvatar key={agent.id} agent={agent} index={index} />
          ))}
        </div>

        {/* Current Activity */}
        <div className="glass-card rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Live Activity</span>
          </div>
          <div className="space-y-1.5">
            {councilAgents
              .filter((a) => a.status === "active" || a.status === "thinking")
              .map((agent) => (
                <motion.div
                  key={agent.id}
                  className="flex items-center gap-2 text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.avatar}
                  </span>
                  <span className="text-foreground-secondary">
                    <span className="text-foreground font-medium">{agent.name}</span>{" "}
                    {agent.lastActivity}
                  </span>
                  {agent.status === "thinking" && (
                    <motion.span
                      className="flex gap-0.5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <span className="w-1 h-1 rounded-full bg-warning" />
                      <span className="w-1 h-1 rounded-full bg-warning" />
                      <span className="w-1 h-1 rounded-full bg-warning" />
                    </motion.span>
                  )}
                </motion.div>
              ))}
          </div>
        </div>

        {/* Progress visualization */}
        <CouncilProgress />

        {/* CTA */}
        <Button
          variant="gradient"
          className="w-full mt-4 gap-2"
          onClick={() => navigate("/chat")}
        >
          <Users className="w-4 h-4" />
          Start Council Session
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
