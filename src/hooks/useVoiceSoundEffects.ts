import { useCallback, useRef } from 'react';

type SoundType = 'start' | 'stop' | 'listening' | 'speaking' | 'error';

// Simple tone generator using Web Audio API
export function useVoiceSoundEffects(enabled: boolean = true) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Could not play sound effect:', e);
    }
  }, [enabled, getAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (!enabled) return;

    switch (type) {
      case 'start':
        // Rising tone
        playTone(440, 0.15, 'sine', 0.08);
        setTimeout(() => playTone(660, 0.15, 'sine', 0.08), 100);
        break;
      case 'stop':
        // Falling tone
        playTone(660, 0.15, 'sine', 0.08);
        setTimeout(() => playTone(440, 0.15, 'sine', 0.08), 100);
        break;
      case 'listening':
        // Soft blip
        playTone(880, 0.1, 'sine', 0.05);
        break;
      case 'speaking':
        // Double blip
        playTone(523, 0.08, 'sine', 0.06);
        setTimeout(() => playTone(659, 0.08, 'sine', 0.06), 80);
        break;
      case 'error':
        // Low buzz
        playTone(200, 0.3, 'sawtooth', 0.05);
        break;
    }
  }, [enabled, playTone]);

  const triggerHaptic = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enabled || !navigator.vibrate) return;
    
    switch (pattern) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate([50, 30, 50]);
        break;
    }
  }, [enabled]);

  return { playSound, triggerHaptic };
}
