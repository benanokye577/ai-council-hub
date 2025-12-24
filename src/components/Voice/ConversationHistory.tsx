import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  messages: ConversationMessage[];
  className?: string;
  reducedMotion?: boolean;
}

export function ConversationHistory({ messages, className, reducedMotion = false }: ConversationHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-muted-foreground", className)}>
        <Clock className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No conversation yet</p>
        <p className="text-xs mt-1">Press spacebar or tap to start</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", className)} ref={scrollRef}>
      <div className="space-y-3 p-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className={cn(
                "flex gap-3 p-3 rounded-lg",
                message.role === 'user' 
                  ? "bg-secondary/30 border border-border/30" 
                  : "bg-primary/10 border border-primary/20"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                message.role === 'user' ? "bg-secondary" : "bg-primary/20"
              )}>
                {message.role === 'user' ? (
                  <Mic className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-3 h-3 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground break-words">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
