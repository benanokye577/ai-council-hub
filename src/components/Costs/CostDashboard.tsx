import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Zap,
  Calendar,
  AlertTriangle,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CostData {
  model: string;
  cost: number;
  tokens: number;
  requests: number;
  trend: 'up' | 'down' | 'stable';
}

const mockCostData: CostData[] = [
  { model: 'Claude 3.5 Sonnet', cost: 12.45, tokens: 245000, requests: 156, trend: 'up' },
  { model: 'GPT-4o', cost: 8.32, tokens: 180000, requests: 89, trend: 'down' },
  { model: 'Claude 3 Haiku', cost: 2.15, tokens: 520000, requests: 423, trend: 'stable' },
  { model: 'Gemini Pro', cost: 4.20, tokens: 310000, requests: 201, trend: 'up' },
];

const dailyCosts = [
  { day: 'Mon', cost: 4.2 },
  { day: 'Tue', cost: 5.8 },
  { day: 'Wed', cost: 3.1 },
  { day: 'Thu', cost: 6.4 },
  { day: 'Fri', cost: 4.9 },
  { day: 'Sat', cost: 2.3 },
  { day: 'Sun', cost: 3.6 },
];

interface CostDashboardProps {
  className?: string;
}

export function CostDashboard({ className }: CostDashboardProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  const totalCost = mockCostData.reduce((sum, d) => sum + d.cost, 0);
  const totalTokens = mockCostData.reduce((sum, d) => sum + d.tokens, 0);
  const budget = 50;
  const budgetUsed = (totalCost / budget) * 100;

  const maxDailyCost = Math.max(...dailyCosts.map(d => d.cost));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  12% vs last {timeRange}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens Used</p>
                <p className="text-2xl font-bold">{(totalTokens / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ~${(totalCost / (totalTokens / 1000000)).toFixed(2)}/1M tokens
                </p>
              </div>
              <div className="p-3 rounded-full bg-[hsl(var(--workflow-action))]/10">
                <Zap className="w-6 h-6 text-[hsl(var(--workflow-action))]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Used</p>
                <p className="text-2xl font-bold">{budgetUsed.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${(budget - totalCost).toFixed(2)} remaining
                </p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <PieChart className="w-6 h-6 text-warning" />
              </div>
            </div>
            <Progress value={budgetUsed} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cost Breakdown</h2>
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
          {(['day', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                timeRange === range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">By Model</TabsTrigger>
          <TabsTrigger value="daily">Daily Usage</TabsTrigger>
          <TabsTrigger value="agents">By Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-3">
          {mockCostData.map((data, i) => (
            <motion.div
              key={data.model}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{data.model}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.requests} requests · {(data.tokens / 1000).toFixed(0)}K tokens
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${data.cost.toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {data.trend === 'up' && (
                          <span className="text-destructive flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +8%
                          </span>
                        )}
                        {data.trend === 'down' && (
                          <span className="text-success flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" /> -5%
                          </span>
                        )}
                        {data.trend === 'stable' && (
                          <span className="text-muted-foreground">Stable</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(data.cost / totalCost) * 100} 
                    className="mt-3 h-1.5" 
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="daily">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-end justify-between h-40 gap-2">
                {dailyCosts.map((day, i) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      className="w-full bg-primary/80 rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.cost / maxDailyCost) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>Avg: ${(dailyCosts.reduce((s, d) => s + d.cost, 0) / 7).toFixed(2)}/day</span>
                <span>Peak: ${maxDailyCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                {[
                  { name: 'Strategist', cost: 8.50, color: 'hsl(var(--primary))' },
                  { name: 'Developer', cost: 6.20, color: 'hsl(var(--workflow-action))' },
                  { name: 'Critic', cost: 4.80, color: 'hsl(var(--workflow-condition))' },
                  { name: 'Researcher', cost: 3.40, color: 'hsl(var(--success))' },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: agent.color }}
                    />
                    <span className="flex-1 text-sm">{agent.name}</span>
                    <span className="font-medium">${agent.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Budget Alert */}
      {budgetUsed > 80 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium">Budget Warning</p>
                <p className="text-xs text-muted-foreground">
                  You've used {budgetUsed.toFixed(0)}% of your ${budget} budget
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Adjust
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}