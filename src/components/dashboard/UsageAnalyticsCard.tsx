import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const usageData = [
  { day: "Mon", tokens: 1200 },
  { day: "Tue", tokens: 2100 },
  { day: "Wed", tokens: 1800 },
  { day: "Thu", tokens: 2800 },
  { day: "Fri", tokens: 1900 },
  { day: "Sat", tokens: 3200 },
  { day: "Sun", tokens: 2847 },
];

const stats = [
  {
    label: "Messages Today",
    value: "34",
    icon: MessageSquare,
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Avg Response",
    value: "1.2s",
    icon: Clock,
    trend: "-0.3s",
    trendUp: true,
  },
  {
    label: "Success Rate",
    value: "99.2%",
    icon: TrendingUp,
    trend: "+0.5%",
    trendUp: true,
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

export function UsageAnalyticsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card variant="gradient-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-sm font-semibold">
                Token Usage
              </CardTitle>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">2,847</p>
              <p className="text-xs text-foreground-tertiary">tokens today</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart */}
          <div className="h-32 mt-2 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
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
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--foreground-tertiary))" }}
                />
                <YAxis hide />
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

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border-subtle">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <stat.icon className="w-3 h-3 text-foreground-tertiary" />
                  <span className="text-[10px] text-foreground-tertiary uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {stat.value}
                </p>
                <span
                  className={`text-[10px] ${
                    stat.trendUp ? "text-success" : "text-error"
                  }`}
                >
                  {stat.trend}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
