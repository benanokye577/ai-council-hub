import { useState, useEffect, useCallback, useMemo } from 'react';

export interface MessageAnalysis {
  wordCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  questionCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface DailyStats {
  date: string;
  messageCount: number;
  wordCount: number;
  averageSentiment: number;
  topTopics: string[];
  sessionCount: number;
}

export interface ConversationInsights {
  totalMessages: number;
  totalWords: number;
  averageSentiment: number;
  topTopics: { topic: string; count: number }[];
  dailyStats: DailyStats[];
  questionRatio: number;
  averageMessageLength: number;
  mostActiveHour: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
}

const STORAGE_KEY = 'nebula_conversation_insights';

// Simple sentiment analysis based on keyword matching
const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'thanks', 'helpful', 'perfect', 'awesome'];
const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'annoying', 'frustrated', 'wrong', 'error', 'problem', 'issue', 'difficult', 'confused'];

export function useConversationInsights() {
  const [insights, setInsights] = useState<ConversationInsights>({
    totalMessages: 0,
    totalWords: 0,
    averageSentiment: 0,
    topTopics: [],
    dailyStats: [],
    questionRatio: 0,
    averageMessageLength: 0,
    mostActiveHour: 9,
    sentimentTrend: 'stable',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInsights(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
    setIsLoading(false);
  }, []);

  // Save when insights change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
    }
  }, [insights, isLoading]);

  const analyzeMessage = useCallback((text: string): MessageAnalysis => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Sentiment analysis
    let sentimentScore = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) sentimentScore += 1;
      if (negativeWords.includes(word)) sentimentScore -= 1;
    });
    
    const sentiment: 'positive' | 'negative' | 'neutral' = 
      sentimentScore > 0 ? 'positive' : 
      sentimentScore < 0 ? 'negative' : 'neutral';

    // Extract topics (simple noun extraction)
    const topicPatterns = [
      /(?:about|regarding|concerning|discuss|help with|learn about)\s+(\w+)/gi,
      /(?:how to|what is|explain)\s+(\w+)/gi,
    ];
    
    const topics: string[] = [];
    topicPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && match[1].length > 2) {
          topics.push(match[1].toLowerCase());
        }
      }
    });

    // Count questions
    const questionCount = (text.match(/\?/g) || []).length;

    // Determine complexity
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / (wordCount || 1);
    const complexity: 'simple' | 'moderate' | 'complex' = 
      avgWordLength > 7 || wordCount > 50 ? 'complex' :
      avgWordLength > 5 || wordCount > 20 ? 'moderate' : 'simple';

    return {
      wordCount,
      sentiment,
      topics,
      questionCount,
      complexity,
    };
  }, []);

  const recordMessage = useCallback((text: string, role: 'user' | 'assistant') => {
    const analysis = analyzeMessage(text);
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    setInsights(prev => {
      // Update daily stats
      const existingDayIndex = prev.dailyStats.findIndex(d => d.date === today);
      let updatedDailyStats = [...prev.dailyStats];

      if (existingDayIndex >= 0) {
        updatedDailyStats[existingDayIndex] = {
          ...updatedDailyStats[existingDayIndex],
          messageCount: updatedDailyStats[existingDayIndex].messageCount + 1,
          wordCount: updatedDailyStats[existingDayIndex].wordCount + analysis.wordCount,
          topTopics: [...new Set([...updatedDailyStats[existingDayIndex].topTopics, ...analysis.topics])].slice(0, 10),
        };
      } else {
        updatedDailyStats.push({
          date: today,
          messageCount: 1,
          wordCount: analysis.wordCount,
          averageSentiment: analysis.sentiment === 'positive' ? 1 : analysis.sentiment === 'negative' ? -1 : 0,
          topTopics: analysis.topics,
          sessionCount: 1,
        });
      }

      // Keep only last 30 days
      updatedDailyStats = updatedDailyStats.slice(-30);

      // Update topic counts
      const topicCounts = new Map(prev.topTopics.map(t => [t.topic, t.count]));
      analysis.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
      const updatedTopTopics = Array.from(topicCounts.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      // Calculate new totals
      const newTotalMessages = prev.totalMessages + 1;
      const newTotalWords = prev.totalWords + analysis.wordCount;
      const newQuestionRatio = role === 'user' 
        ? (prev.questionRatio * prev.totalMessages + analysis.questionCount) / newTotalMessages
        : prev.questionRatio;

      // Update sentiment average
      const sentimentValue = analysis.sentiment === 'positive' ? 1 : analysis.sentiment === 'negative' ? -1 : 0;
      const newAverageSentiment = (prev.averageSentiment * prev.totalMessages + sentimentValue) / newTotalMessages;

      // Determine sentiment trend from last 7 days
      const recentDays = updatedDailyStats.slice(-7);
      const oldDays = updatedDailyStats.slice(-14, -7);
      const recentAvg = recentDays.reduce((sum, d) => sum + d.averageSentiment, 0) / (recentDays.length || 1);
      const oldAvg = oldDays.reduce((sum, d) => sum + d.averageSentiment, 0) / (oldDays.length || 1);
      const sentimentTrend: 'improving' | 'declining' | 'stable' = 
        recentAvg > oldAvg + 0.1 ? 'improving' :
        recentAvg < oldAvg - 0.1 ? 'declining' : 'stable';

      return {
        totalMessages: newTotalMessages,
        totalWords: newTotalWords,
        averageSentiment: newAverageSentiment,
        topTopics: updatedTopTopics,
        dailyStats: updatedDailyStats,
        questionRatio: newQuestionRatio,
        averageMessageLength: newTotalWords / newTotalMessages,
        mostActiveHour: currentHour,
        sentimentTrend,
      };
    });
  }, [analyzeMessage]);

  const getWeeklyTrend = useMemo(() => {
    const lastWeek = insights.dailyStats.slice(-7);
    return {
      totalMessages: lastWeek.reduce((sum, d) => sum + d.messageCount, 0),
      totalWords: lastWeek.reduce((sum, d) => sum + d.wordCount, 0),
      averageMessagesPerDay: lastWeek.reduce((sum, d) => sum + d.messageCount, 0) / (lastWeek.length || 1),
      topTopics: [...new Set(lastWeek.flatMap(d => d.topTopics))].slice(0, 5),
    };
  }, [insights.dailyStats]);

  const clearInsights = useCallback(() => {
    setInsights({
      totalMessages: 0,
      totalWords: 0,
      averageSentiment: 0,
      topTopics: [],
      dailyStats: [],
      questionRatio: 0,
      averageMessageLength: 0,
      mostActiveHour: 9,
      sentimentTrend: 'stable',
    });
  }, []);

  return {
    insights,
    isLoading,
    analyzeMessage,
    recordMessage,
    getWeeklyTrend,
    clearInsights,
  };
}
