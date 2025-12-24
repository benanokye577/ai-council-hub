import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoicePersona, VOICE_PERSONAS } from '@/types/voicePersona';

interface VoicePersonaSelectorProps {
  selectedPersona: VoicePersona;
  onSelect: (persona: VoicePersona) => void;
  reducedMotion?: boolean;
  className?: string;
}

export function VoicePersonaSelector({
  selectedPersona,
  onSelect,
  reducedMotion = false,
  className,
}: VoicePersonaSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-foreground/80">Voice Persona</h3>
      <div className="grid grid-cols-2 gap-3">
        {VOICE_PERSONAS.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          
          return (
            <motion.button
              key={persona.id}
              onClick={() => onSelect(persona)}
              className={cn(
                "relative p-4 rounded-xl text-left transition-colors",
                "border-2",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-border"
              )}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Icon */}
              <div 
                className="text-2xl mb-2"
                style={{ filter: isSelected ? 'none' : 'grayscale(0.3)' }}
              >
                {persona.icon}
              </div>
              
              {/* Name and description */}
              <h4 className={cn(
                "font-semibold text-sm",
                isSelected ? "text-foreground" : "text-foreground/80"
              )}>
                {persona.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {persona.description}
              </p>
              
              {/* Color accent */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-50"
                style={{ backgroundColor: persona.color }}
              />
            </motion.button>
          );
        })}
      </div>
      
      {/* Note about configuration */}
      <p className="text-xs text-muted-foreground mt-2">
        Configure persona agent IDs in ElevenLabs dashboard
      </p>
    </div>
  );
}
