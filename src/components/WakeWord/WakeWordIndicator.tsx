import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WakeWordIndicatorProps {
  isListening?: boolean;
  isTriggered?: boolean;
  wakeWord?: string;
  onTrigger?: () => void;
  className?: string;
}

export function WakeWordIndicator({
  isListening = false,
  isTriggered = false,
  wakeWord = "Hey Council",
  onTrigger,
  className
}: WakeWordIndicatorProps) {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseCount(p => (p + 1) % 3);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className={cn("relative", className)}>
      {/* Background pulses when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{
                  scale: [1, 1.8, 2.2],
                  opacity: [0.4, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Trigger flash */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            className="absolute inset-0 rounded-full bg-success"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Main indicator */}
      <motion.button
        onClick={onTrigger}
        className={cn(
          "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          isListening 
            ? "bg-primary/20 text-primary" 
            : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
          isTriggered && "bg-success/20 text-success"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isListening ? (
          <Waves className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        
        {/* Active dot */}
        {isListening && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
        )}
      </motion.button>

      {/* Wake word tooltip */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="px-2 py-1 rounded-md bg-success/20 text-success text-xs font-medium">
              "{wakeWord}" detected
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}