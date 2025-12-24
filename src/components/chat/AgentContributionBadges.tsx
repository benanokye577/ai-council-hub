import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentContribution {
  name: string;
  expertise: string;
  contribution: number;
  color: string;
}

interface AgentContributionBadgesProps {
  contributions: AgentContribution[];
  compact?: boolean;
}

export function AgentContributionBadges({ contributions, compact = false }: AgentContributionBadgesProps) {
  // Sort by contribution percentage descending
  const sortedContributions = [...contributions].sort((a, b) => b.contribution - a.contribution);
  const topContributors = sortedContributions.slice(0, 2);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 mb-2">
        {topContributors.map((agent, idx) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
            style={{
              backgroundColor: `${agent.color}20`,
              border: `1px solid ${agent.color}40`,
            }}
          >
            <span
              className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
              style={{ backgroundColor: agent.color }}
            >
              {agent.name[0]}
            </span>
            <span className="text-foreground">{agent.name}</span>
            <span className="text-foreground-tertiary">{agent.contribution}%</span>
          </motion.div>
        ))}
        {sortedContributions.length > 2 && (
          <span className="text-[10px] text-foreground-tertiary">
            +{sortedContributions.length - 2} more
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-foreground-tertiary uppercase tracking-wider">
          Contributors
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedContributions.map((agent, idx) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg",
              "bg-background/50 border border-border/50"
            )}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: agent.color }}
            >
              {agent.name[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">{agent.name}</span>
              <span className="text-[9px] text-foreground-tertiary">{agent.expertise}</span>
            </div>
            <div className="flex flex-col items-end ml-2">
              <span className="text-xs font-semibold text-foreground">{agent.contribution}%</span>
              <div className="w-12 h-1 rounded-full bg-background-hover overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: agent.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.contribution}%` }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
