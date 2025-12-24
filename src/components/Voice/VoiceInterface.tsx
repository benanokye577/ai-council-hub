// Voice Interface with ElevenLabs integration
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Settings, X, Volume2, VolumeX, Loader2, History, Keyboard, User, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { NebulaOrb, OrbState } from './NebulaOrb';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useVoiceSoundEffects } from '@/hooks/useVoiceSoundEffects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ConversationHistory, ConversationMessage } from './ConversationHistory';
import { VoicePersonaSelector } from './VoicePersonaSelector';
import { VoicePersona, VOICE_PERSONAS } from '@/types/voicePersona';
import { SessionStats } from './SessionStats';
import { QuickActions } from './QuickActions';
import { ConversationExport } from './ConversationExport';
import { VoiceWaveform } from './VoiceWaveform';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { SessionList } from './SessionList';

interface VoiceInterfaceProps {
  onClose?: () => void;
  className?: string;
}

export function VoiceInterface({ onClose, className }: VoiceInterfaceProps) {
  const [isOrbReady, setIsOrbReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);

  // Conversation memory hook for persistence
  const {
    sessions,
    currentSession,
    currentSessionId,
    currentMessages,
    createSession,
    addMessage: addMessageToSession,
    loadSession,
    deleteSession,
  } = useConversationMemory();
  
  // Accessibility
  const systemReducedMotion = useReducedMotion();
  
  // Settings state
  const [settings, setSettings] = useState({
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoListen: true,
    hapticFeedback: true,
    noiseReduction: true,
    wakeWord: false,
    continuousMode: false,
    soundEffects: true,
    reducedMotion: false,
  });

  const prefersReducedMotion = systemReducedMotion || settings.reducedMotion;
  
  // Sound effects hook
  const { playSound, triggerHaptic } = useVoiceSoundEffects(settings.soundEffects);

  // Track previous state for sound effects
  const prevStateRef = useRef<OrbState>('idle');

  // ElevenLabs conversation hook
  const {
    status,
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    agentResponse,
    startConversation,
    stopConversation,
    getInputVolume,
    getOutputVolume,
  } = useElevenLabsConversation({
    agentId: selectedPersona.agentId || undefined,
    onTranscript: (text) => {
      console.log("User transcript:", text);
      if (text) {
        addMessage('user', text);
      }
    },
    onAgentResponse: (text) => {
      console.log("Agent response:", text);
      if (text) {
        addMessage('assistant', text);
      }
    },
  });

  // Add message to history (uses persistent memory)
  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const message: ConversationMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
    };
    addMessageToSession(message);
  }, [addMessageToSession]);

  // Derive orb state from ElevenLabs conversation status
  const orbState: OrbState = (() => {
    if (isConnecting) return 'processing';
    if (!isConnected) return 'idle';
    if (isSpeaking) return 'speaking';
    return 'listening';
  })();

  // Play sounds and haptics on state change
  useEffect(() => {
    if (orbState !== prevStateRef.current) {
      switch (orbState) {
        case 'listening':
          if (prevStateRef.current === 'idle') {
            playSound('start');
            if (settings.hapticFeedback) triggerHaptic('medium');
          } else {
            playSound('listening');
          }
          break;
        case 'speaking':
          playSound('speaking');
          if (settings.hapticFeedback) triggerHaptic('light');
          break;
        case 'idle':
          if (prevStateRef.current !== 'idle') {
            playSound('stop');
            if (settings.hapticFeedback) triggerHaptic('light');
          }
          break;
      }
      prevStateRef.current = orbState;
    }
  }, [orbState, playSound, triggerHaptic, settings.hapticFeedback]);

  // Visibility API - pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Audio level animation for visualization
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (isConnected && isTabVisible) {
      const updateAudioLevel = () => {
        try {
          const inputLevel = getInputVolume?.() || 0;
          const outputLevel = getOutputVolume?.() || 0;
          setAudioLevel(Math.max(inputLevel, outputLevel));
        } catch {
          if (isSpeaking) {
            setAudioLevel(Math.random() * 0.6 + 0.2);
          } else {
            setAudioLevel(0.1);
          }
        }
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
    } else {
      setAudioLevel(0);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isConnected, isSpeaking, getInputVolume, getOutputVolume, isTabVisible]);

  const handleToggleConversation = useCallback(async () => {
    if (isConnected || isConnecting) {
      await stopConversation();
    } else {
      // Create a new session if none exists
      if (!currentSessionId) {
        createSession(selectedPersona.id, selectedPersona.name);
      }
      await startConversation();
    }
  }, [isConnected, isConnecting, startConversation, stopConversation, currentSessionId, createSession, selectedPersona]);

  // Keyboard shortcut - Spacebar to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or if settings is open
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (showSettings || showHistory || showPersonas || showSessions) return;
      
      if (e.code === 'Space' && isOrbReady) {
        e.preventDefault();
        handleToggleConversation();
      }
      
      // Escape to close
      if (e.code === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleConversation, isOrbReady, showSettings, showHistory, showPersonas, showSessions, onClose]);

  const getStatusText = () => {
    switch (orbState) {
      case 'idle': return 'Tap to speak';
      case 'listening': return 'Listening...';
      case 'processing': return 'Connecting...';
      case 'speaking': return 'Speaking...';
    }
  };

  // Animation variants based on reduced motion preference
  const motionProps = prefersReducedMotion ? {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 }
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col overflow-hidden",
      "bg-gradient-to-b from-[hsl(260,30%,8%)] via-[hsl(260,25%,6%)] to-[hsl(260,20%,4%)]",
      className
    )}>
      {/* Ambient glow effects - hidden in reduced motion mode */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(187,80%,50%)]/5 blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(330,81%,60%)]/5 blur-[80px]" />
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full bg-success",
            !prefersReducedMotion && "animate-pulse"
          )} />
          <span className="text-sm font-medium text-foreground/80">Voice Active</span>
          {/* Keyboard hint */}
          <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-secondary/30 border border-border/30">
            <Keyboard className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Space</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setShowSessions(!showSessions)}
            title="Past Sessions"
          >
            <FolderOpen className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPersonas(!showPersonas)}
            title="Change Persona"
          >
            <User className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4" />
          </Button>
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
          initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <NebulaOrb 
            state={orbState} 
            audioLevel={audioLevel}
            onReady={() => setIsOrbReady(true)}
            paused={!isTabVisible}
            reducedMotion={prefersReducedMotion}
          />
          
          {/* Loading overlay */}
          <AnimatePresence>
            {!isOrbReady && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-full"
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                <Loader2 className={cn("w-8 h-8 text-primary", !prefersReducedMotion && "animate-spin")} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click overlay */}
          <button
            onClick={handleToggleConversation}
            disabled={!isOrbReady}
            className="absolute inset-0 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-background"
            aria-label={orbState === 'idle' ? 'Start speaking' : 'Stop'}
          />
        </motion.div>

        {/* Session Stats - shown when active */}
        {isConnected && (
          <SessionStats 
            isActive={isConnected} 
            messages={currentMessages}
            className="mt-4"
          />
        )}

        {/* Waveform visualization */}
        {isConnected && (
          <div className="mt-4 w-full max-w-sm">
            <VoiceWaveform isActive={isSpeaking || audioLevel > 0.1} barCount={24} color="cyan" />
          </div>
        )}

        {/* Status */}
        <motion.div 
          className="mt-6 text-center"
          {...motionProps}
        >
          <p className="text-lg font-medium text-foreground/90 mb-1">
            {getStatusText()}
          </p>
          {orbState === 'processing' && !prefersReducedMotion && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </motion.div>

        {/* Quick Actions - shown when idle */}
        {orbState === 'idle' && isOrbReady && (
          <QuickActions
            onAction={(prompt) => console.log('Quick action:', prompt)}
            disabled={!isOrbReady}
            reducedMotion={prefersReducedMotion}
            className="mt-6"
          />
        )}

        {/* Current Transcript/Response */}
        <AnimatePresence mode="wait">
          {(transcript || agentResponse) && (
            <motion.div 
              className="mt-6 w-full max-w-md space-y-3"
              {...motionProps}
            >
              {transcript && (
                <div className="p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">You said</p>
                  <p className="text-sm text-foreground">{transcript}</p>
                </div>
              )}
              {agentResponse && (
                <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                  <p className="text-xs text-primary/70 mb-1">Response</p>
                  <p className="text-sm text-foreground">{agentResponse}</p>
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
              "h-16 w-16 rounded-full",
              !prefersReducedMotion && "transition-all duration-300",
              orbState === 'idle' 
                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" 
                : "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/30"
            )}
            onClick={handleToggleConversation}
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

      {/* Conversation History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="absolute inset-0 z-20 bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <h2 className="text-xl font-semibold">Conversation History</h2>
                <div className="flex items-center gap-2">
                  <ConversationExport messages={currentMessages} />
                  <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <ConversationHistory 
                messages={currentMessages} 
                className="flex-1"
                reducedMotion={prefersReducedMotion}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions Panel */}
      <AnimatePresence>
        {showSessions && (
          <motion.div
            className="absolute inset-0 z-20 bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div>
                  <h2 className="text-xl font-semibold">Past Sessions</h2>
                  <p className="text-sm text-muted-foreground">Resume previous conversations</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSessions(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <SessionList
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={(id) => {
                  loadSession(id);
                  setShowSessions(false);
                }}
                onDeleteSession={deleteSession}
                onNewSession={() => {
                  createSession(selectedPersona.id, selectedPersona.name);
                  setShowSessions(false);
                }}
                reducedMotion={prefersReducedMotion}
                className="flex-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persona Selector Panel */}
      <AnimatePresence>
        {showPersonas && (
          <motion.div
            className="absolute inset-0 z-20 bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div>
                  <h2 className="text-xl font-semibold">Voice Persona</h2>
                  <p className="text-sm text-muted-foreground">Choose your AI assistant personality</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPersonas(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <VoicePersonaSelector
                  selectedPersona={selectedPersona}
                  onSelect={(persona) => {
                    setSelectedPersona(persona);
                    setShowPersonas(false);
                  }}
                  reducedMotion={prefersReducedMotion}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute inset-0 z-20 bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
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
                      <Label>Sound Effects</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Play tones when state changes
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundEffects}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, soundEffects: v }))}
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
                      <Label>Reduced Motion</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Minimize animations for accessibility
                      </p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(v) => setSettings(s => ({ ...s, reducedMotion: v }))}
                    />
                  </div>

                  <div className="h-px bg-border my-4" />

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

                {/* Keyboard shortcuts info */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <Label className="mb-3 block">Keyboard Shortcuts</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toggle voice</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-border text-xs">Space</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Close interface</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-border text-xs">Esc</kbd>
                    </div>
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
