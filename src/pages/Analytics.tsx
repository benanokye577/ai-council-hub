import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Zap,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CouncilInsightsCard } from "@/components/dashboard/CouncilInsightsCard";

const tokenData = [
  { date: "Dec 18", tokens: 8500 },
  { date: "Dec 19", tokens: 12300 },
  { date: "Dec 20", tokens: 9800 },
  { date: "Dec 21", tokens: 15600 },
  { date: "Dec 22", tokens: 11200 },
  { date: "Dec 23", tokens: 18900 },
  { date: "Dec 24", tokens: 14500 },
];

const agentData = [
  { name: "Research", messages: 847, color: "hsl(var(--success))" },
  { name: "Code", messages: 1203, color: "hsl(var(--info))" },
  { name: "Writing", messages: 392, color: "hsl(var(--warning))" },
  { name: "Analysis", messages: 156, color: "hsl(var(--primary))" },
  { name: "Creative", messages: 89, color: "hsl(var(--error))" },
];

const modelUsage = [
  { name: "Cerebras Llama 3.3", value: 45, color: "hsl(var(--primary))" },
  { name: "Together Mixtral", value: 30, color: "hsl(var(--info))" },
  { name: "OpenRouter Claude", value: 15, color: "hsl(var(--success))" },
  { name: "OpenRouter GPT-4", value: 10, color: "hsl(var(--warning))" },
];

const stats = [
  {
    label: "Total Conversations",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "Total Tokens Used",
    value: "1.2M",
    change: "+8.3%",
    trend: "up",
    icon: Zap,
  },
  {
    label: "Avg Response Time",
    value: "1.8s",
    change: "-0.3s",
    trend: "up",
    icon: Clock,
  },
  {
    label: "Estimated Cost",
    value: "$24.50",
    change: "+$4.20",
    trend: "down",
    icon: DollarSign,
  },
];

const valueStats = [
  {
    label: "Tasks Completed",
    value: "156",
    change: "+23",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Hours Saved",
    value: "48.5h",
    change: "+12.3h",
    trend: "up",
    icon: Clock,
  },
  {
    label: "Value Generated",
    value: "$2,450",
    change: "+$680",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "ROI",
    value: "10,000%",
    change: "+2,500%",
    trend: "up",
    icon: TrendingUp,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 rounded-lg border border-border">
        <p className="text-xs text-foreground-secondary">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {payload[0].value.toLocaleString()} tokens
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-h1 text-foreground mb-2">Analytics</h1>
        <p className="text-foreground-secondary">
          Track your usage, performance, costs, and value generated
        </p>
      </motion.div>

      {/* Value Stats Grid */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          Value Generated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {valueStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card variant="gradient-border" className="border-success/20 bg-success/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-foreground-secondary mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-xs text-success">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cost Stats Grid */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-foreground-tertiary" />
          Usage & Costs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card variant="gradient-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-foreground-secondary mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-success" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-error" />
                        )}
                        <span
                          className={`text-xs ${
                            stat.trend === "up" ? "text-success" : "text-error"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Token Usage Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient-border">
            <CardHeader>
              <CardTitle className="text-base">Token Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tokenData}>
                    <defs>
                      <linearGradient
                        id="colorTokens"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--foreground-tertiary))",
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--foreground-tertiary))",
                      }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="tokens"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorTokens)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages by Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="gradient-border">
            <CardHeader>
              <CardTitle className="text-base">Messages by Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--foreground-tertiary))",
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--foreground-secondary))",
                      }}
                      width={70}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--background-hover))" }}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="messages" radius={[0, 4, 4, 0]}>
                      {agentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Usage Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient-border">
            <CardHeader>
              <CardTitle className="text-base">Model Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {modelUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {modelUsage.map((model) => (
                  <div
                    key={model.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: model.color }}
                      />
                      <span className="text-sm text-foreground-secondary">
                        {model.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {model.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Council Insights - AI Generated */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <CouncilInsightsCard />
        </motion.div>
      </div>

      {/* Agent Performance - Full Width */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="gradient-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Agent Performance</CardTitle>
              <Badge variant="outline" className="text-xs">
                Last 7 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {agentData.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  className="p-4 rounded-lg bg-background-secondary/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      <Users className="w-4 h-4" style={{ color: agent.color }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {agent.name}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {agent.messages}
                  </div>
                  <div className="text-xs text-foreground-tertiary mb-2">messages</div>
                  <div className="h-2 rounded-full bg-background-hover overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: agent.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(agent.messages / 1203) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
