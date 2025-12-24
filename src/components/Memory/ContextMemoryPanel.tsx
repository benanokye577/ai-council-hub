import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  User,
  Heart,
  Target,
  Globe,
  Volume2,
  MessageSquare,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContextMemory, UserPreferences } from '@/hooks/useContextMemory';
import { cn } from '@/lib/utils';

interface ContextMemoryPanelProps {
  className?: string;
  onClose?: () => void;
}

export function ContextMemoryPanel({ className, onClose }: ContextMemoryPanelProps) {
  const {
    memory,
    updatePreferences,
    addTopic,
    addInsight,
    getTopTopics,
    getRecentTopics,
    clearMemory,
  } = useContextMemory();

  const [newTopic, setNewTopic] = useState('');
  const [newInsight, setNewInsight] = useState('');

  const topTopics = getTopTopics(5);
  const recentTopics = getRecentTopics(5);

  const communicationStyleLabels = {
    formal: 'Formal & Professional',
    casual: 'Casual & Friendly',
    technical: 'Technical & Precise',
    friendly: 'Warm & Approachable',
  };

  const responseLengthLabels = {
    concise: 'Brief & To the Point',
    balanced: 'Balanced',
    detailed: 'Comprehensive & Detailed',
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    addTopic(newTopic.trim());
    setNewTopic('');
  };

  const handleAddInsight = () => {
    if (!newInsight.trim()) return;
    addInsight(newInsight.trim());
    setNewInsight('');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Context Memory</h2>
            <p className="text-sm text-foreground-secondary">
              Personalization that persists
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-error hover:text-error"
            onClick={clearMemory}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Communication Preferences */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Communication Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={memory.preferences.communicationStyle}
                onValueChange={(v) => updatePreferences({ communicationStyle: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(communicationStyleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response Length</Label>
              <Select
                value={memory.preferences.responseLength}
                onValueChange={(v) => updatePreferences({ responseLength: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(responseLengthLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select
                value={memory.preferences.preferredLanguage}
                onValueChange={(v) => updatePreferences({ preferredLanguage: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input
                value={memory.preferences.timezone}
                onChange={(e) => updatePreferences({ timezone: e.target.value })}
                placeholder="America/New_York"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics of Interest */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-error" />
            Topics of Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topTopics.length > 0 && (
            <div>
              <p className="text-xs text-foreground-secondary mb-2">Most discussed</p>
              <div className="flex flex-wrap gap-2">
                {topTopics.map(topic => (
                  <Badge key={topic.topic} variant="secondary" className="gap-1 capitalize">
                    {topic.topic}
                    <span className="text-foreground-tertiary">×{topic.mentionCount}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Add a topic you're interested in"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
            />
            <Button onClick={handleAddTopic}>Add</Button>
          </div>

          {memory.preferences.preferredTopics.length > 0 && (
            <div>
              <p className="text-xs text-foreground-secondary mb-2">Preferred topics</p>
              <div className="flex flex-wrap gap-2">
                {memory.preferences.preferredTopics.map(topic => (
                  <Badge key={topic} className="bg-success/20 text-success capitalize">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-warning" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memory.preferences.learningGoals.length === 0 ? (
            <p className="text-sm text-foreground-tertiary text-center py-4">
              No learning goals set yet
            </p>
          ) : (
            <div className="space-y-2">
              {memory.preferences.learningGoals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-background-elevated/30"
                >
                  <Target className="w-4 h-4 text-warning shrink-0" />
                  <span className="text-sm">{goal}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversation Patterns */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-info" />
            Your Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-background-elevated/30">
              <p className="text-2xl font-bold text-primary">
                {memory.conversationPatterns.totalConversations}
              </p>
              <p className="text-xs text-foreground-secondary">Conversations</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background-elevated/30">
              <p className="text-2xl font-bold text-info">
                {memory.conversationPatterns.averageSessionLength}m
              </p>
              <p className="text-xs text-foreground-secondary">Avg. Length</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background-elevated/30">
              <p className="text-lg font-bold text-warning capitalize">
                {memory.conversationPatterns.preferredTimeOfDay}
              </p>
              <p className="text-xs text-foreground-secondary">Peak Time</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background-elevated/30">
              <p className="text-lg font-bold text-success">
                {memory.conversationPatterns.mostActiveDay}
              </p>
              <p className="text-xs text-foreground-secondary">Most Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {memory.insights.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Recent Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {memory.insights.slice(-5).reverse().map((insight, index) => (
                <p key={index} className="text-sm text-foreground-secondary p-2 rounded-lg bg-background-elevated/30">
                  {insight}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Age */}
      <p className="text-xs text-foreground-tertiary text-center">
        Memory created {new Date(memory.createdAt).toLocaleDateString()} • 
        Last updated {new Date(memory.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}
