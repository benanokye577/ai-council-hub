import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const suggestions = [
  "Help me refactor this code",
  "Research the latest AI trends",
  "Write a blog post about...",
];

export function QuickChatCard() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    // Handle send
    setMessage("");
  };

  return (
    <motion.div
      className={cn(
        "gradient-border-card p-5 transition-all duration-300",
        isFocused && "ring-1 ring-primary/30"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Quick Chat</h3>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Solaris anything..."
          className="w-full h-24 px-4 py-3 rounded-lg bg-background-secondary border border-border resize-none text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary/50 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        {/* Actions */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="text-foreground-tertiary hover:text-foreground">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-foreground-tertiary hover:text-foreground">
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            variant="gradient"
            size="icon-sm"
            onClick={handleSend}
            disabled={!message.trim()}
            className="ml-1"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => setMessage(suggestion)}
            className="px-3 py-1.5 rounded-full text-xs bg-background-hover text-foreground-secondary hover:text-foreground hover:bg-background-elevated transition-all border border-border-subtle hover:border-primary/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
