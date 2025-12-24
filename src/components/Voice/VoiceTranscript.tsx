import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceState } from "./VoiceOrb";

interface VoiceTranscriptProps {
  userTranscript: string;
  aiResponse: string;
  state: VoiceState;
  className?: string;
}

export function VoiceTranscript({ 
  userTranscript, 
  aiResponse, 
  state,
  className 
}: VoiceTranscriptProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* User transcript */}
      <AnimatePresence mode="wait">
        {userTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-[hsl(187,80%,50%)]/20 shrink-0">
              <Mic className="w-4 h-4 text-[hsl(187,80%,50%)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-foreground-tertiary mb-1">You said</p>
              <p className="text-sm text-foreground">
                {userTranscript}
                {state === 'listening' && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
                  />
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI response */}
      <AnimatePresence mode="wait">
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-success/20 shrink-0">
              <Volume2 className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-foreground-tertiary mb-1">Council response</p>
              <p className="text-sm text-foreground">
                {aiResponse}
                {state === 'speaking' && (
                  <motion.span
                    className="inline-flex gap-0.5 ml-1 align-middle"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1 h-1 rounded-full bg-success"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </motion.span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing indicator */}
      <AnimatePresence>
        {state === 'processing' && !aiResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-foreground-secondary"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            />
            Analyzing your request...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
