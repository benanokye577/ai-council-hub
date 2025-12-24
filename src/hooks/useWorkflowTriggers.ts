import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface WorkflowTrigger {
  id: string;
  name: string;
  description: string;
  triggerType: 'keyword' | 'intent' | 'schedule' | 'event';
  triggerValue: string;
  actions: WorkflowAction[];
  isEnabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  executionCount: number;
}

export interface WorkflowAction {
  id: string;
  type: 'webhook' | 'notification' | 'email' | 'api_call' | 'internal';
  config: Record<string, string>;
  order: number;
}

export interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

const STORAGE_KEY = 'nebula_workflow_triggers';

const defaultTriggers: WorkflowTrigger[] = [
  {
    id: 'meeting-reminder',
    name: 'Meeting Reminder',
    description: 'Send notification when meeting is mentioned',
    triggerType: 'keyword',
    triggerValue: 'meeting,call,standup',
    actions: [
      {
        id: 'notify-1',
        type: 'notification',
        config: { message: 'Meeting mentioned in conversation' },
        order: 0,
      },
    ],
    isEnabled: true,
    createdAt: new Date(),
    executionCount: 0,
  },
  {
    id: 'task-created',
    name: 'Task Creation Webhook',
    description: 'Trigger webhook when a task is discussed',
    triggerType: 'intent',
    triggerValue: 'create_task',
    actions: [
      {
        id: 'webhook-1',
        type: 'webhook',
        config: {
          url: 'https://hooks.example.com/tasks',
          method: 'POST',
        },
        order: 0,
      },
    ],
    isEnabled: false,
    createdAt: new Date(),
    executionCount: 0,
  },
];

export function useWorkflowTriggers() {
  const [triggers, setTriggers] = useState<WorkflowTrigger[]>(defaultTriggers);
  const [isLoading, setIsLoading] = useState(true);
  const [executionLog, setExecutionLog] = useState<Array<{
    triggerId: string;
    timestamp: Date;
    success: boolean;
    message: string;
  }>>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTriggers(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          lastTriggered: t.lastTriggered ? new Date(t.lastTriggered) : undefined,
        })));
      }
    } catch (error) {
      console.error('Failed to load workflow triggers:', error);
    }
    setIsLoading(false);
  }, []);

  // Save when triggers change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
    }
  }, [triggers, isLoading]);

  const executeAction = useCallback(async (action: WorkflowAction, context: Record<string, any>) => {
    switch (action.type) {
      case 'webhook':
        try {
          const response = await fetch(action.config.url, {
            method: action.config.method || 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...JSON.parse(action.config.headers || '{}'),
            },
            body: action.config.body || JSON.stringify(context),
          });
          return { success: response.ok, message: `Webhook: ${response.status}` };
        } catch (error) {
          return { success: false, message: `Webhook failed: ${error}` };
        }

      case 'notification':
        toast.info(action.config.message || 'Workflow triggered');
        if (Notification.permission === 'granted') {
          new Notification('Nebula Workflow', {
            body: action.config.message || 'Workflow triggered',
            icon: '/favicon.jpeg',
          });
        }
        return { success: true, message: 'Notification sent' };

      case 'internal':
        // Handle internal actions (navigation, state changes, etc.)
        return { success: true, message: `Internal action: ${action.config.action}` };

      default:
        return { success: false, message: `Unknown action type: ${action.type}` };
    }
  }, []);

  const executeTrigger = useCallback(async (trigger: WorkflowTrigger, context: Record<string, any> = {}) => {
    if (!trigger.isEnabled) return;

    const results: Array<{ actionId: string; success: boolean; message: string }> = [];

    // Sort actions by order and execute
    const sortedActions = [...trigger.actions].sort((a, b) => a.order - b.order);
    
    for (const action of sortedActions) {
      const result = await executeAction(action, context);
      results.push({ actionId: action.id, ...result });
    }

    // Update trigger stats
    setTriggers(prev => prev.map(t =>
      t.id === trigger.id
        ? {
            ...t,
            lastTriggered: new Date(),
            executionCount: t.executionCount + 1,
          }
        : t
    ));

    // Log execution
    const allSuccess = results.every(r => r.success);
    setExecutionLog(prev => [
      ...prev.slice(-99),
      {
        triggerId: trigger.id,
        timestamp: new Date(),
        success: allSuccess,
        message: results.map(r => r.message).join('; '),
      },
    ]);

    return { success: allSuccess, results };
  }, [executeAction]);

  const processConversation = useCallback(async (
    transcript: string,
    context: Record<string, any> = {}
  ) => {
    const lowerTranscript = transcript.toLowerCase();
    const triggeredWorkflows: WorkflowTrigger[] = [];

    for (const trigger of triggers) {
      if (!trigger.isEnabled) continue;

      let shouldTrigger = false;

      switch (trigger.triggerType) {
        case 'keyword':
          const keywords = trigger.triggerValue.split(',').map(k => k.trim().toLowerCase());
          shouldTrigger = keywords.some(keyword => lowerTranscript.includes(keyword));
          break;

        case 'intent':
          // Simple intent matching based on patterns
          const intentPatterns: Record<string, string[]> = {
            create_task: ['create task', 'add task', 'new task', 'make a task'],
            schedule_meeting: ['schedule meeting', 'book meeting', 'set up a call'],
            send_email: ['send email', 'email to', 'send a message to'],
            create_reminder: ['remind me', 'set reminder', 'don\'t forget'],
          };
          const patterns = intentPatterns[trigger.triggerValue] || [];
          shouldTrigger = patterns.some(pattern => lowerTranscript.includes(pattern));
          break;
      }

      if (shouldTrigger) {
        triggeredWorkflows.push(trigger);
        await executeTrigger(trigger, { ...context, transcript });
      }
    }

    return triggeredWorkflows;
  }, [triggers, executeTrigger]);

  const addTrigger = useCallback((trigger: Omit<WorkflowTrigger, 'id' | 'createdAt' | 'executionCount'>) => {
    const newTrigger: WorkflowTrigger = {
      ...trigger,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      executionCount: 0,
    };
    setTriggers(prev => [...prev, newTrigger]);
    toast.success(`Workflow "${trigger.name}" created`);
    return newTrigger;
  }, []);

  const updateTrigger = useCallback((id: string, updates: Partial<WorkflowTrigger>) => {
    setTriggers(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  const deleteTrigger = useCallback((id: string) => {
    setTriggers(prev => prev.filter(t => t.id !== id));
    toast.success('Workflow deleted');
  }, []);

  const toggleTrigger = useCallback((id: string) => {
    setTriggers(prev => prev.map(t =>
      t.id === id ? { ...t, isEnabled: !t.isEnabled } : t
    ));
  }, []);

  const addActionToTrigger = useCallback((triggerId: string, action: Omit<WorkflowAction, 'id' | 'order'>) => {
    setTriggers(prev => prev.map(t => {
      if (t.id !== triggerId) return t;
      const newAction: WorkflowAction = {
        ...action,
        id: crypto.randomUUID(),
        order: t.actions.length,
      };
      return { ...t, actions: [...t.actions, newAction] };
    }));
  }, []);

  return {
    triggers,
    isLoading,
    executionLog,
    processConversation,
    executeTrigger,
    addTrigger,
    updateTrigger,
    deleteTrigger,
    toggleTrigger,
    addActionToTrigger,
  };
}
