import { motion } from "framer-motion";
import { Wifi, Clock, Database, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusItems = [
  {
    icon: Wifi,
    label: "API Connection",
    value: "Connected",
    status: "success",
  },
  {
    icon: Clock,
    label: "Model Latency",
    value: "~1.2s",
    status: "normal",
  },
  {
    icon: Database,
    label: "Memory Usage",
    value: "42%",
    status: "normal",
  },
];

export function SystemStatusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card variant="gradient-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-sm font-semibold">
              System Status
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {statusItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + index * 0.05 }}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-foreground-tertiary" />
                <span className="text-sm text-foreground-secondary">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.status === "success" && (
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.status === "success"
                      ? "text-success"
                      : "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Memory Bar */}
          <div className="pt-2">
            <div className="h-1.5 rounded-full bg-background-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "42%" }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
