import { useEffect, useState } from 'react';
import { Clock, MessageSquare, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationMessage } from './ConversationHistory';

interface SessionStatsProps {
  isActive: boolean;
  messages: ConversationMessage[];
  className?: string;
}

export function SessionStats({ isActive, messages, className }: SessionStatsProps) {
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Track session duration
  useEffect(() => {
    if (isActive && !startTime) {
      setStartTime(Date.now());
    } else if (!isActive && startTime) {
      setStartTime(null);
    }
  }, [isActive, startTime]);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userMessages = messages.filter(m => m.role === 'user').length;
  const assistantMessages = messages.filter(m => m.role === 'assistant').length;
  const totalWords = messages.reduce((acc, m) => acc + m.content.split(' ').length, 0);

  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-lg bg-secondary/30 border border-border/30",
      className
    )}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono text-foreground/80">
          {formatDuration(duration)}
        </span>
      </div>
      
      <div className="w-px h-4 bg-border" />
      
      <div className="flex items-center gap-2">
        <Mic className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground/80">{userMessages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground/80">{assistantMessages}</span>
      </div>
      
      <div className="w-px h-4 bg-border" />
      
      <span className="text-xs text-muted-foreground">
        {totalWords} words
      </span>
    </div>
  );
}
