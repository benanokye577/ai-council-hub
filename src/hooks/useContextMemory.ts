import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  preferredTopics: string[];
  dislikedTopics: string[];
  learningGoals: string[];
  timezone: string;
  preferredVoice: string;
  preferredLanguage: string;
  responseLength: 'concise' | 'detailed' | 'balanced';
}

export interface TopicMemory {
  topic: string;
  mentionCount: number;
  lastMentioned: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedTopics: string[];
}

export interface ContextMemory {
  userId: string;
  preferences: UserPreferences;
  topics: TopicMemory[];
  insights: string[];
  conversationPatterns: {
    averageSessionLength: number;
    preferredTimeOfDay: string;
    mostActiveDay: string;
    totalConversations: number;
  };
  lastUpdated: Date;
  createdAt: Date;
}

const STORAGE_KEY = 'nebula_context_memory';

const defaultPreferences: UserPreferences = {
  communicationStyle: 'friendly',
  preferredTopics: [],
  dislikedTopics: [],
  learningGoals: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  preferredVoice: 'default',
  preferredLanguage: 'en',
  responseLength: 'balanced',
};

const defaultMemory: ContextMemory = {
  userId: crypto.randomUUID(),
  preferences: defaultPreferences,
  topics: [],
  insights: [],
  conversationPatterns: {
    averageSessionLength: 0,
    preferredTimeOfDay: 'morning',
    mostActiveDay: 'Monday',
    totalConversations: 0,
  },
  lastUpdated: new Date(),
  createdAt: new Date(),
};

export function useContextMemory() {
  const [memory, setMemory] = useState<ContextMemory>(defaultMemory);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMemory({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          createdAt: new Date(parsed.createdAt),
          topics: parsed.topics.map((t: any) => ({
            ...t,
            lastMentioned: new Date(t.lastMentioned),
          })),
        });
      }
    } catch (error) {
      console.error('Failed to load context memory:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when memory changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    }
  }, [memory, isLoading]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setMemory(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
      lastUpdated: new Date(),
    }));
  }, []);

  const addTopic = useCallback((topic: string, sentiment: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    setMemory(prev => {
      const existingIndex = prev.topics.findIndex(
        t => t.topic.toLowerCase() === topic.toLowerCase()
      );

      if (existingIndex >= 0) {
        const updated = [...prev.topics];
        updated[existingIndex] = {
          ...updated[existingIndex],
          mentionCount: updated[existingIndex].mentionCount + 1,
          lastMentioned: new Date(),
          sentiment,
        };
        return { ...prev, topics: updated, lastUpdated: new Date() };
      }

      return {
        ...prev,
        topics: [
          ...prev.topics,
          {
            topic,
            mentionCount: 1,
            lastMentioned: new Date(),
            sentiment,
            relatedTopics: [],
          },
        ],
        lastUpdated: new Date(),
      };
    });
  }, []);

  const addInsight = useCallback((insight: string) => {
    setMemory(prev => ({
      ...prev,
      insights: [...prev.insights.slice(-49), insight], // Keep last 50 insights
      lastUpdated: new Date(),
    }));
  }, []);

  const updateConversationPatterns = useCallback((sessionLength: number) => {
    setMemory(prev => {
      const newTotal = prev.conversationPatterns.totalConversations + 1;
      const newAverage = 
        (prev.conversationPatterns.averageSessionLength * (newTotal - 1) + sessionLength) / newTotal;

      const hour = new Date().getHours();
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
      else if (hour >= 21 || hour < 5) timeOfDay = 'night';

      const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

      return {
        ...prev,
        conversationPatterns: {
          ...prev.conversationPatterns,
          averageSessionLength: Math.round(newAverage),
          preferredTimeOfDay: timeOfDay,
          mostActiveDay: dayOfWeek,
          totalConversations: newTotal,
        },
        lastUpdated: new Date(),
      };
    });
  }, []);

  const getTopTopics = useCallback((limit: number = 5) => {
    return [...memory.topics]
      .sort((a, b) => b.mentionCount - a.mentionCount)
      .slice(0, limit);
  }, [memory.topics]);

  const getRecentTopics = useCallback((limit: number = 5) => {
    return [...memory.topics]
      .sort((a, b) => b.lastMentioned.getTime() - a.lastMentioned.getTime())
      .slice(0, limit);
  }, [memory.topics]);

  const clearMemory = useCallback(() => {
    setMemory({
      ...defaultMemory,
      userId: memory.userId,
      createdAt: memory.createdAt,
    });
  }, [memory.userId, memory.createdAt]);

  return {
    memory,
    isLoading,
    updatePreferences,
    addTopic,
    addInsight,
    updateConversationPatterns,
    getTopTopics,
    getRecentTopics,
    clearMemory,
  };
}
