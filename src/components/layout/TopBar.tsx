import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  Command,
  Zap,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const models = [
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "local-llama", name: "Llama 3.1", provider: "Local" },
];

export function TopBar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [hasNotifications] = useState(true);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 border-b border-border bg-background-secondary/50 backdrop-blur-xl flex items-center justify-between px-4 gap-4"
    >
      {/* Search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 h-9 px-4 rounded-lg glass-card flex-1 max-w-md hover:bg-background-hover/50 transition-all group cursor-pointer"
      >
        <Search className="w-4 h-4 text-foreground-tertiary group-hover:text-foreground-secondary transition-colors" />
        <span className="text-sm text-foreground-muted group-hover:text-foreground-secondary transition-colors">
          Search or type a command...
        </span>
        <div className="ml-auto flex items-center gap-1 text-foreground-tertiary">
          <kbd className="h-5 px-1.5 rounded bg-background-hover text-[10px] font-mono flex items-center">
            <Command className="w-3 h-3" />
          </kbd>
          <kbd className="h-5 px-1.5 rounded bg-background-hover text-[10px] font-mono">
            K
          </kbd>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {/* Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium">{selectedModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-foreground-tertiary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-foreground-secondary">
              Select Model
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className="flex items-center justify-between"
              >
                <span>{model.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {model.provider}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-4 h-4" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon-sm">
          <Moon className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
  );
}
