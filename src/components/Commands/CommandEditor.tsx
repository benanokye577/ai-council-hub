import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Zap,
  Navigation,
  Volume2,
  Play,
  ToggleLeft,
  ToggleRight,
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
import { useCustomVoiceCommands, CustomCommand } from '@/hooks/useCustomVoiceCommands';
import { cn } from '@/lib/utils';

interface CommandEditorProps {
  className?: string;
  onClose?: () => void;
}

export function CommandEditor({ className, onClose }: CommandEditorProps) {
  const {
    commands,
    addCommand,
    updateCommand,
    deleteCommand,
    toggleCommand,
    getMostUsedCommands,
  } = useCustomVoiceCommands();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    trigger: '',
    action: '',
    type: 'execute' as CustomCommand['type'],
    path: '',
  });

  const mostUsed = getMostUsedCommands(3);

  const typeIcons = {
    navigate: <Navigation className="w-4 h-4" />,
    speak: <Volume2 className="w-4 h-4" />,
    execute: <Play className="w-4 h-4" />,
    shortcut: <Zap className="w-4 h-4" />,
  };

  const typeColors = {
    navigate: 'bg-info/20 text-info',
    speak: 'bg-success/20 text-success',
    execute: 'bg-warning/20 text-warning',
    shortcut: 'bg-primary/20 text-primary',
  };

  const handleAddCommand = () => {
    if (!formData.trigger.trim() || !formData.action.trim()) return;

    addCommand({
      trigger: formData.trigger,
      action: formData.action,
      type: formData.type,
      parameters: formData.type === 'navigate' ? { path: formData.path } : undefined,
      isEnabled: true,
    });

    setFormData({ trigger: '', action: '', type: 'execute', path: '' });
    setShowAddForm(false);
  };

  const handleSaveEdit = (id: string) => {
    updateCommand(id, {
      trigger: formData.trigger,
      action: formData.action,
      type: formData.type,
      parameters: formData.type === 'navigate' ? { path: formData.path } : undefined,
    });
    setEditingId(null);
  };

  const startEditing = (command: CustomCommand) => {
    setFormData({
      trigger: command.trigger,
      action: command.action,
      type: command.type,
      path: command.parameters?.path || '',
    });
    setEditingId(command.id);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Command className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Voice Commands</h2>
            <p className="text-sm text-foreground-secondary">
              {commands.length} commands configured
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
            Add Command
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Most Used */}
      {mostUsed.length > 0 && mostUsed.some(c => c.usageCount > 0) && (
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Most Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mostUsed.filter(c => c.usageCount > 0).map(command => (
                <Badge key={command.id} variant="secondary" className="gap-1">
                  "{command.trigger}"
                  <span className="text-foreground-tertiary">×{command.usageCount}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                    <Label>Trigger Phrase</Label>
                    <Input
                      placeholder="e.g., launch report"
                      value={formData.trigger}
                      onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="navigate">Navigate</SelectItem>
                        <SelectItem value="speak">Speak</SelectItem>
                        <SelectItem value="execute">Execute</SelectItem>
                        <SelectItem value="shortcut">Shortcut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Action Description</Label>
                  <Input
                    placeholder="What should happen when this command is triggered?"
                    value={formData.action}
                    onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                  />
                </div>

                {formData.type === 'navigate' && (
                  <div className="space-y-2">
                    <Label>Path</Label>
                    <Input
                      placeholder="/analytics"
                      value={formData.path}
                      onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCommand}>
                    Create Command
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commands List */}
      <div className="space-y-2">
        {commands.map((command) => (
          <motion.div
            key={command.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {editingId === command.id ? (
              <Card className="glass-card">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Trigger Phrase</Label>
                      <Input
                        value={formData.trigger}
                        onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Action Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="navigate">Navigate</SelectItem>
                          <SelectItem value="speak">Speak</SelectItem>
                          <SelectItem value="execute">Execute</SelectItem>
                          <SelectItem value="shortcut">Shortcut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Action Description</Label>
                    <Input
                      value={formData.action}
                      onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                    />
                  </div>

                  {formData.type === 'navigate' && (
                    <div className="space-y-2">
                      <Label>Path</Label>
                      <Input
                        value={formData.path}
                        onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveEdit(command.id)}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={cn(
                'glass-card transition-opacity',
                !command.isEnabled && 'opacity-50'
              )}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg', typeColors[command.type])}>
                        {typeIcons[command.type]}
                      </div>
                      <div>
                        <p className="font-medium">"{command.trigger}"</p>
                        <p className="text-sm text-foreground-secondary">{command.action}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {command.usageCount} uses
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleCommand(command.id)}
                      >
                        {command.isEnabled ? (
                          <ToggleRight className="w-4 h-4 text-success" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-foreground-tertiary" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEditing(command)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-error hover:text-error"
                        onClick={() => deleteCommand(command.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
