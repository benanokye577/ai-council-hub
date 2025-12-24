import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AgentStream {
  id: string;
  name: string;
  role: string;
  color: string;
  content: string;
  isStreaming: boolean;
  isComplete: boolean;
}

const initialAgents: AgentStream[] = [
  { id: '1', name: 'Strategist', role: 'Planning & Architecture', color: 'hsl(var(--primary))', content: '', isStreaming: false, isComplete: false },
  { id: '2', name: 'Developer', role: 'Implementation', color: 'hsl(var(--workflow-action))', content: '', isStreaming: false, isComplete: false },
  { id: '3', name: 'Critic', role: 'Review & Critique', color: 'hsl(var(--workflow-condition))', content: '', isStreaming: false, isComplete: false },
  { id: '4', name: 'Researcher', role: 'Context & Knowledge', color: 'hsl(var(--success))', content: '', isStreaming: false, isComplete: false },
];

interface MultiAgentStreamProps {
  isActive?: boolean;
  onComplete?: (synthesis: string) => void;
  className?: string;
}

export function MultiAgentStream({ isActive = false, onComplete, className }: MultiAgentStreamProps) {
  const [agents, setAgents] = useState(initialAgents);
  const [synthesis, setSynthesis] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Simulate streaming when active
  useEffect(() => {
    if (!isActive) {
      setAgents(initialAgents);
      setSynthesis('');
      setIsSynthesizing(false);
      return;
    }

    const responses = [
      "Based on the requirements, I recommend a modular architecture with clear separation of concerns. We should use a service-oriented design pattern to ensure scalability and maintainability.",
      "I'll implement this using TypeScript with React hooks for state management. The core logic will be abstracted into custom hooks for reusability across components.",
      "Consider edge cases around concurrent updates and race conditions. We should add proper error boundaries and loading states to handle network failures gracefully.",
      "From my research, similar implementations use WebSocket connections for real-time updates. The ElevenLabs API supports streaming responses which aligns with our UX goals.",
    ];

    // Start streaming for each agent with delays
    agents.forEach((agent, index) => {
      const startDelay = index * 800;
      const response = responses[index];
      
      setTimeout(() => {
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, isStreaming: true } : a
        ));
        
        // Simulate token-by-token streaming
        let charIndex = 0;
        const streamInterval = setInterval(() => {
          if (charIndex >= response.length) {
            clearInterval(streamInterval);
            setAgents(prev => prev.map(a => 
              a.id === agent.id ? { ...a, isStreaming: false, isComplete: true } : a
            ));
            return;
          }
          
          setAgents(prev => prev.map(a => 
            a.id === agent.id ? { ...a, content: response.slice(0, charIndex + 3) } : a
          ));
          charIndex += 3;
        }, 30);
      }, startDelay);
    });

    // Synthesis after all complete
    const synthesisDelay = agents.length * 800 + 3000;
    setTimeout(() => {
      setIsSynthesizing(true);
      
      const synthesisText = "The council recommends implementing a modular, service-oriented architecture using TypeScript and React hooks. Real-time features should leverage WebSocket connections with proper error handling and loading states. This approach balances scalability with maintainability while addressing potential edge cases.";
      
      let charIndex = 0;
      const synthesisInterval = setInterval(() => {
        if (charIndex >= synthesisText.length) {
          clearInterval(synthesisInterval);
          setIsSynthesizing(false);
          onComplete?.(synthesisText);
          return;
        }
        
        setSynthesis(synthesisText.slice(0, charIndex + 2));
        charIndex += 2;
      }, 20);
    }, synthesisDelay);
  }, [isActive]);

  const allComplete = agents.every(a => a.isComplete);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Agent Streams Grid */}
      <div className="grid grid-cols-2 gap-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-lg border bg-card overflow-hidden transition-all",
              agent.isStreaming && "ring-2",
              agent.isComplete && "opacity-80"
            )}
            style={{ 
              borderColor: agent.isStreaming ? agent.color : 'hsl(var(--border))',
              boxShadow: agent.isStreaming ? `0 0 15px ${agent.color}30` : undefined
            }}
          >
            {/* Agent Header */}
            <div 
              className="px-3 py-2 flex items-center gap-2 border-b border-border/50"
              style={{ backgroundColor: `${agent.color}10` }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: agent.color }}
              />
              <span className="text-xs font-semibold" style={{ color: agent.color }}>
                {agent.name}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {agent.role}
              </span>
              {agent.isStreaming && (
                <Loader2 className="w-3 h-3 animate-spin" style={{ color: agent.color }} />
              )}
            </div>

            {/* Agent Content */}
            <ScrollArea className="h-28">
              <div className="p-3">
                {agent.content ? (
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {agent.content}
                    {agent.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
                    )}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isActive ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <span>Waiting...</span>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        ))}
      </div>

      {/* Synthesis Panel */}
      <AnimatePresence>
        {(isSynthesizing || synthesis) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-primary/30 bg-primary/5 overflow-hidden"
          >
            <div className="px-4 py-2 flex items-center gap-2 border-b border-primary/20 bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Council Synthesis</span>
              {isSynthesizing && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-auto" />
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {synthesis}
                {isSynthesizing && (
                  <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}