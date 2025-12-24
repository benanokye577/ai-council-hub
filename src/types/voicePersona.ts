export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  agentId: string;
  icon: string;
  color: string;
}

// Default personas - users should configure their own agent IDs in ElevenLabs
// These are placeholder IDs that should be replaced with actual ElevenLabs agent IDs
export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'default',
    name: 'Nova',
    description: 'Friendly and helpful assistant',
    agentId: '', // Uses ELEVENLABS_AGENT_ID from env
    icon: '✨',
    color: 'hsl(260, 80%, 60%)',
  },
  {
    id: 'professional',
    name: 'Atlas',
    description: 'Professional business advisor',
    agentId: '', // Configure in ElevenLabs
    icon: '💼',
    color: 'hsl(220, 70%, 50%)',
  },
  {
    id: 'creative',
    name: 'Aria',
    description: 'Creative and imaginative companion',
    agentId: '', // Configure in ElevenLabs
    icon: '🎨',
    color: 'hsl(330, 80%, 60%)',
  },
  {
    id: 'technical',
    name: 'Cypher',
    description: 'Technical expert and problem solver',
    agentId: '', // Configure in ElevenLabs
    icon: '🔧',
    color: 'hsl(180, 70%, 45%)',
  },
];
