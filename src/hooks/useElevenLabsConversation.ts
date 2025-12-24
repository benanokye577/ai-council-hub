import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export type ConversationStatus = 'disconnected' | 'connecting' | 'connected';

interface UseElevenLabsConversationOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAgentResponse?: (text: string) => void;
  onError?: (error: Error) => void;
}

export function useElevenLabsConversation(options: UseElevenLabsConversationOptions = {}) {
  const [status, setStatus] = useState<ConversationStatus>('disconnected');
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      setStatus('connected');
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs agent");
      setStatus('disconnected');
    },
    onMessage: (message) => {
      console.log("ElevenLabs message:", message);
      
      // Handle different message types - cast to any for flexibility with SDK types
      const msg = message as unknown as { type?: string; user_transcription_event?: { user_transcript?: string }; agent_response_event?: { agent_response?: string } };
      if (msg.type === 'user_transcript') {
        const text = msg.user_transcription_event?.user_transcript || '';
        setTranscript(text);
        options.onTranscript?.(text, true);
      } else if (msg.type === 'agent_response') {
        const text = msg.agent_response_event?.agent_response || '';
        setAgentResponse(text);
        options.onAgentResponse?.(text);
      }
    },
    onError: (error: unknown) => {
      console.error("ElevenLabs error:", error);
      setStatus('disconnected');
      const err = error instanceof Error ? error : new Error(String(error));
      options.onError?.(err);
      toast.error("Voice connection error. Please try again.");
    },
  });

  const startConversation = useCallback(async () => {
    setStatus('connecting');
    setTranscript('');
    setAgentResponse('');

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function - use fetch directly since supabase client may not be available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/elevenlabs-conversation-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(supabaseKey ? { 'Authorization': `Bearer ${supabaseKey}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get conversation token");
      }

      const data = await response.json();

      if (!data?.token) {
        throw new Error("No token received from server");
      }

      console.log("Starting ElevenLabs conversation with WebRTC");

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setStatus('disconnected');
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error("Microphone access denied. Please allow microphone access.");
        } else {
          toast.error(error.message || "Failed to start voice conversation");
        }
        options.onError?.(error);
      }
    }
  }, [conversation, options]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
    setStatus('disconnected');
  }, [conversation]);

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isSpeaking: conversation.isSpeaking,
    transcript,
    agentResponse,
    startConversation,
    stopConversation,
    // Expose volume methods for visualization
    getInputVolume: conversation.getInputVolume,
    getOutputVolume: conversation.getOutputVolume,
  };
}
