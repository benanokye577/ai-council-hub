import { motion } from "framer-motion";
import {
  Globe,
  Code,
  Calculator,
  Image,
  Link,
  Server,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const tools = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information and data",
    icon: Globe,
    enabled: true,
    status: "connected",
    usage: "847 queries",
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Execute code in a secure sandbox environment",
    icon: Code,
    enabled: true,
    status: "connected",
    usage: "234 executions",
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform complex mathematical calculations",
    icon: Calculator,
    enabled: true,
    status: "connected",
    usage: "156 calculations",
  },
  {
    id: "image-gen",
    name: "Image Generation",
    description: "Generate images from text descriptions",
    icon: Image,
    enabled: false,
    status: "disconnected",
    usage: "0 generations",
  },
  {
    id: "url-reader",
    name: "URL Content Reader",
    description: "Read and extract content from web pages",
    icon: Link,
    enabled: true,
    status: "connected",
    usage: "423 pages read",
  },
  {
    id: "mcp-server",
    name: "MCP Server",
    description: "Connect to Model Context Protocol servers",
    icon: Server,
    enabled: false,
    status: "disconnected",
    usage: "Not configured",
  },
];

export default function Tools() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-h1 text-foreground mb-2">Tools & Integrations</h1>
        <p className="text-foreground-secondary">
          Manage capabilities and external integrations
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-foreground-secondary">
                Active Tools
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-foreground-secondary">
                Inactive Tools
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,660</p>
              <p className="text-sm text-foreground-secondary">
                Total Operations
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            <Card
              variant="gradient-border"
              className="hover-lift transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tool.enabled
                          ? "bg-gradient-primary shadow-glow"
                          : "bg-background-hover"
                      }`}
                    >
                      <tool.icon
                        className={`w-5 h-5 ${
                          tool.enabled
                            ? "text-primary-foreground"
                            : "text-foreground-tertiary"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {tool.name}
                        </h3>
                        <Badge
                          variant={
                            tool.status === "connected" ? "success" : "outline"
                          }
                          className="text-[10px]"
                        >
                          {tool.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-tertiary">
                        {tool.usage}
                      </p>
                    </div>
                  </div>
                  <Switch checked={tool.enabled} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-foreground-secondary mb-4">
                  {tool.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={!tool.enabled}
                >
                  <Settings className="w-3 h-3" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add Tool Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            variant="glass"
            className="h-full border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-all duration-300 group"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[180px] p-6">
              <div className="w-12 h-12 rounded-xl bg-background-hover flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Plus className="w-6 h-6 text-foreground-tertiary group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Add Integration
              </h3>
              <p className="text-xs text-foreground-secondary text-center">
                Connect new tools and services
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
