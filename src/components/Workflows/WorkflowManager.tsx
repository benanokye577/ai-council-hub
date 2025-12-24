import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow,
  Plus,
  Trash2,
  Edit2,
  Zap,
  Webhook,
  Bell,
  Mail,
  Play,
  ToggleLeft,
  ToggleRight,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWorkflowTriggers, WorkflowTrigger, WorkflowAction } from '@/hooks/useWorkflowTriggers';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface WorkflowManagerProps {
  className?: string;
  onClose?: () => void;
}

export function WorkflowManager({ className, onClose }: WorkflowManagerProps) {
  const {
    triggers,
    executionLog,
    addTrigger,
    updateTrigger,
    deleteTrigger,
    toggleTrigger,
    addActionToTrigger,
  } = useWorkflowTriggers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTrigger, setExpandedTrigger] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'keyword' as WorkflowTrigger['triggerType'],
    triggerValue: '',
  });

  const [newAction, setNewAction] = useState({
    type: 'notification' as WorkflowAction['type'],
    config: {} as Record<string, string>,
  });

  const triggerTypeLabels = {
    keyword: 'Keyword Match',
    intent: 'Intent Detection',
    schedule: 'Scheduled',
    event: 'Event-based',
  };

  const actionTypeIcons = {
    webhook: <Webhook className="w-4 h-4" />,
    notification: <Bell className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    api_call: <Zap className="w-4 h-4" />,
    internal: <Play className="w-4 h-4" />,
  };

  const handleAddTrigger = () => {
    if (!formData.name.trim() || !formData.triggerValue.trim()) return;

    addTrigger({
      name: formData.name,
      description: formData.description,
      triggerType: formData.triggerType,
      triggerValue: formData.triggerValue,
      actions: [],
      isEnabled: true,
    });

    setFormData({ name: '', description: '', triggerType: 'keyword', triggerValue: '' });
    setShowAddForm(false);
  };

  const handleAddAction = (triggerId: string) => {
    addActionToTrigger(triggerId, {
      type: newAction.type,
      config: newAction.config,
    });
    setNewAction({ type: 'notification', config: {} });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Workflow className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Workflow Triggers</h2>
            <p className="text-sm text-foreground-secondary">
              {triggers.filter(t => t.isEnabled).length} active workflows
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="btn-gradient"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Workflow
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Workflow Name</Label>
                    <Input
                      placeholder="e.g., Meeting Notification"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select
                      value={formData.triggerType}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, triggerType: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keyword">Keyword Match</SelectItem>
                        <SelectItem value="intent">Intent Detection</SelectItem>
                        <SelectItem value="schedule">Scheduled</SelectItem>
                        <SelectItem value="event">Event-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    {formData.triggerType === 'keyword' 
                      ? 'Keywords (comma-separated)' 
                      : formData.triggerType === 'intent'
                      ? 'Intent Name'
                      : 'Trigger Value'}
                  </Label>
                  <Input
                    placeholder={
                      formData.triggerType === 'keyword' 
                        ? 'meeting, call, standup' 
                        : formData.triggerType === 'intent'
                        ? 'create_task'
                        : 'Enter trigger value'
                    }
                    value={formData.triggerValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggerValue: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="What does this workflow do?"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTrigger}>
                    Create Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflows List */}
      <div className="space-y-2">
        {triggers.map((trigger) => (
          <motion.div key={trigger.id} layout>
            <Card className={cn(
              'glass-card transition-opacity',
              !trigger.isEnabled && 'opacity-50'
            )}>
              <CardContent className="p-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedTrigger(
                    expandedTrigger === trigger.id ? null : trigger.id
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{trigger.name}</p>
                      <p className="text-sm text-foreground-secondary">
                        {trigger.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {triggerTypeLabels[trigger.triggerType]}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {trigger.actions.length} actions
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrigger(trigger.id);
                      }}
                    >
                      {trigger.isEnabled ? (
                        <ToggleRight className="w-4 h-4 text-success" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-foreground-tertiary" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error hover:text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrigger(trigger.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedTrigger === trigger.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTrigger === trigger.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border/50 space-y-4"
                    >
                      {/* Trigger Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-foreground-secondary">Trigger Value</p>
                          <p className="font-mono text-xs bg-background-elevated/50 p-2 rounded mt-1">
                            {trigger.triggerValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground-secondary">Executions</p>
                          <p className="font-bold text-lg">{trigger.executionCount}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Actions</p>
                        {trigger.actions.length === 0 ? (
                          <p className="text-sm text-foreground-tertiary">No actions configured</p>
                        ) : (
                          trigger.actions.map((action, index) => (
                            <div
                              key={action.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-background-elevated/30"
                            >
                              <div className="p-1.5 rounded bg-primary/20">
                                {actionTypeIcons[action.type]}
                              </div>
                              <span className="text-sm capitalize">{action.type.replace('_', ' ')}</span>
                              {action.config.url && (
                                <span className="text-xs text-foreground-tertiary truncate max-w-[200px]">
                                  {action.config.url}
                                </span>
                              )}
                              {action.config.message && (
                                <span className="text-xs text-foreground-tertiary truncate max-w-[200px]">
                                  "{action.config.message}"
                                </span>
                              )}
                            </div>
                          ))
                        )}

                        {/* Add Action */}
                        <div className="flex gap-2 mt-2">
                          <Select
                            value={newAction.type}
                            onValueChange={(v) => setNewAction(prev => ({ ...prev, type: v as any }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notification">Notification</SelectItem>
                              <SelectItem value="webhook">Webhook</SelectItem>
                              <SelectItem value="internal">Internal</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder={
                              newAction.type === 'webhook' 
                                ? 'Webhook URL' 
                                : newAction.type === 'notification'
                                ? 'Notification message'
                                : 'Action config'
                            }
                            className="flex-1"
                            onChange={(e) => setNewAction(prev => ({
                              ...prev,
                              config: newAction.type === 'webhook' 
                                ? { url: e.target.value, method: 'POST' }
                                : { message: e.target.value }
                            }))}
                          />
                          <Button
                            size="icon"
                            onClick={() => handleAddAction(trigger.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Last Triggered */}
                      {trigger.lastTriggered && (
                        <p className="text-xs text-foreground-tertiary">
                          Last triggered: {format(trigger.lastTriggered, 'PPp')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {executionLog.slice(-5).reverse().map((log, index) => {
                const trigger = triggers.find(t => t.id === log.triggerId);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-background-elevated/30"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        log.success ? 'bg-success' : 'bg-error'
                      )} />
                      <span>{trigger?.name || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-foreground-tertiary">
                      {format(log.timestamp, 'HH:mm:ss')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
