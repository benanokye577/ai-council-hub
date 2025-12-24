import { useState, useCallback } from 'react';
import { VOICE_PERSONAS, VoicePersona } from '@/types/voicePersona';

export interface DebateAgent {
  id: string;
  persona: VoicePersona;
  position: 'for' | 'against' | 'neutral';
  arguments: string[];
  confidence: number;
  speaking: boolean;
}

export interface DebateRound {
  roundNumber: number;
  agentId: string;
  statement: string;
  timestamp: Date;
  rebuttalTo?: string;
}

export interface Debate {
  id: string;
  topic: string;
  status: 'setup' | 'active' | 'paused' | 'concluded';
  agents: DebateAgent[];
  rounds: DebateRound[];
  synthesis?: string;
  winner?: string;
  votes: Record<string, number>;
  createdAt: Date;
  endedAt?: Date;
}

export function useMultiAgentDebate() {
  const [debate, setDebate] = useState<Debate | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const initializeDebate = useCallback((topic: string, agentCount: number = 2) => {
    // Select random personas for the debate
    const shuffled = [...VOICE_PERSONAS].sort(() => Math.random() - 0.5);
    const selectedPersonas = shuffled.slice(0, Math.min(agentCount, 4));

    const agents: DebateAgent[] = selectedPersonas.map((persona, index) => ({
      id: crypto.randomUUID(),
      persona,
      position: index % 2 === 0 ? 'for' : 'against',
      arguments: [],
      confidence: 0.5 + Math.random() * 0.3,
      speaking: false,
    }));

    const newDebate: Debate = {
      id: crypto.randomUUID(),
      topic,
      status: 'setup',
      agents,
      rounds: [],
      votes: {},
      createdAt: new Date(),
    };

    setDebate(newDebate);
    return newDebate;
  }, []);

  const startDebate = useCallback(() => {
    setDebate(prev => prev ? { ...prev, status: 'active' } : null);
  }, []);

  const pauseDebate = useCallback(() => {
    setDebate(prev => prev ? { ...prev, status: 'paused' } : null);
  }, []);

  const resumeDebate = useCallback(() => {
    setDebate(prev => prev ? { ...prev, status: 'active' } : null);
  }, []);

  const addRound = useCallback((agentId: string, statement: string, rebuttalTo?: string) => {
    setDebate(prev => {
      if (!prev) return null;

      const newRound: DebateRound = {
        roundNumber: prev.rounds.length + 1,
        agentId,
        statement,
        timestamp: new Date(),
        rebuttalTo,
      };

      // Update agent arguments
      const updatedAgents = prev.agents.map(agent => {
        if (agent.id === agentId) {
          return {
            ...agent,
            arguments: [...agent.arguments, statement],
            confidence: Math.min(0.95, agent.confidence + 0.05),
          };
        }
        return agent;
      });

      return {
        ...prev,
        agents: updatedAgents,
        rounds: [...prev.rounds, newRound],
      };
    });
  }, []);

  const setAgentSpeaking = useCallback((agentId: string, speaking: boolean) => {
    setDebate(prev => {
      if (!prev) return null;
      return {
        ...prev,
        agents: prev.agents.map(agent =>
          agent.id === agentId ? { ...agent, speaking } : { ...agent, speaking: false }
        ),
      };
    });
  }, []);

  const voteForAgent = useCallback((agentId: string) => {
    setDebate(prev => {
      if (!prev) return null;
      return {
        ...prev,
        votes: {
          ...prev.votes,
          [agentId]: (prev.votes[agentId] || 0) + 1,
        },
      };
    });
  }, []);

  const concludeDebate = useCallback((synthesis: string) => {
    setDebate(prev => {
      if (!prev) return null;

      // Determine winner based on votes and confidence
      let winnerId: string | undefined;
      let maxScore = 0;

      prev.agents.forEach(agent => {
        const votes = prev.votes[agent.id] || 0;
        const score = votes * 0.6 + agent.confidence * 0.4 * agent.arguments.length;
        if (score > maxScore) {
          maxScore = score;
          winnerId = agent.id;
        }
      });

      return {
        ...prev,
        status: 'concluded',
        synthesis,
        winner: winnerId,
        endedAt: new Date(),
      };
    });
  }, []);

  const simulateDebate = useCallback(async (topic: string) => {
    setIsSimulating(true);
    const newDebate = initializeDebate(topic, 2);
    
    if (!newDebate) {
      setIsSimulating(false);
      return;
    }

    // Simulate debate rounds with pre-defined arguments
    const forArguments = [
      `The core principle behind ${topic} offers significant benefits that we cannot ignore.`,
      `Historical evidence shows that similar approaches have led to positive outcomes.`,
      `From a practical standpoint, implementing this would solve key challenges we face.`,
    ];

    const againstArguments = [
      `While the idea has merit, the potential risks outweigh the benefits.`,
      `We must consider the unintended consequences that could arise from this approach.`,
      `Alternative solutions exist that would achieve the same goals with fewer drawbacks.`,
    ];

    startDebate();

    // Simulate rounds with delays
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const forAgent = newDebate.agents.find(a => a.position === 'for');
      const againstAgent = newDebate.agents.find(a => a.position === 'against');

      if (forAgent) {
        setAgentSpeaking(forAgent.id, true);
        await new Promise(resolve => setTimeout(resolve, 500));
        addRound(forAgent.id, forArguments[i]);
        setAgentSpeaking(forAgent.id, false);
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      if (againstAgent) {
        setAgentSpeaking(againstAgent.id, true);
        await new Promise(resolve => setTimeout(resolve, 500));
        addRound(againstAgent.id, againstArguments[i], forAgent?.id);
        setAgentSpeaking(againstAgent.id, false);
      }
    }

    // Conclude with synthesis
    await new Promise(resolve => setTimeout(resolve, 1000));
    concludeDebate(
      `After examining both perspectives on "${topic}", it's clear that this is a nuanced issue. ` +
      `The proponents make valid points about potential benefits, while critics raise legitimate concerns. ` +
      `A balanced approach that addresses both sides' concerns would likely yield the best results.`
    );

    setIsSimulating(false);
  }, [initializeDebate, startDebate, setAgentSpeaking, addRound, concludeDebate]);

  const resetDebate = useCallback(() => {
    setDebate(null);
    setIsSimulating(false);
  }, []);

  return {
    debate,
    isSimulating,
    initializeDebate,
    startDebate,
    pauseDebate,
    resumeDebate,
    addRound,
    setAgentSpeaking,
    voteForAgent,
    concludeDebate,
    simulateDebate,
    resetDebate,
  };
}
