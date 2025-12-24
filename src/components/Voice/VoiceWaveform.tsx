import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
  color?: 'primary' | 'cyan' | 'success';
}

const colorClasses = {
  primary: "bg-primary",
  cyan: "bg-[hsl(187,80%,50%)]",
  success: "bg-success",
};

export function VoiceWaveform({ 
  isActive, 
  barCount = 20, 
  className,
  color = 'cyan'
}: VoiceWaveformProps) {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(20));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(barCount).fill(20));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map(() => Math.random() * 80 + 20)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div className={cn("flex items-end justify-center gap-0.5 h-16", className)}>
      {heights.map((height, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-1 rounded-full transition-colors",
            isActive ? colorClasses[color] : "bg-foreground-tertiary/30"
          )}
          animate={{ height: `${height}%` }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
