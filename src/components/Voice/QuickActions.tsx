import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, ListTodo, Lightbulb, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'summarize',
    label: 'Summarize',
    icon: <Sparkles className="w-4 h-4" />,
    prompt: 'Please summarize what we discussed.',
  },
  {
    id: 'help',
    label: 'Help',
    icon: <HelpCircle className="w-4 h-4" />,
    prompt: 'What can you help me with?',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: <ListTodo className="w-4 h-4" />,
    prompt: 'What tasks should I focus on today?',
  },
  {
    id: 'ideas',
    label: 'Ideas',
    icon: <Lightbulb className="w-4 h-4" />,
    prompt: 'Give me some creative ideas.',
  },
  {
    id: 'continue',
    label: 'Continue',
    icon: <RefreshCw className="w-4 h-4" />,
    prompt: 'Please continue from where you left off.',
  },
];

interface QuickActionsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
  reducedMotion?: boolean;
  className?: string;
}

export function QuickActions({ onAction, disabled, reducedMotion, className }: QuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {QUICK_ACTIONS.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => onAction(action.prompt)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
            "bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border",
            "text-foreground/80 hover:text-foreground",
            "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
        >
          {action.icon}
          <span>{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
