import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface VoiceCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

interface UseVoiceCommandsOptions {
  onStop?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onRepeat?: () => void;
  onSlower?: () => void;
  onFaster?: () => void;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const commands = useMemo<VoiceCommand[]>(() => [
    {
      keywords: ['stop', 'end', 'bye', 'goodbye'],
      action: () => {
        options.onStop?.();
        toast.info('Ending conversation');
      },
      description: 'End the conversation',
    },
    {
      keywords: ['mute', 'quiet', 'silence'],
      action: () => {
        options.onMute?.();
        toast.info('Muted');
      },
      description: 'Mute audio',
    },
    {
      keywords: ['unmute', 'speak', 'audio on'],
      action: () => {
        options.onUnmute?.();
        toast.info('Unmuted');
      },
      description: 'Unmute audio',
    },
    {
      keywords: ['repeat', 'say again', 'what did you say'],
      action: () => {
        options.onRepeat?.();
      },
      description: 'Repeat last response',
    },
    {
      keywords: ['slower', 'slow down', 'speak slower'],
      action: () => {
        options.onSlower?.();
        toast.info('Speaking slower');
      },
      description: 'Decrease speech speed',
    },
    {
      keywords: ['faster', 'speed up', 'speak faster'],
      action: () => {
        options.onFaster?.();
        toast.info('Speaking faster');
      },
      description: 'Increase speech speed',
    },
  ], [options]);

  const processTranscript = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const command of commands) {
      for (const keyword of command.keywords) {
        if (lowerTranscript.includes(keyword)) {
          command.action();
          return { matched: true, command: command.description };
        }
      }
    }
    
    return { matched: false, command: null };
  }, [commands]);

  return {
    commands,
    processTranscript,
  };
}
