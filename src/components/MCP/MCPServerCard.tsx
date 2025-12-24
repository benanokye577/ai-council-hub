import { motion } from "framer-motion";
import { Check, Download, Settings, Star, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rating: number;
  downloads: number;
  installed: boolean;
  connected: boolean;
  authRequired?: boolean;
  tools: string[];
}

interface MCPServerCardProps {
  server: MCPServer;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  onConfigure: (id: string) => void;
  compact?: boolean;
}

export function MCPServerCard({
  server,
  onInstall,
  onUninstall,
  onConfigure,
  compact = false,
}: MCPServerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "glass-card rounded-lg border border-border/50 transition-all hover:border-primary/30",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl shrink-0">{server.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground">{server.name}</h3>
              {!compact && (
                <p className="text-xs text-foreground-tertiary mt-0.5 line-clamp-2">
                  {server.description}
                </p>
              )}
            </div>

            {/* Status/Actions */}
            {server.installed ? (
              <div className="flex items-center gap-1">
                {!server.connected && server.authRequired && (
                  <Badge variant="outline" className="text-warning border-warning/30 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Auth needed
                  </Badge>
                )}
                {server.connected && (
                  <Badge variant="outline" className="text-success border-success/30 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            ) : (
              <Badge variant="secondary" className="text-xs">{server.category}</Badge>
            )}
          </div>

          {/* Meta info */}
          {!compact && (
            <div className="flex items-center gap-3 mt-2 text-xs text-foreground-tertiary">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                {server.rating.toFixed(1)}
              </span>
              <span>{server.downloads.toLocaleString()} installs</span>
              <span>{server.tools.length} tools</span>
            </div>
          )}

          {/* Tools preview */}
          {!compact && server.tools.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {server.tools.slice(0, 3).map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
              {server.tools.length > 3 && (
                <span className="text-xs text-foreground-tertiary">
                  +{server.tools.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {server.installed ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onConfigure(server.id)}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-error hover:text-error"
                  onClick={() => onUninstall(server.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() => onInstall(server.id)}
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
