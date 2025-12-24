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
  Legend,
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
  { name: "Claude 3.5 Sonnet", value: 45, color: "hsl(var(--primary))" },
  { name: "GPT-4o", value: 30, color: "hsl(var(--info))" },
  { name: "Claude 3 Opus", value: 15, color: "hsl(var(--success))" },
  { name: "Local Models", value: 10, color: "hsl(var(--warning))" },
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
          Track your usage, performance, and costs
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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

        {/* Agent Performance */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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
              <div className="space-y-4">
                {agentData.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 w-24">
                      <Users className="w-4 h-4 text-foreground-tertiary" />
                      <span className="text-sm text-foreground-secondary">
                        {agent.name}
                      </span>
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-background-hover overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: agent.color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(agent.messages / 1203) * 100}%`,
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-16 text-right">
                      {agent.messages}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
