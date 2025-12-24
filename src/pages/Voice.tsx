import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Settings, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceOrb, VoiceState } from "@/components/Voice/VoiceOrb";
import { VoiceWaveform } from "@/components/Voice/VoiceWaveform";
import { VoiceTranscript } from "@/components/Voice/VoiceTranscript";
import { VoiceSettings } from "@/components/Voice/VoiceSettings";

const mockConversations = [
  { id: "1", transcript: "What's on my schedule today?", response: "You have 3 meetings and 5 tasks due today.", timestamp: new Date() },
  { id: "2", transcript: "Create a task to review the API docs", response: "Done! I've created a high-priority task for reviewing API documentation.", timestamp: new Date() },
];

export default function Voice() {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const handleOrbClick = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTranscript("");
      setResponse("");
      
      // Simulate listening
      setTimeout(() => {
        setTranscript("What tasks do I have today?");
        setVoiceState('processing');
        
        // Simulate processing
        setTimeout(() => {
          setResponse("You have 4 tasks scheduled for today. The highest priority is reviewing the API documentation, due at 10 AM.");
          setVoiceState('speaking');
          
          // Simulate speaking
          setTimeout(() => {
            setVoiceState('idle');
          }, 3000);
        }, 1500);
      }, 2000);
    } else {
      setVoiceState('idle');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-mesh">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(187,80%,50%)]/20">
              <Mic className="w-5 h-5 text-[hsl(187,80%,50%)]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Voice Mode</h1>
              <p className="text-sm text-foreground-secondary">
                Talk to the council naturally
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="voice" className="space-y-6">
          <TabsList>
            <TabsTrigger value="voice">Voice Chat</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="voice">
            <Card className="glass-card">
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-8">
                  {/* Voice Orb */}
                  <VoiceOrb
                    state={voiceState}
                    size="lg"
                    onClick={handleOrbClick}
                  />

                  {/* Waveform */}
                  <VoiceWaveform
                    isActive={voiceState === 'listening' || voiceState === 'speaking'}
                    color={voiceState === 'speaking' ? 'success' : 'cyan'}
                    barCount={30}
                    className="w-full max-w-md"
                  />

                  {/* Transcript */}
                  <div className="w-full max-w-md">
                    <VoiceTranscript
                      userTranscript={transcript}
                      aiResponse={response}
                      state={voiceState}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant={voiceState === 'idle' ? 'default' : 'destructive'}
                      size="lg"
                      className="rounded-full px-8"
                      onClick={handleOrbClick}
                    >
                      {voiceState === 'idle' ? 'Start Speaking' : 'Stop'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Recent Voice Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockConversations.map((conv) => (
                  <div key={conv.id} className="p-4 rounded-lg bg-background-elevated/50 border border-border/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <Mic className="w-4 h-4 text-[hsl(187,80%,50%)] mt-0.5" />
                      <p className="text-sm text-foreground">{conv.transcript}</p>
                    </div>
                    <div className="flex items-start gap-2 pl-6">
                      <p className="text-sm text-foreground-secondary">{conv.response}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <VoiceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
