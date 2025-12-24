# Voice Interface Documentation

This document describes the voice interface implementation for integration with AI coding assistants like Windsurf, Cursor, or other tools.

## Overview

The voice interface provides real-time voice conversations using ElevenLabs Conversational AI. It features a 3D animated orb visualization, persona selection, **persistent conversation memory**, conversation history with export, session statistics, quick actions, and comprehensive accessibility support.

## Architecture

```
src/
├── pages/
│   └── Voice.tsx                    # Voice page route
├── components/Voice/
│   ├── VoiceInterface.tsx           # Main voice UI component
│   ├── NebulaOrb.tsx                # 3D WebGL orb visualization (Three.js)
│   ├── VoicePersonaSelector.tsx     # Persona selection UI
│   ├── ConversationHistory.tsx      # Message history panel
│   ├── ConversationExport.tsx       # Export conversations (text/md/json)
│   ├── SessionStats.tsx             # Live session statistics
│   ├── SessionList.tsx              # Past sessions browser
│   ├── QuickActions.tsx             # Quick action suggestion buttons
│   └── VoiceWaveform.tsx            # Audio waveform visualization
├── hooks/
│   ├── useElevenLabsConversation.ts # ElevenLabs SDK integration
│   ├── useConversationMemory.ts     # Persistent session storage
│   ├── useVoiceSoundEffects.ts      # Sound effects & haptics
│   ├── useReducedMotion.ts          # Accessibility motion detection
│   └── useVoiceCommands.ts          # Voice command processing
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
- **Persistent conversation memory** with session management
- Conversation history with export
- Session statistics (duration, message count, word count)
- Quick action suggestions
- Waveform visualization
- Keyboard shortcuts (Space to toggle, Escape to close)
- Sound effects and haptic feedback
- Tab visibility optimization (pauses rendering when hidden)

### useConversationMemory.ts
Custom hook for persistent conversation storage:
- Saves up to 10 sessions in localStorage
- Auto-generates session titles from first user message
- Tracks persona used per session
- Timestamps for creation and last update
- Session CRUD operations (create, read, update, delete)

### SessionList.tsx
Past sessions browser component:
- Lists all saved sessions with metadata
- Shows persona, message count, and timestamp
- One-click to resume any session
- Delete individual sessions
- Create new session button

### NebulaOrb.tsx
A 3D WebGL visualization using Three.js featuring:
- Particle-based nebula effect with 15,000 particles
- State-driven animations and colors
- Audio-reactive intensity
- LOD (Level of Detail) for performance
- Smooth particle count transitions
- Reduced motion support
- Pause capability when tab is hidden

### SessionStats.tsx
Live session statistics component showing:
- Conversation duration (live timer)
- User message count
- Assistant message count
- Total word count

### QuickActions.tsx
Quick action suggestion buttons:
- Summarize - Request conversation summary
- Help - Ask what the assistant can help with
- Tasks - Get task suggestions
- Ideas - Request creative ideas
- Continue - Continue from last point

### ConversationExport.tsx
Export functionality for conversation history:
- Copy to clipboard
- Export as plain text (.txt)
- Export as Markdown (.md)
- Export as JSON (.json)

### VoiceWaveform.tsx
Audio waveform visualization:
- Real-time bar visualization
- Color customization (primary, cyan, success)
- Configurable bar count
- Smooth animations

### useElevenLabsConversation.ts
Custom hook wrapping the ElevenLabs React SDK:
- Manages WebRTC connection to ElevenLabs
- Handles conversation token retrieval from edge function
- Supports custom agent IDs for personas
- Provides transcript and agent response callbacks
- Exposes volume levels for visualization

### useVoiceCommands.ts
Voice command processing hook:
- Keyword detection in transcripts
- Built-in commands: stop, mute, unmute, repeat, slower, faster
- Extensible command system

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

### Persistent Conversation Memory
Conversations are automatically saved to localStorage:
- Up to 10 sessions stored
- Sessions include all messages with timestamps
- Tracks which persona was used
- Auto-generated titles from first user message
- Resume any past session instantly
- Delete sessions individually

### Cloud Sync (Planned)
Cross-device conversation sync using Supabase:
- Real-time sync across devices and browsers
- Secure storage with Row Level Security (RLS)
- Automatic conflict resolution
- Offline-first with background sync
- Database schema:
  - `conversation_sessions` table with user_id, persona, timestamps
  - `conversation_messages` table with session_id, role, content, timestamps
- Implementation requires enabling Lovable Cloud

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

### Session Statistics
Displayed during active conversations:
- Live duration timer
- Message counts (user/assistant)
- Total word count

### Quick Actions
Contextual action buttons shown when idle:
- Summarize conversation
- Get help
- List tasks
- Generate ideas
- Continue conversation

### Conversation Export
Export conversation history in multiple formats:
- Plain text with timestamps
- Markdown with formatting
- JSON with full metadata

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

## Voice Commands

Built-in voice commands in `useVoiceCommands.ts`:
- "stop" / "end" / "bye" - End conversation
- "mute" / "quiet" - Mute audio
- "unmute" / "speak" - Unmute audio
- "repeat" / "say again" - Repeat last response
- "slower" / "slow down" - Decrease speed
- "faster" / "speed up" - Increase speed

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

### Adding New Quick Actions
Edit `src/components/Voice/QuickActions.tsx`:
```ts
{
  id: 'myaction',
  label: 'My Action',
  icon: <MyIcon className="w-4 h-4" />,
  prompt: 'The prompt to send',
}
```

### Adding Voice Commands
Edit `src/hooks/useVoiceCommands.ts`:
```ts
{
  keywords: ['my keyword', 'alternate keyword'],
  action: () => {
    // Your action here
  },
  description: 'Command description',
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

## File Reference

| File | Purpose |
|------|---------|
| `VoiceInterface.tsx` | Main UI orchestration |
| `NebulaOrb.tsx` | 3D particle visualization |
| `VoicePersonaSelector.tsx` | Persona selection grid |
| `ConversationHistory.tsx` | Message list display |
| `ConversationExport.tsx` | Export functionality |
| `SessionList.tsx` | Past sessions browser |
| `SessionStats.tsx` | Live statistics |
| `useConversationMemory.ts` | Persistent storage hook |
| `QuickActions.tsx` | Action suggestions |
| `VoiceWaveform.tsx` | Audio visualization |
| `useElevenLabsConversation.ts` | ElevenLabs SDK wrapper |
| `useVoiceSoundEffects.ts` | Audio feedback |
| `useReducedMotion.ts` | Accessibility detection |
| `useVoiceCommands.ts` | Command processing |
| `voicePersona.ts` | Type definitions |

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

### Export not working
1. Check browser permissions for downloads
2. Verify conversation history has messages
3. Check console for blob creation errors
