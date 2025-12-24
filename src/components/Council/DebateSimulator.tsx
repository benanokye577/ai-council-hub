import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Play,
  Pause,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Users,
  MessageSquare,
  Trophy,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMultiAgentDebate } from '@/hooks/useMultiAgentDebate';
import { cn } from '@/lib/utils';

interface DebateSimulatorProps {
  className?: string;
  onClose?: () => void;
}

export function DebateSimulator({ className, onClose }: DebateSimulatorProps) {
  const {
    debate,
    isSimulating,
    initializeDebate,
    startDebate,
    pauseDebate,
    resumeDebate,
    voteForAgent,
    simulateDebate,
    resetDebate,
  } = useMultiAgentDebate();

  const [topic, setTopic] = useState('');

  const handleStartDebate = () => {
    if (!topic.trim()) return;
    simulateDebate(topic.trim());
    setTopic('');
  };

  const getTotalVotes = () => {
    if (!debate) return 0;
    return Object.values(debate.votes).reduce((sum, v) => sum + v, 0);
  };

  const getAgentVotePercentage = (agentId: string) => {
    if (!debate) return 0;
    const total = getTotalVotes();
    if (total === 0) return 0;
    return ((debate.votes[agentId] || 0) / total) * 100;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <Swords className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Multi-Agent Debate</h2>
            <p className="text-sm text-foreground-secondary">
              AI personas discuss topics together
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Start New Debate */}
      {!debate && (
        <Card className="glass-card">
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Debate Topic</label>
              <Input
                placeholder="e.g., Should AI replace human jobs?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartDebate()}
              />
            </div>
            <Button
              className="w-full btn-gradient"
              onClick={handleStartDebate}
              disabled={!topic.trim() || isSimulating}
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Starting Debate...' : 'Start Debate'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Debate */}
      {debate && (
        <>
          {/* Topic & Status */}
          <Card className="glass-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant={debate.status === 'active' ? 'default' : 'secondary'}>
                    {debate.status === 'active' ? 'Live' : 
                     debate.status === 'concluded' ? 'Concluded' : 
                     debate.status === 'paused' ? 'Paused' : 'Setting Up'}
                  </Badge>
                  <CardTitle className="text-lg mt-2">{debate.topic}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {debate.status === 'active' && (
                    <Button variant="outline" size="sm" onClick={pauseDebate}>
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {debate.status === 'paused' && (
                    <Button variant="outline" size="sm" onClick={resumeDebate}>
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={resetDebate}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Users className="w-4 h-4" />
                {debate.agents.length} agents • {debate.rounds.length} statements
              </div>
            </CardContent>
          </Card>

          {/* Agents */}
          <div className="grid grid-cols-2 gap-4">
            {debate.agents.map((agent) => {
              const votePercentage = getAgentVotePercentage(agent.id);
              const isWinner = debate.winner === agent.id;
              
              return (
                <Card
                  key={agent.id}
                  className={cn(
                    'glass-card transition-all',
                    agent.speaking && 'ring-2 ring-primary',
                    isWinner && 'ring-2 ring-warning'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback style={{ backgroundColor: agent.persona.color + '30' }}>
                            {agent.persona.icon}
                          </AvatarFallback>
                        </Avatar>
                        {agent.speaking && (
                          <motion.div
                            className="absolute -inset-1 rounded-full border-2"
                            style={{ borderColor: agent.persona.color }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        )}
                        {isWinner && (
                          <div className="absolute -top-1 -right-1 bg-warning rounded-full p-0.5">
                            <Trophy className="w-3 h-3 text-warning-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{agent.persona.name}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            agent.position === 'for' && 'border-success/50 text-success',
                            agent.position === 'against' && 'border-error/50 text-error'
                          )}
                        >
                          {agent.position === 'for' ? 'For' : 'Against'}
                        </Badge>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground-secondary">Confidence</span>
                        <span>{Math.round(agent.confidence * 100)}%</span>
                      </div>
                      <Progress value={agent.confidence * 100} className="h-1" />
                    </div>

                    {/* Arguments */}
                    <div className="space-y-1 mb-3 max-h-24 overflow-y-auto">
                      {agent.arguments.slice(-2).map((arg, i) => (
                        <p key={i} className="text-xs text-foreground-secondary">
                          • {arg.slice(0, 80)}...
                        </p>
                      ))}
                    </div>

                    {/* Vote */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {debate.votes[agent.id] || 0} votes
                        </span>
                        <span className="text-xs text-foreground-tertiary">
                          ({Math.round(votePercentage)}%)
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => voteForAgent(agent.id)}
                        disabled={debate.status === 'concluded'}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Debate Rounds */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Debate Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {debate.rounds.map((round) => {
                  const agent = debate.agents.find(a => a.id === round.agentId);
                  if (!agent) return null;

                  return (
                    <motion.div
                      key={round.roundNumber}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'p-3 rounded-lg border',
                        agent.position === 'for' 
                          ? 'bg-success/5 border-success/20' 
                          : 'bg-error/5 border-error/20'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: agent.persona.color }}>
                          {agent.persona.icon} {agent.persona.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Round {round.roundNumber}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground-secondary">
                        {round.statement}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Synthesis */}
          {debate.synthesis && (
            <Card className="glass-card border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-secondary">
                  {debate.synthesis}
                </p>
                {debate.winner && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-sm">
                      Winner:{' '}
                      <span className="font-medium" style={{ 
                        color: debate.agents.find(a => a.id === debate.winner)?.persona.color 
                      }}>
                        {debate.agents.find(a => a.id === debate.winner)?.persona.name}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* New Debate Button */}
          {debate.status === 'concluded' && (
            <Button className="w-full" onClick={resetDebate}>
              <Swords className="w-4 h-4 mr-2" />
              Start New Debate
            </Button>
          )}
        </>
      )}
    </div>
  );
}
