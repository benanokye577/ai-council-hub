# Voice Interface Documentation

This document describes the voice interface implementation for integration with AI coding assistants like Windsurf, Cursor, or other tools.

## Overview

The voice interface provides real-time voice conversations using ElevenLabs Conversational AI. It features a 3D animated orb visualization, persona selection, conversation history, and accessibility support.

## Architecture

```
src/
├── pages/
│   └── Voice.tsx                    # Voice page route
├── components/Voice/
│   ├── VoiceInterface.tsx           # Main voice UI component
│   ├── NebulaOrb.tsx                # 3D WebGL orb visualization (Three.js)
│   ├── VoicePersonaSelector.tsx     # Persona selection UI
│   └── ConversationHistory.tsx      # Message history panel
├── hooks/
│   ├── useElevenLabsConversation.ts # ElevenLabs SDK integration
│   ├── useVoiceSoundEffects.ts      # Sound effects & haptics
│   └── useReducedMotion.ts          # Accessibility motion detection
├── types/
│   └── voicePersona.ts              # Persona type definitions
└── supabase/functions/
    └── elevenlabs-conversation-token/
        └── index.ts                 # Token generation edge function
```

## Key Components

### VoiceInterface.tsx
The main voice interface component that orchestrates:
- ElevenLabs conversation management
- Orb state visualization (idle, listening, speaking, processing)
- Settings panel with voice controls
- Persona selection
- Conversation history
- Keyboard shortcuts (Space to toggle, Escape to close)
- Sound effects and haptic feedback
- Tab visibility optimization (pauses rendering when hidden)

### NebulaOrb.tsx
A 3D WebGL visualization using Three.js featuring:
- Particle-based nebula effect with 15,000 particles
- State-driven animations and colors
- Audio-reactive intensity
- LOD (Level of Detail) for performance
- Smooth particle count transitions
- Reduced motion support
- Pause capability when tab is hidden

### useElevenLabsConversation.ts
Custom hook wrapping the ElevenLabs React SDK:
- Manages WebRTC connection to ElevenLabs
- Handles conversation token retrieval from edge function
- Provides transcript and agent response callbacks
- Exposes volume levels for visualization

## ElevenLabs Integration

### Required Environment Variables
Set these in Supabase secrets:
- `ELEVENLABS_API_KEY` - Your ElevenLabs API key
- `ELEVENLABS_AGENT_ID` - Default agent ID (for Nova persona)

### Voice Personas
Personas are defined in `src/types/voicePersona.ts`:
- **Nova** (default) - Friendly and helpful assistant
- **Atlas** - Professional business advisor  
- **Aria** - Creative and imaginative companion
- **Cypher** - Technical expert and problem solver

To add custom personas:
1. Create agents in ElevenLabs dashboard
2. Update `VOICE_PERSONAS` array with agent IDs
3. The edge function accepts `agentId` parameter to override default

### Edge Function
`supabase/functions/elevenlabs-conversation-token/index.ts`

Generates conversation tokens for WebRTC connections:
- Accepts optional `agentId` in request body
- Falls back to `ELEVENLABS_AGENT_ID` env var
- Returns `{ token: string }` for client use

## Features

### Keyboard Shortcuts
- `Space` - Start/stop conversation
- `Escape` - Close voice interface

### Settings
- Voice speed (0.5x - 2x)
- Voice pitch (0.5x - 2x)
- Auto-listen toggle
- Haptic feedback toggle
- Noise reduction toggle
- Wake word detection
- Continuous conversation mode
- Sound effects toggle
- Reduced motion mode

### Accessibility
- System reduced motion preference detection
- Manual reduced motion toggle
- Screen reader labels
- Focus management
- Keyboard navigation

### Performance Optimizations
- Tab visibility API pauses orb rendering
- LOD adjusts particle count based on screen size
- Smooth interpolation for particle transitions
- Animation frame cleanup on unmount

## Sound Effects

Defined in `useVoiceSoundEffects.ts`:
- `start` - Conversation start (ascending notes)
- `stop` - Conversation end (descending notes)
- `listening` - Active listening (soft ping)
- `speaking` - Agent speaking (gentle chime)

Haptic feedback patterns:
- `light` - 10ms vibration
- `medium` - 25ms vibration
- `heavy` - 50ms vibration

## Styling

Uses Tailwind CSS with semantic tokens:
- Background: Dark purple gradient (`hsl(260, 30%, 8%)` to `hsl(260, 20%, 4%)`)
- Primary: Purple (`hsl(262, 83%, 58%)`)
- Accent colors for personas defined per-persona

## Usage Example

```tsx
import { VoiceInterface } from '@/components/Voice/VoiceInterface';

function MyComponent() {
  return (
    <VoiceInterface 
      onClose={() => navigate(-1)} 
    />
  );
}
```

## Extending

### Adding New Personas
1. Create new agent in ElevenLabs with desired personality
2. Add to `VOICE_PERSONAS` in `src/types/voicePersona.ts`:
```ts
{
  id: 'custom',
  name: 'Custom Name',
  description: 'Description here',
  agentId: 'your-elevenlabs-agent-id',
  icon: '🎯',
  color: 'hsl(120, 70%, 50%)',
}
```

### Customizing Orb Appearance
Edit `NebulaOrb.tsx`:
- `STATE_COLORS` - Colors for each state
- `BASE_PARTICLES` - Particle count
- Shader code for custom visual effects

### Adding New Sound Effects
Update `useVoiceSoundEffects.ts`:
1. Add new oscillator configuration in `sounds` object
2. Call `playSound('yourSound')` from VoiceInterface

## Dependencies

- `@elevenlabs/react` - ElevenLabs conversation SDK
- `three` - WebGL 3D rendering
- `framer-motion` - Animations
- `lucide-react` - Icons

## Troubleshooting

### No audio/connection
1. Check browser microphone permissions
2. Verify `ELEVENLABS_API_KEY` is set in Supabase secrets
3. Verify `ELEVENLABS_AGENT_ID` is set and valid
4. Check console for edge function errors

### Orb not rendering
1. Check for WebGL support in browser
2. Verify Three.js loaded correctly
3. Check console for shader compilation errors

### Performance issues
1. Enable reduced motion mode
2. Check if tab visibility optimization is working
3. Consider reducing `BASE_PARTICLES` in NebulaOrb
