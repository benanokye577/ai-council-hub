import { useState } from "react";
import { 
  Volume2, 
  Mic, 
  SlidersHorizontal, 
  PlayCircle,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceSettingsProps {
  className?: string;
}

export function VoiceSettings({ className }: VoiceSettingsProps) {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    autoListen: false,
    vadSensitivity: 50,
    speakingRate: 1.0,
    volume: 80,
    selectedVoice: "nova",
    hapticFeedback: true,
    transcriptEnabled: true,
  });

  const voices = [
    { id: "nova", name: "Nova", description: "Warm and conversational" },
    { id: "aria", name: "Aria", description: "Clear and professional" },
    { id: "onyx", name: "Onyx", description: "Deep and authoritative" },
    { id: "echo", name: "Echo", description: "Friendly and energetic" },
  ];

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Voice Output */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            Voice Output
          </CardTitle>
          <CardDescription>
            Configure the council's voice responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Selection */}
          <div>
            <Label className="text-xs text-foreground-tertiary mb-2 block">Voice</Label>
            <Select 
              value={settings.selectedVoice}
              onValueChange={(v) => updateSetting('selectedVoice', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{voice.name}</span>
                      <span className="text-xs text-foreground-tertiary ml-2">
                        {voice.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speaking Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-foreground-tertiary">Speaking Rate</Label>
              <span className="text-xs font-medium text-foreground">{settings.speakingRate}x</span>
            </div>
            <Slider
              value={[settings.speakingRate * 100]}
              onValueChange={(v) => updateSetting('speakingRate', v[0] / 100)}
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-foreground-tertiary mt-1">
              <span>0.5x</span>
              <span>2x</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-foreground-tertiary">Volume</Label>
              <span className="text-xs font-medium text-foreground">{settings.volume}%</span>
            </div>
            <Slider
              value={[settings.volume]}
              onValueChange={(v) => updateSetting('volume', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Test Voice */}
          <Button variant="outline" size="sm" className="w-full">
            <PlayCircle className="w-4 h-4 mr-2" />
            Test Voice
          </Button>
        </CardContent>
      </Card>

      {/* Voice Input */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            Voice Input
          </CardTitle>
          <CardDescription>
            Configure microphone and speech detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* VAD Sensitivity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-foreground-tertiary flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                VAD Sensitivity
              </Label>
              <span className="text-xs font-medium text-foreground">{settings.vadSensitivity}%</span>
            </div>
            <Slider
              value={[settings.vadSensitivity]}
              onValueChange={(v) => updateSetting('vadSensitivity', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-foreground-tertiary mt-1">
              Higher = detects speech more easily, may pick up background noise
            </p>
          </div>

          {/* Auto Listen */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-listen" className="cursor-pointer">Auto-listen after response</Label>
              <p className="text-xs text-foreground-tertiary">
                Automatically start listening when AI finishes speaking
              </p>
            </div>
            <Switch
              id="auto-listen"
              checked={settings.autoListen}
              onCheckedChange={(v) => updateSetting('autoListen', v)}
            />
          </div>

          {/* Show Transcript */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="transcript" className="cursor-pointer">Show live transcript</Label>
              <p className="text-xs text-foreground-tertiary">
                Display text as you speak
              </p>
            </div>
            <Switch
              id="transcript"
              checked={settings.transcriptEnabled}
              onCheckedChange={(v) => updateSetting('transcriptEnabled', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Other
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="haptic" className="cursor-pointer">Haptic feedback</Label>
              <p className="text-xs text-foreground-tertiary">
                Vibrate on voice state changes
              </p>
            </div>
            <Switch
              id="haptic"
              checked={settings.hapticFeedback}
              onCheckedChange={(v) => updateSetting('hapticFeedback', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-enabled" className="cursor-pointer">Voice mode enabled</Label>
              <p className="text-xs text-foreground-tertiary">
                Allow voice interactions globally
              </p>
            </div>
            <Switch
              id="voice-enabled"
              checked={settings.voiceEnabled}
              onCheckedChange={(v) => updateSetting('voiceEnabled', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <Button className="w-full btn-gradient">
        Save Voice Settings
      </Button>
    </div>
  );
}
