import { motion } from "framer-motion";
import { Swords, ThumbsUp, ThumbsDown, Scale, Lightbulb, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Argument {
  id: string;
  agent: string;
  agentColor: string;
  position: 'for' | 'against';
  points: string[];
  confidence: number;
  votes: number;
}

interface DebateArenaProps {
  topic: string;
  arguments: Argument[];
  synthesis?: string;
  status: 'active' | 'concluded';
  onVote?: (argumentId: string, vote: 'up' | 'down') => void;
  onNewDebate?: () => void;
  onSaveSynthesis?: () => void;
  className?: string;
}

export function DebateArena({
  topic,
  arguments: args,
  synthesis,
  status,
  onVote,
  onNewDebate,
  onSaveSynthesis,
  className,
}: DebateArenaProps) {
  const forArguments = args.filter(a => a.position === 'for');
  const againstArguments = args.filter(a => a.position === 'against');

  const forVotes = forArguments.reduce((sum, a) => sum + a.votes, 0);
  const againstVotes = againstArguments.reduce((sum, a) => sum + a.votes, 0);
  const totalVotes = forVotes + againstVotes || 1;
  const forPercentage = (forVotes / totalVotes) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <CardHeader className="relative pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Swords className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <Badge variant={status === 'active' ? 'default' : 'secondary'} className="mb-1">
                {status === 'active' ? 'Live Debate' : 'Concluded'}
              </Badge>
              <CardTitle className="text-lg">{topic}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Vote bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-success font-medium">For: {forVotes}</span>
              <span className="text-error font-medium">Against: {againstVotes}</span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-error/30">
              <motion.div
                className="absolute inset-y-0 left-0 bg-success"
                initial={{ width: 0 }}
                animate={{ width: `${forPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arguments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* For Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-success">
            <ThumbsUp className="w-4 h-4" />
            <span className="font-medium">Arguments For</span>
          </div>
          {forArguments.map((arg) => (
            <ArgumentCard
              key={arg.id}
              argument={arg}
              onVote={onVote}
            />
          ))}
        </div>

        {/* Against Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-error">
            <ThumbsDown className="w-4 h-4" />
            <span className="font-medium">Arguments Against</span>
          </div>
          {againstArguments.map((arg) => (
            <ArgumentCard
              key={arg.id}
              argument={arg}
              onVote={onVote}
            />
          ))}
        </div>
      </div>

      {/* Synthesis */}
      {synthesis && (
        <Card className="glass-card border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              Council Synthesis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground-secondary">{synthesis}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex-1" onClick={onNewDebate}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Start New Debate
        </Button>
        {synthesis && (
          <Button className="flex-1 btn-gradient" onClick={onSaveSynthesis}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Save Conclusion
          </Button>
        )}
      </div>
    </div>
  );
}

function ArgumentCard({
  argument,
  onVote,
}: {
  argument: Argument;
  onVote?: (id: string, vote: 'up' | 'down') => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card rounded-lg p-4 border",
        argument.position === 'for' 
          ? "border-success/20" 
          : "border-error/20"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ borderColor: argument.agentColor, color: argument.agentColor }}
        >
          {argument.agent}
        </Badge>
        <span className="text-xs text-foreground-tertiary">
          {Math.round(argument.confidence * 100)}% confident
        </span>
      </div>

      <ul className="space-y-1.5 mb-3">
        {argument.points.map((point, i) => (
          <li key={i} className="text-sm text-foreground-secondary flex items-start gap-2">
            <span className="text-foreground-tertiary">•</span>
            {point}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground-tertiary">
          {argument.votes} votes
        </span>
        {onVote && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
              onClick={() => onVote(argument.id, 'up')}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-error hover:text-error hover:bg-error/10"
              onClick={() => onVote(argument.id, 'down')}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
