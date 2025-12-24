import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Settings, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { NebulaOrb, OrbState } from './NebulaOrb';

interface VoiceInterfaceProps {
  onClose?: () => void;
  className?: string;
}

export function VoiceInterface({ onClose, className }: VoiceInterfaceProps) {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isOrbReady, setIsOrbReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoListen: true,
    hapticFeedback: true,
    noiseReduction: true,
    wakeWord: false,
    continuousMode: false
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);

  // Audio analysis for visualization
  const startAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: settings.noiseReduction,
          noiseSuppression: settings.noiseReduction,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const analyze = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 255);
        
        animationRef.current = requestAnimationFrame(analyze);
      };
      
      analyze();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  }, [settings.noiseReduction]);

  const stopAudioAnalysis = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    analyserRef.current = null;
    audioContextRef.current = null;
    streamRef.current = null;
    setAudioLevel(0);
  }, []);

  const handleStartListening = async () => {
    if (orbState !== 'idle') {
      handleStop();
      return;
    }

    setOrbState('listening');
    setTranscript('');
    setResponse('');
    await startAudioAnalysis();
    
    // Simulate speech recognition
    setTimeout(() => {
      setTranscript('What tasks do I have scheduled for today?');
      setOrbState('processing');
      stopAudioAnalysis();
      
      setTimeout(() => {
        setResponse("You have 4 tasks scheduled for today. The highest priority is reviewing the API documentation, due at 10 AM. Would you like me to read through them?");
        setOrbState('speaking');
        
        // Simulate speaking animation
        const speakInterval = setInterval(() => {
          setAudioLevel(Math.random() * 0.6 + 0.2);
        }, 100);
        
        setTimeout(() => {
          clearInterval(speakInterval);
          setAudioLevel(0);
          if (settings.continuousMode) {
            setOrbState('listening');
            startAudioAnalysis();
          } else {
            setOrbState('idle');
          }
        }, 4000);
      }, 2000);
    }, 3000);
  };

  const handleStop = () => {
    setOrbState('idle');
    stopAudioAnalysis();
  };

  useEffect(() => {
    return () => {
      stopAudioAnalysis();
    };
  }, [stopAudioAnalysis]);

  const getStatusText = () => {
    switch (orbState) {
      case 'idle': return 'Tap to speak';
      case 'listening': return 'Listening...';
      case 'processing': return 'Processing...';
      case 'speaking': return 'Speaking...';
    }
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col overflow-hidden",
      "bg-gradient-to-b from-[hsl(260,30%,8%)] via-[hsl(260,25%,6%)] to-[hsl(260,20%,4%)]",
      className
    )}>
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(187,80%,50%)]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(330,81%,60%)]/5 blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-foreground/80">Voice Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-6">
        {/* Orb container */}
        <motion.div 
          className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <NebulaOrb 
            state={orbState} 
            audioLevel={audioLevel}
            onReady={() => setIsOrbReady(true)}
          />
          
          {/* Loading overlay */}
          <AnimatePresence>
            {!isOrbReady && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-full"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click overlay */}
          <button
            onClick={handleStartListening}
            disabled={!isOrbReady}
            className="absolute inset-0 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-background"
            aria-label={orbState === 'idle' ? 'Start speaking' : 'Stop'}
          />
        </motion.div>

        {/* Status */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-lg font-medium text-foreground/90 mb-1">
            {getStatusText()}
          </p>
          {orbState === 'processing' && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </motion.div>

        {/* Transcript/Response */}
        <AnimatePresence mode="wait">
          {(transcript || response) && (
            <motion.div 
              className="mt-6 w-full max-w-md space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {transcript && (
                <div className="p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">You said</p>
                  <p className="text-sm text-foreground">{transcript}</p>
                </div>
              )}
              {response && (
                <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                  <p className="text-xs text-primary/70 mb-1">Response</p>
                  <p className="text-sm text-foreground">{response}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <footer className="relative z-10 p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full",
              isMuted ? "bg-destructive/20 text-destructive" : "bg-secondary/50 text-muted-foreground"
            )}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          
          <Button
            size="lg"
            className={cn(
              "h-16 w-16 rounded-full transition-all duration-300",
              orbState === 'idle' 
                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" 
                : "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/30"
            )}
            onClick={handleStartListening}
            disabled={!isOrbReady}
          >
            {orbState === 'idle' ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>
          
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>
      </footer>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute inset-0 z-20 bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Voice Settings</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Voice Speed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Voice Speed</Label>
                    <span className="text-sm text-muted-foreground">{settings.voiceSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[settings.voiceSpeed]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={([v]) => setSettings(s => ({ ...s, voiceSpeed: v }))}
                  />
                </div>

                {/* Voice Pitch */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Voice Pitch</Label>
                    <span className="text-sm text-muted-foreground">{settings.voicePitch.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[settings.voicePitch]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={([v]) => setSettings(s => ({ ...s, voicePitch: v }))}
                  />
                </div>

                <div className="h-px bg-border my-6" />

                {/* Toggle settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Listen After Response</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Automatically start listening after AI responds
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoListen}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, autoListen: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Continuous Mode</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Keep the conversation going without tapping
                      </p>
                    </div>
                    <Switch
                      checked={settings.continuousMode}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, continuousMode: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Noise Reduction</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Filter background noise for clearer input
                      </p>
                    </div>
                    <Switch
                      checked={settings.noiseReduction}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, noiseReduction: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Haptic Feedback</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Vibration feedback on mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={settings.hapticFeedback}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, hapticFeedback: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Wake Word Detection</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Say "Hey Council" to activate (coming soon)
                      </p>
                    </div>
                    <Switch
                      checked={settings.wakeWord}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, wakeWord: v }))}
                      disabled
                    />
                  </div>
                </div>

                <div className="h-px bg-border my-6" />

                {/* Audio visualization preview */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <Label className="mb-3 block">Audio Level Preview</Label>
                  <div className="flex items-end justify-center gap-1 h-12">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-primary rounded-full transition-all duration-100"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          opacity: 0.3 + Math.random() * 0.7
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}