import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Reminder {
  id: string;
  text: string;
  triggerTime: Date;
  createdAt: Date;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  source: 'voice' | 'manual';
  priority: 'low' | 'medium' | 'high';
}

const STORAGE_KEY = 'nebula_smart_reminders';

export function useSmartReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reminders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReminders(parsed.map((r: any) => ({
          ...r,
          triggerTime: new Date(r.triggerTime),
          createdAt: new Date(r.createdAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
    setIsLoading(false);
  }, []);

  // Save reminders when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }
  }, [reminders, isLoading]);

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.isCompleted && reminder.triggerTime <= now) {
          // Trigger notification
          triggerReminder(reminder);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately on mount

    return () => clearInterval(interval);
  }, [reminders]);

  const triggerReminder = useCallback((reminder: Reminder) => {
    // Show toast notification
    toast.info(`Reminder: ${reminder.text}`, {
      duration: 10000,
      action: {
        label: 'Dismiss',
        onClick: () => completeReminder(reminder.id),
      },
    });

    // Browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification('Nebula Reminder', {
        body: reminder.text,
        icon: '/favicon.jpeg',
        tag: reminder.id,
      });
    }

    // Handle recurring reminders
    if (reminder.isRecurring && reminder.recurringPattern) {
      const nextTrigger = new Date(reminder.triggerTime);
      switch (reminder.recurringPattern) {
        case 'daily':
          nextTrigger.setDate(nextTrigger.getDate() + 1);
          break;
        case 'weekly':
          nextTrigger.setDate(nextTrigger.getDate() + 7);
          break;
        case 'monthly':
          nextTrigger.setMonth(nextTrigger.getMonth() + 1);
          break;
      }
      setReminders(prev => prev.map(r =>
        r.id === reminder.id
          ? { ...r, triggerTime: nextTrigger }
          : r
      ));
    } else {
      completeReminder(reminder.id);
    }
  }, []);

  const parseNaturalLanguageTime = useCallback((text: string): Date | null => {
    const now = new Date();
    const lowerText = text.toLowerCase();

    // Parse relative times
    const inMinutesMatch = lowerText.match(/in (\d+) minutes?/);
    if (inMinutesMatch) {
      const minutes = parseInt(inMinutesMatch[1]);
      return new Date(now.getTime() + minutes * 60 * 1000);
    }

    const inHoursMatch = lowerText.match(/in (\d+) hours?/);
    if (inHoursMatch) {
      const hours = parseInt(inHoursMatch[1]);
      return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    // Parse specific times
    if (lowerText.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM
      return tomorrow;
    }

    if (lowerText.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(9, 0, 0, 0);
      return nextWeek;
    }

    // Parse time of day
    const timeMatch = lowerText.match(/at (\d{1,2}):?(\d{2})?\s*(am|pm)?/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2] || '0');
      const isPM = timeMatch[3] === 'pm';
      
      const result = new Date(now);
      result.setHours(isPM && hours !== 12 ? hours + 12 : hours, minutes, 0, 0);
      
      if (result <= now) {
        result.setDate(result.getDate() + 1);
      }
      return result;
    }

    // Default to 1 hour from now
    return new Date(now.getTime() + 60 * 60 * 1000);
  }, []);

  const createReminderFromVoice = useCallback((transcript: string): Reminder | null => {
    // Check if this is a reminder request
    const reminderPatterns = [
      /remind me (?:to|about) (.+)/i,
      /set a reminder (?:to|for|about) (.+)/i,
      /don't let me forget (?:to|about) (.+)/i,
    ];

    for (const pattern of reminderPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const reminderText = match[1];
        const triggerTime = parseNaturalLanguageTime(reminderText);
        
        if (triggerTime) {
          const newReminder: Reminder = {
            id: crypto.randomUUID(),
            text: reminderText.replace(/in \d+ (minutes?|hours?)/, '').trim(),
            triggerTime,
            createdAt: new Date(),
            isRecurring: reminderText.includes('every'),
            recurringPattern: reminderText.includes('every day') ? 'daily' :
                              reminderText.includes('every week') ? 'weekly' :
                              reminderText.includes('every month') ? 'monthly' : undefined,
            isCompleted: false,
            source: 'voice',
            priority: reminderText.includes('important') || reminderText.includes('urgent') ? 'high' : 'medium',
          };

          setReminders(prev => [...prev, newReminder]);
          return newReminder;
        }
      }
    }

    return null;
  }, [parseNaturalLanguageTime]);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const completeReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, isCompleted: true } : r
    ));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const getUpcomingReminders = useCallback((limit: number = 5) => {
    return reminders
      .filter(r => !r.isCompleted && r.triggerTime > new Date())
      .sort((a, b) => a.triggerTime.getTime() - b.triggerTime.getTime())
      .slice(0, limit);
  }, [reminders]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return {
    reminders,
    isLoading,
    createReminderFromVoice,
    addReminder,
    completeReminder,
    deleteReminder,
    getUpcomingReminders,
    requestNotificationPermission,
  };
}
