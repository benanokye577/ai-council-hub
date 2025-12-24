import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CustomCommand {
  id: string;
  trigger: string;
  action: string;
  type: 'speak' | 'navigate' | 'execute' | 'shortcut';
  parameters?: Record<string, string>;
  isEnabled: boolean;
  createdAt: Date;
  usageCount: number;
}

const STORAGE_KEY = 'nebula_custom_commands';

const defaultCommands: CustomCommand[] = [
  {
    id: 'launch-report',
    trigger: 'launch report',
    action: 'Navigate to analytics page',
    type: 'navigate',
    parameters: { path: '/analytics' },
    isEnabled: true,
    createdAt: new Date(),
    usageCount: 0,
  },
  {
    id: 'daily-summary',
    trigger: 'give me a summary',
    action: 'Read daily brief',
    type: 'speak',
    parameters: { content: 'daily_brief' },
    isEnabled: true,
    createdAt: new Date(),
    usageCount: 0,
  },
  {
    id: 'start-focus',
    trigger: 'start focus mode',
    action: 'Navigate to focus page',
    type: 'navigate',
    parameters: { path: '/focus' },
    isEnabled: true,
    createdAt: new Date(),
    usageCount: 0,
  },
];

export function useCustomVoiceCommands() {
  const [commands, setCommands] = useState<CustomCommand[]>(defaultCommands);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCommands(parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load custom commands:', error);
    }
    setIsLoading(false);
  }, []);

  // Save when commands change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(commands));
    }
  }, [commands, isLoading]);

  const addCommand = useCallback((command: Omit<CustomCommand, 'id' | 'createdAt' | 'usageCount'>) => {
    const newCommand: CustomCommand = {
      ...command,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      usageCount: 0,
    };
    setCommands(prev => [...prev, newCommand]);
    toast.success(`Custom command "${command.trigger}" created`);
    return newCommand;
  }, []);

  const updateCommand = useCallback((id: string, updates: Partial<CustomCommand>) => {
    setCommands(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);

  const deleteCommand = useCallback((id: string) => {
    setCommands(prev => prev.filter(c => c.id !== id));
    toast.success('Command deleted');
  }, []);

  const toggleCommand = useCallback((id: string) => {
    setCommands(prev => prev.map(c =>
      c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
    ));
  }, []);

  const processTranscript = useCallback((
    transcript: string,
    handlers: {
      onNavigate?: (path: string) => void;
      onSpeak?: (content: string) => void;
      onExecute?: (action: string, params?: Record<string, string>) => void;
    }
  ) => {
    const lowerTranscript = transcript.toLowerCase().trim();

    for (const command of commands) {
      if (!command.isEnabled) continue;

      if (lowerTranscript.includes(command.trigger.toLowerCase())) {
        // Increment usage count
        setCommands(prev => prev.map(c =>
          c.id === command.id ? { ...c, usageCount: c.usageCount + 1 } : c
        ));

        // Execute the command
        switch (command.type) {
          case 'navigate':
            if (command.parameters?.path && handlers.onNavigate) {
              handlers.onNavigate(command.parameters.path);
              toast.info(`Navigating to ${command.parameters.path}`);
            }
            break;
          case 'speak':
            if (command.parameters?.content && handlers.onSpeak) {
              handlers.onSpeak(command.parameters.content);
            }
            break;
          case 'execute':
            if (handlers.onExecute) {
              handlers.onExecute(command.action, command.parameters);
            }
            break;
          case 'shortcut':
            toast.info(`Executing shortcut: ${command.action}`);
            if (handlers.onExecute) {
              handlers.onExecute(command.action, command.parameters);
            }
            break;
        }

        return { matched: true, command };
      }
    }

    return { matched: false, command: null };
  }, [commands]);

  const getMostUsedCommands = useCallback((limit: number = 5) => {
    return [...commands]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [commands]);

  const parseCommandFromVoice = useCallback((transcript: string): Partial<CustomCommand> | null => {
    // Try to parse "when I say X, do Y" patterns
    const patterns = [
      /when i say ['"]?(.+?)['"]?,?\s*(?:then\s+)?(.+)/i,
      /create command ['"]?(.+?)['"]?\s*(?:to|that)\s*(.+)/i,
      /add shortcut ['"]?(.+?)['"]?\s*(?:for|to)\s*(.+)/i,
    ];

    for (const pattern of patterns) {
      const match = transcript.match(pattern);
      if (match) {
        const trigger = match[1].trim();
        const action = match[2].trim();

        // Determine command type from action
        let type: CustomCommand['type'] = 'execute';
        let parameters: Record<string, string> = {};

        if (action.includes('navigate') || action.includes('go to') || action.includes('open')) {
          type = 'navigate';
          const pathMatch = action.match(/(?:navigate to|go to|open)\s+(\S+)/i);
          if (pathMatch) {
            parameters.path = `/${pathMatch[1].toLowerCase()}`;
          }
        } else if (action.includes('say') || action.includes('read') || action.includes('tell me')) {
          type = 'speak';
          parameters.content = action;
        }

        return {
          trigger,
          action,
          type,
          parameters,
          isEnabled: true,
        };
      }
    }

    return null;
  }, []);

  return {
    commands,
    isLoading,
    addCommand,
    updateCommand,
    deleteCommand,
    toggleCommand,
    processTranscript,
    getMostUsedCommands,
    parseCommandFromVoice,
  };
}
