import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusTimer } from "./FocusTimer";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FocusOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle?: string;
  onComplete?: () => void;
}

export function FocusOverlay({ isOpen, onClose, taskTitle, onComplete }: FocusOverlayProps) {
  const [ambientSound, setAmbientSound] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          className="h-14 px-6 rounded-full btn-gradient shadow-lg"
          onClick={() => setMinimized(false)}
        >
          <span className="text-lg font-mono mr-2">25:00</span>
          <Minimize2 className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
          />

          {/* Ambient gradient */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setAmbientSound(!ambientSound)}
              >
                {ambientSound ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setMinimized(true)}
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Timer */}
            <FocusTimer
              initialMinutes={25}
              breakMinutes={5}
              taskTitle={taskTitle}
              onComplete={onComplete}
            />

            {/* Motivational text */}
            <motion.p
              className="mt-8 text-sm text-foreground-tertiary text-center max-w-md"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Stay focused. The council is monitoring your progress.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
