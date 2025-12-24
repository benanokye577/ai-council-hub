import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  Calendar,
  Repeat,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSmartReminders, Reminder } from '@/hooks/useSmartReminders';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

interface RemindersManagerProps {
  className?: string;
  onClose?: () => void;
}

export function RemindersManager({ className, onClose }: RemindersManagerProps) {
  const {
    reminders,
    addReminder,
    completeReminder,
    deleteReminder,
    getUpcomingReminders,
    requestNotificationPermission,
  } = useSmartReminders();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const upcomingReminders = getUpcomingReminders(10);
  const completedReminders = reminders.filter(r => r.isCompleted);

  const handleAddReminder = () => {
    if (!newReminderText.trim() || !newReminderTime) return;

    addReminder({
      text: newReminderText,
      triggerTime: new Date(newReminderTime),
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      isCompleted: false,
      source: 'manual',
      priority,
    });

    setNewReminderText('');
    setNewReminderTime('');
    setIsRecurring(false);
    setShowAddForm(false);
  };

  const priorityColors = {
    low: 'bg-info/20 text-info border-info/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-error/20 text-error border-error/30',
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Smart Reminders</h2>
            <p className="text-sm text-foreground-secondary">
              {upcomingReminders.length} upcoming
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestNotificationPermission}
          >
            Enable Notifications
          </Button>
          <Button
            size="sm"
            className="btn-gradient"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Add Reminder Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Reminder Text</Label>
                  <Input
                    placeholder="What would you like to be reminded about?"
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>When</Label>
                    <Input
                      type="datetime-local"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                    <Label>Recurring</Label>
                  </div>

                  {isRecurring && (
                    <Select
                      value={recurringPattern}
                      onValueChange={(v) => setRecurringPattern(v as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReminder}>
                    Create Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Reminders */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Upcoming
        </h3>
        {upcomingReminders.length === 0 ? (
          <p className="text-sm text-foreground-tertiary py-4 text-center">
            No upcoming reminders
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onComplete={() => completeReminder(reminder.id)}
                onDelete={() => deleteReminder(reminder.id)}
                priorityColors={priorityColors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Completed ({completedReminders.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {completedReminders.slice(0, 3).map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onDelete={() => deleteReminder(reminder.id)}
                priorityColors={priorityColors}
                isCompleted
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReminderCard({
  reminder,
  onComplete,
  onDelete,
  priorityColors,
  isCompleted,
}: {
  reminder: Reminder;
  onComplete?: () => void;
  onDelete: () => void;
  priorityColors: Record<string, string>;
  isCompleted?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border',
        'bg-background-elevated/50 border-border/50',
        isCompleted && 'line-through'
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {!isCompleted && onComplete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onComplete}
          >
            <CheckCircle2 className="w-4 h-4 text-success" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{reminder.text}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-foreground-tertiary">
              {formatDistanceToNow(reminder.triggerTime, { addSuffix: true })}
            </span>
            {reminder.isRecurring && (
              <Badge variant="outline" className="text-xs gap-1">
                <Repeat className="w-3 h-3" />
                {reminder.recurringPattern}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={cn('text-xs', priorityColors[reminder.priority])}>
          {reminder.priority}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-error hover:text-error"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
