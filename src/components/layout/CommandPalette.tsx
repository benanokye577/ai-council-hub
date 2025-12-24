import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Zap,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  icon: typeof Search;
  label: string;
  description?: string;
  action: () => void;
  category: string;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: "new-chat",
      icon: MessageSquare,
      label: "New Chat",
      description: "Start a new conversation",
      category: "Actions",
      action: () => {
        navigate("/chat");
        onClose();
      },
    },
    {
      id: "search-knowledge",
      icon: BookOpen,
      label: "Search Knowledge Base",
      description: "Find documents and sources",
      category: "Actions",
      action: () => {
        navigate("/knowledge");
        onClose();
      },
    },
    {
      id: "switch-model",
      icon: Zap,
      label: "Switch Model",
      description: "Change the active AI model",
      category: "Actions",
      action: () => onClose(),
    },
    {
      id: "nav-dashboard",
      icon: Sparkles,
      label: "Go to Dashboard",
      category: "Navigation",
      action: () => {
        navigate("/");
        onClose();
      },
    },
    {
      id: "nav-agents",
      icon: Users,
      label: "Go to Agents",
      category: "Navigation",
      action: () => {
        navigate("/agents");
        onClose();
      },
    },
    {
      id: "nav-analytics",
      icon: BarChart3,
      label: "Go to Analytics",
      category: "Navigation",
      action: () => {
        navigate("/analytics");
        onClose();
      },
    },
    {
      id: "nav-settings",
      icon: Settings,
      label: "Go to Settings",
      category: "Navigation",
      action: () => {
        navigate("/settings");
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) =>
            i < filteredCommands.length - 1 ? i + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) =>
            i > 0 ? i - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [open, filteredCommands, selectedIndex, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  let flatIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 command-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="glass-card rounded-xl shadow-2xl overflow-hidden border border-border">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-foreground-tertiary" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder:text-foreground-muted outline-none text-sm"
                  autoFocus
                />
                <kbd className="h-5 px-1.5 rounded bg-background-hover text-[10px] font-mono text-foreground-tertiary">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="px-2 py-1.5 text-xs font-medium text-foreground-tertiary uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((cmd) => {
                      const currentIndex = flatIndex++;
                      const isSelected = currentIndex === selectedIndex;

                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                            isSelected
                              ? "bg-primary/10 text-foreground"
                              : "text-foreground-secondary hover:bg-background-hover"
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <cmd.icon
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isSelected ? "text-primary" : ""
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div className="text-xs text-foreground-muted truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-primary" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="py-8 text-center text-foreground-muted">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No commands found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-xs text-foreground-tertiary bg-background-secondary/50">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="h-4 px-1 rounded bg-background-hover text-[10px] font-mono">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="h-4 px-1 rounded bg-background-hover text-[10px] font-mono">
                      ↵
                    </kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="h-4 px-1 rounded bg-background-hover text-[10px] font-mono">
                    ESC
                  </kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
