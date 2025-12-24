import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Brain,
  Clock,
  Hash,
  Smile,
  Frown,
  Meh,
  Target,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useConversationInsights } from '@/hooks/useConversationInsights';
import { cn } from '@/lib/utils';

interface InsightsDashboardProps {
  className?: string;
}

export function InsightsDashboard({ className }: InsightsDashboardProps) {
  const { insights, getWeeklyTrend } = useConversationInsights();
  const weeklyTrend = getWeeklyTrend;

  const sentimentIcon = {
    improving: <TrendingUp className="w-4 h-4 text-success" />,
    declining: <TrendingDown className="w-4 h-4 text-error" />,
    stable: <Minus className="w-4 h-4 text-foreground-secondary" />,
  };

  const sentimentEmoji = insights.averageSentiment > 0.2 
    ? <Smile className="w-5 h-5 text-success" />
    : insights.averageSentiment < -0.2 
    ? <Frown className="w-5 h-5 text-error" />
    : <Meh className="w-5 h-5 text-warning" />;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Conversation Insights</h2>
          <p className="text-sm text-foreground-secondary">
            Analytics from your voice conversations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<MessageSquare className="w-4 h-4" />}
          label="Total Messages"
          value={insights.totalMessages.toLocaleString()}
          color="primary"
        />
        <StatCard
          icon={<Hash className="w-4 h-4" />}
          label="Total Words"
          value={insights.totalWords.toLocaleString()}
          color="info"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Avg Length"
          value={`${Math.round(insights.averageMessageLength)} words`}
          color="warning"
        />
        <StatCard
          icon={sentimentEmoji}
          label="Sentiment"
          value={
            insights.averageSentiment > 0.2 ? 'Positive' :
            insights.averageSentiment < -0.2 ? 'Negative' : 'Neutral'
          }
          color={insights.averageSentiment > 0 ? 'success' : insights.averageSentiment < 0 ? 'error' : 'warning'}
        />
      </div>

      {/* Sentiment Trend */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Sentiment Trend
            </span>
            <div className="flex items-center gap-1">
              {sentimentIcon[insights.sentimentTrend]}
              <span className="text-xs capitalize text-foreground-secondary">
                {insights.sentimentTrend}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-secondary">Negative</span>
              <span className="text-foreground-secondary">Positive</span>
            </div>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-error/30 via-warning/30 to-success/30 overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full"
                initial={{ left: '50%' }}
                animate={{ left: `${(insights.averageSentiment + 1) * 50}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Topics */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Top Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.topTopics.length === 0 ? (
            <p className="text-sm text-foreground-tertiary text-center py-4">
              Start conversations to discover topics
            </p>
          ) : (
            <div className="space-y-3">
              {insights.topTopics.slice(0, 5).map((topic, index) => (
                <div key={topic.topic} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{topic.topic}</span>
                    <span className="text-foreground-secondary">{topic.count} mentions</span>
                  </div>
                  <Progress 
                    value={(topic.count / (insights.topTopics[0]?.count || 1)) * 100} 
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {weeklyTrend.totalMessages}
              </p>
              <p className="text-xs text-foreground-secondary">Messages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-info">
                {weeklyTrend.totalWords}
              </p>
              <p className="text-xs text-foreground-secondary">Words</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {Math.round(weeklyTrend.averageMessagesPerDay)}
              </p>
              <p className="text-xs text-foreground-secondary">Avg/Day</p>
            </div>
          </div>

          {weeklyTrend.topTopics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-foreground-secondary mb-2">Top topics this week</p>
              <div className="flex flex-wrap gap-1">
                {weeklyTrend.topTopics.map(topic => (
                  <Badge key={topic} variant="secondary" className="text-xs capitalize">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Chart (simplified) */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Daily Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-24">
            {insights.dailyStats.slice(-7).map((day, index) => {
              const maxMessages = Math.max(...insights.dailyStats.slice(-7).map(d => d.messageCount), 1);
              const height = (day.messageCount / maxMessages) * 100;
              
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <motion.div
                    className="w-full bg-primary/60 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1 }}
                  />
                  <span className="text-[10px] text-foreground-tertiary">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'primary' | 'info' | 'warning' | 'success' | 'error';
}) {
  const colorClasses = {
    primary: 'bg-primary/20 text-primary',
    info: 'bg-info/20 text-info',
    warning: 'bg-warning/20 text-warning',
    success: 'bg-success/20 text-success',
    error: 'bg-error/20 text-error',
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-3">
        <div className={cn('p-1.5 rounded w-fit mb-2', colorClasses[color])}>
          {icon}
        </div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-foreground-secondary">{label}</p>
      </CardContent>
    </Card>
  );
}
