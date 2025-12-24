import { useState, useEffect, useCallback } from 'react';
import { ConversationMessage } from '@/components/Voice/ConversationHistory';

const STORAGE_KEY = 'voice-conversation-sessions';
const MAX_SESSIONS = 10;

export interface ConversationSession {
  id: string;
  title: string;
  personaId: string;
  personaName: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface StoredSession {
  id: string;
  title: string;
  personaId: string;
  personaName: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function generateSessionTitle(messages: ConversationMessage[]): string {
  if (messages.length === 0) return 'New Conversation';
  
  // Use first user message as title, truncated
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const title = firstUserMessage.content.slice(0, 50);
    return title.length < firstUserMessage.content.length ? `${title}...` : title;
  }
  
  return 'Conversation';
}

function serializeSession(session: ConversationSession): StoredSession {
  return {
    ...session,
    messages: session.messages.map(m => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    })),
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

function deserializeSession(stored: StoredSession): ConversationSession {
  return {
    ...stored,
    messages: stored.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

export function useConversationMemory() {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredSession[] = JSON.parse(stored);
        const deserialized = parsed.map(deserializeSession);
        setSessions(deserialized);
      }
    } catch (error) {
      console.error('Failed to load conversation sessions:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const serialized = sessions.map(serializeSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save conversation sessions:', error);
    }
  }, [sessions, isLoaded]);

  // Create a new session
  const createSession = useCallback((personaId: string, personaName: string): string => {
    const newSession: ConversationSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Conversation',
      personaId,
      personaName,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => {
      // Keep only the most recent sessions
      const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
      return updated;
    });

    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  // Add message to current session
  const addMessage = useCallback((message: ConversationMessage) => {
    if (!currentSessionId) return;

    setSessions(prev => prev.map(session => {
      if (session.id !== currentSessionId) return session;
      
      const updatedMessages = [...session.messages, message];
      return {
        ...session,
        messages: updatedMessages,
        title: generateSessionTitle(updatedMessages),
        updatedAt: new Date(),
      };
    }));
  }, [currentSessionId]);

  // Get current session
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // Get current messages
  const currentMessages = currentSession?.messages || [];

  // Load a specific session
  const loadSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
  }, []);

  // End current session
  const endCurrentSession = useCallback(() => {
    setCurrentSessionId(null);
  }, []);

  return {
    sessions,
    currentSession,
    currentSessionId,
    currentMessages,
    isLoaded,
    createSession,
    addMessage,
    loadSession,
    deleteSession,
    clearAllSessions,
    endCurrentSession,
  };
}
