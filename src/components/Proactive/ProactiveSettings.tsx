import { useState } from "react";
import { 
  Bell, 
  Clock, 
  Calendar, 
  Zap, 
  Moon, 
  Sunrise,
  ToggleLeft,
  ToggleRight,
  Settings2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProactiveSettingsProps {
  className?: string;
}

export function ProactiveSettings({ className }: ProactiveSettingsProps) {
  const [settings, setSettings] = useState({
    morningBrief: true,
    eveningReview: false,
    morningTime: "09:00",
    eveningTime: "18:00",
    taskReminders: true,
    deadlineAlerts: true,
    insightNotifications: true,
    quietHoursEnabled: false,
    quietStart: "22:00",
    quietEnd: "08:00",
    reminderFrequency: "smart",
    proactiveLevel: 70,
  });

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Daily Briefs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-primary" />
            Daily Briefs
          </CardTitle>
          <CardDescription>
            Configure your morning and evening briefings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Morning Brief */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/50">
            <div className="flex items-center gap-3">
              <Sunrise className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Morning Brief</p>
                <p className="text-xs text-foreground-tertiary">Start your day with priorities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={settings.morningTime}
                onValueChange={(v) => updateSetting('morningTime', v)}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["07:00", "08:00", "09:00", "10:00"].map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Switch
                checked={settings.morningBrief}
                onCheckedChange={(v) => updateSetting('morningBrief', v)}
              />
            </div>
          </div>

          {/* Evening Review */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/50">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-info" />
              <div>
                <p className="text-sm font-medium">Evening Review</p>
                <p className="text-xs text-foreground-tertiary">Reflect on the day's progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={settings.eveningTime}
                onValueChange={(v) => updateSetting('eveningTime', v)}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["17:00", "18:00", "19:00", "20:00"].map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Switch
                checked={settings.eveningReview}
                onCheckedChange={(v) => updateSetting('eveningReview', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what insights you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="task-reminders" className="flex items-center gap-2 cursor-pointer">
              <Clock className="w-4 h-4 text-foreground-tertiary" />
              Task reminders
            </Label>
            <Switch
              id="task-reminders"
              checked={settings.taskReminders}
              onCheckedChange={(v) => updateSetting('taskReminders', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="deadline-alerts" className="flex items-center gap-2 cursor-pointer">
              <Calendar className="w-4 h-4 text-foreground-tertiary" />
              Deadline alerts
            </Label>
            <Switch
              id="deadline-alerts"
              checked={settings.deadlineAlerts}
              onCheckedChange={(v) => updateSetting('deadlineAlerts', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="insight-notifs" className="flex items-center gap-2 cursor-pointer">
              <Zap className="w-4 h-4 text-foreground-tertiary" />
              Proactive insights
            </Label>
            <Switch
              id="insight-notifs"
              checked={settings.insightNotifications}
              onCheckedChange={(v) => updateSetting('insightNotifications', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Proactive Level */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            Proactive Level
          </CardTitle>
          <CardDescription>
            How often should the council reach out?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">Minimal</span>
              <span className="text-foreground font-medium">{settings.proactiveLevel}%</span>
              <span className="text-foreground-secondary">Proactive</span>
            </div>
            <Slider
              value={[settings.proactiveLevel]}
              onValueChange={(v) => updateSetting('proactiveLevel', v[0])}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          <div className="p-3 rounded-lg bg-background-elevated/50 text-xs text-foreground-secondary">
            {settings.proactiveLevel < 30 && "Council will only notify you about urgent matters."}
            {settings.proactiveLevel >= 30 && settings.proactiveLevel < 70 && "Balanced notifications for important updates and suggestions."}
            {settings.proactiveLevel >= 70 && "Receive frequent insights, suggestions, and optimizations."}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="w-4 h-4 text-primary" />
              Quiet Hours
            </CardTitle>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(v) => updateSetting('quietHoursEnabled', v)}
            />
          </div>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        {settings.quietHoursEnabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs text-foreground-tertiary mb-1 block">From</Label>
                <Select 
                  value={settings.quietStart}
                  onValueChange={(v) => updateSetting('quietStart', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["20:00", "21:00", "22:00", "23:00"].map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-foreground-tertiary mb-1 block">To</Label>
                <Select 
                  value={settings.quietEnd}
                  onValueChange={(v) => updateSetting('quietEnd', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["06:00", "07:00", "08:00", "09:00"].map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Save Button */}
      <Button className="w-full btn-gradient">
        Save Preferences
      </Button>
    </div>
  );
}
