import { motion } from "framer-motion";
import { Copy, MessageSquare, FileText, TestTube, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResponseType = "code" | "research" | "creative" | "general";

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Copy;
  prompt: string;
}

const actionsByType: Record<ResponseType, QuickAction[]> = {
  code: [
    { id: "copy", label: "Copy Code", icon: Copy, prompt: "" },
    { id: "explain", label: "Explain More", icon: MessageSquare, prompt: "Can you explain this code in more detail?" },
    { id: "tests", label: "Add Tests", icon: TestTube, prompt: "Can you write unit tests for this code?" },
    { id: "docs", label: "Add Documentation", icon: FileText, prompt: "Can you add JSDoc comments to this code?" },
  ],
  research: [
    { id: "deepdive", label: "Deep Dive", icon: Sparkles, prompt: "Can you explore this topic in more depth?" },
    { id: "summarize", label: "Summarize", icon: FileText, prompt: "Can you provide a concise summary of this?" },
    { id: "save", label: "Save to Knowledge Base", icon: BookOpen, prompt: "" },
    { id: "sources", label: "Show Sources", icon: MessageSquare, prompt: "What are the sources for this information?" },
  ],
  creative: [
    { id: "variations", label: "More Variations", icon: RefreshCw, prompt: "Can you provide some alternative versions?" },
    { id: "expand", label: "Expand This", icon: Sparkles, prompt: "Can you expand on this further?" },
    { id: "tone", label: "Adjust Tone", icon: MessageSquare, prompt: "Can you rewrite this in a more professional tone?" },
    { id: "copy", label: "Copy Text", icon: Copy, prompt: "" },
  ],
  general: [
    { id: "followup", label: "Follow Up", icon: MessageSquare, prompt: "Can you tell me more about this?" },
    { id: "clarify", label: "Clarify", icon: Sparkles, prompt: "Can you clarify this point?" },
    { id: "examples", label: "Give Examples", icon: FileText, prompt: "Can you provide some examples?" },
    { id: "copy", label: "Copy", icon: Copy, prompt: "" },
  ],
};

interface QuickActionsProps {
  responseType: ResponseType;
  onAction: (action: QuickAction) => void;
  content?: string;
}

export function QuickActions({ responseType, onAction, content }: QuickActionsProps) {
  const actions = actionsByType[responseType];

  const handleAction = (action: QuickAction) => {
    if (action.id === "copy" && content) {
      navigator.clipboard.writeText(content);
      return;
    }
    onAction(action);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
            onClick={() => handleAction(action)}
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function detectResponseType(content: string): ResponseType {
  // Simple heuristic to detect response type
  if (content.includes("```") || content.includes("function") || content.includes("const ") || content.includes("import ")) {
    return "code";
  }
  if (content.includes("research") || content.includes("findings") || content.includes("analysis") || content.includes("data shows")) {
    return "research";
  }
  if (content.includes("creative") || content.includes("story") || content.includes("imagine") || content.includes("draft")) {
    return "creative";
  }
  return "general";
}
