import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Clock, User, ChevronRight, Search, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ConversationSession } from '@/hooks/useConversationMemory';

type DateFilter = 'all' | 'today' | 'week' | 'month';

interface SessionListProps {
  sessions: ConversationSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  reducedMotion?: boolean;
  className?: string;
}

export function SessionList({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  reducedMotion = false,
  className,
}: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter sessions based on search query and date filter
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return sessions.filter(session => {
      // Date filter
      if (dateFilter !== 'all') {
        const sessionDate = session.updatedAt;
        if (dateFilter === 'today' && sessionDate < todayStart) return false;
        if (dateFilter === 'week' && sessionDate < weekAgo) return false;
        if (dateFilter === 'month' && sessionDate < monthAgo) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = session.title.toLowerCase().includes(query);
        const personaMatch = session.personaName.toLowerCase().includes(query);
        const contentMatch = session.messages.some(m => 
          m.content.toLowerCase().includes(query)
        );
        return titleMatch || personaMatch || contentMatch;
      }

      return true;
    });
  }, [sessions, searchQuery, dateFilter]);

  const dateFilterOptions: { value: DateFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  const hasActiveFilters = searchQuery.trim() || dateFilter !== 'all';

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 space-y-3 border-b border-border/30">
        <Button onClick={onNewSession} className="w-full" variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Conversation
        </Button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 bg-secondary/30 border-border/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date filter chips */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {dateFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateFilter(option.value)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-full transition-colors",
                  dateFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence initial={false}>
            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                {hasActiveFilters ? (
                  <>
                    <Search className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No matching sessions</p>
                    <p className="text-xs mt-1">Try different search terms</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setDateFilter('all');
                      }}
                      className="mt-3"
                    >
                      Clear filters
                    </Button>
                  </>
                ) : (
                  <>
                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No saved sessions</p>
                    <p className="text-xs mt-1">Start a conversation to save it</p>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Results count */}
                {hasActiveFilters && (
                  <p className="text-xs text-muted-foreground px-2 py-1">
                    {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
                  </p>
                )}
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? {} : { opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors group",
                        "hover:bg-secondary/50",
                        currentSessionId === session.id 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-secondary/20 border border-transparent"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {highlightMatch(session.title, searchQuery)}
                            </span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {session.personaName}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {session.messages.length} messages
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                            <span className="text-[10px] text-muted-foreground/60">
                              {formatDate(session.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return text;
  
  return (
    <>
      {text.slice(0, index)}
      <span className="bg-primary/30 text-primary-foreground rounded px-0.5">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}
