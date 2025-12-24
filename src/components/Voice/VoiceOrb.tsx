import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceOrbProps {
  state: VoiceState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const stateColors = {
  idle: "from-foreground-tertiary/30 to-foreground-tertiary/10",
  listening: "from-[hsl(187,80%,50%)] to-[hsl(187,80%,30%)]",
  processing: "from-primary to-primary-light",
  speaking: "from-success to-[hsl(142,60%,35%)]",
};

const pulseColors = {
  idle: "bg-foreground-tertiary/20",
  listening: "bg-[hsl(187,80%,50%)/0.3]",
  processing: "bg-primary/30",
  speaking: "bg-success/30",
};

export function VoiceOrb({ state, size = 'md', className, onClick }: VoiceOrbProps) {
  const isActive = state !== 'idle';

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer pulse ring */}
      {isActive && (
        <motion.div
          className={cn(
            "absolute rounded-full",
            sizeClasses[size],
            pulseColors[state]
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Second pulse ring */}
      {isActive && (
        <motion.div
          className={cn(
            "absolute rounded-full",
            sizeClasses[size],
            pulseColors[state]
          )}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      )}

      {/* Main orb */}
      <motion.button
        className={cn(
          "relative rounded-full bg-gradient-to-br shadow-lg transition-colors",
          sizeClasses[size],
          stateColors[state],
          onClick && "cursor-pointer hover:brightness-110"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? {
          boxShadow: [
            `0 0 20px hsl(var(--primary) / 0.3)`,
            `0 0 40px hsl(var(--primary) / 0.5)`,
            `0 0 20px hsl(var(--primary) / 0.3)`,
          ],
        } : {}}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        onClick={onClick}
      >
        {/* Inner gradient glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

        {/* Center dots animation */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "rounded-full bg-white/80",
                size === 'sm' ? "w-1.5 h-1.5" : size === 'md' ? "w-2 h-2" : "w-2.5 h-2.5"
              )}
              animate={state === 'listening' ? {
                y: [-3, 3, -3],
              } : state === 'processing' ? {
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              } : state === 'speaking' ? {
                y: [-4, 4, -4],
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                duration: state === 'speaking' ? 0.4 : 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.button>

      {/* State label */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground-secondary whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {state === 'idle' && "Tap to speak"}
        {state === 'listening' && "Listening..."}
        {state === 'processing' && "Processing..."}
        {state === 'speaking' && "Speaking..."}
      </motion.div>
    </div>
  );
}
