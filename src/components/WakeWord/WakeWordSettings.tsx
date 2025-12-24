import { useState } from 'react';
import { Mic, Volume2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WakeWordSettingsProps {
  className?: string;
}

export function WakeWordSettings({ className }: WakeWordSettingsProps) {
  const [settings, setSettings] = useState({
    enabled: true,
    wakeWord: "Hey Council",
    sensitivity: 0.7,
    confirmationSound: true,
    alwaysListening: false,
    customWords: ["Solaris", "Hey Assistant"]
  });
  
  const [newWord, setNewWord] = useState('');

  const addCustomWord = () => {
    if (newWord.trim() && !settings.customWords.includes(newWord.trim())) {
      setSettings(s => ({
        ...s,
        customWords: [...s.customWords, newWord.trim()]
      }));
      setNewWord('');
    }
  };

  const removeWord = (word: string) => {
    setSettings(s => ({
      ...s,
      customWords: s.customWords.filter(w => w !== word)
    }));
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Wake Word Detection</CardTitle>
              <CardDescription>
                Activate voice mode hands-free
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Wake Word</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Listen for activation phrase
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => setSettings(s => ({ ...s, enabled: v }))}
            />
          </div>

          {/* Primary wake word */}
          <div className="space-y-2">
            <Label>Primary Wake Word</Label>
            <Input
              value={settings.wakeWord}
              onChange={(e) => setSettings(s => ({ ...s, wakeWord: e.target.value }))}
              placeholder="Hey Council"
            />
          </div>

          {/* Sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Detection Sensitivity</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(settings.sensitivity * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.sensitivity]}
              min={0.3}
              max={1}
              step={0.05}
              onValueChange={([v]) => setSettings(s => ({ ...s, sensitivity: v }))}
            />
            <p className="text-xs text-muted-foreground">
              Higher sensitivity may cause false activations
            </p>
          </div>

          {/* Custom wake words */}
          <div className="space-y-3">
            <Label>Alternative Wake Words</Label>
            <div className="flex gap-2">
              <Input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Add custom word..."
                onKeyDown={(e) => e.key === 'Enter' && addCustomWord()}
              />
              <Button variant="outline" onClick={addCustomWord}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.customWords.map((word) => (
                <Badge 
                  key={word} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
                  onClick={() => removeWord(word)}
                >
                  {word} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Additional options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label>Confirmation Sound</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sound when wake word detected
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.confirmationSound}
                onCheckedChange={(v) => setSettings(s => ({ ...s, confirmationSound: v }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <div>
                  <Label>Always Listening</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep microphone active (uses more battery)
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.alwaysListening}
                onCheckedChange={(v) => setSettings(s => ({ ...s, alwaysListening: v }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}