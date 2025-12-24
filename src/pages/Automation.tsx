import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Play, Pause, Square, Settings, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGate, defaultPermissions } from "@/components/ComputerUse/PermissionGate";
import { ScreenPreview } from "@/components/ComputerUse/ScreenPreview";
import { AutomationTimeline, AutomationStep } from "@/components/ComputerUse/AutomationTimeline";
import { ActionConfirmModal } from "@/components/ComputerUse/ActionConfirmModal";

const mockSteps: AutomationStep[] = [
  { id: "1", type: "navigate", description: "Open Chrome browser", status: "completed", timestamp: new Date() },
  { id: "2", type: "navigate", description: "Navigate to figma.com", status: "completed", timestamp: new Date() },
  { id: "3", type: "click", description: "Click 'Export' button", status: "running" },
  { id: "4", type: "click", description: "Select PNG format", status: "pending" },
  { id: "5", type: "click", description: "Save file to Downloads", status: "pending" },
];

export default function Automation() {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState(mockSteps);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGrantPermission = (id: string) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, granted: true } : p
    ));
  };

  const handleDenyPermission = (id: string) => {
    console.log("Denied:", id);
  };

  const handleProceed = () => {
    setHasPermissions(true);
  };

  const handleStart = () => {
    if (instructions.trim()) {
      setIsRunning(true);
      setSteps(mockSteps);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-mesh">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Monitor className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Desktop Automation</h1>
              <p className="text-sm text-foreground-secondary">
                Let the council control your desktop
              </p>
            </div>
          </div>
        </div>

        {!hasPermissions ? (
          <div className="max-w-lg mx-auto">
            <PermissionGate
              permissions={permissions}
              onGrant={handleGrantPermission}
              onDeny={handleDenyPermission}
              onProceed={handleProceed}
            />
          </div>
        ) : (
          <Tabs defaultValue="control" className="space-y-6">
            <TabsList>
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="control">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Control Area */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Screen Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScreenPreview
                        isLive={isRunning}
                        cursorPosition={isRunning ? { x: 45, y: 35 } : undefined}
                        clickTarget={isRunning ? { x: 45, y: 35, label: "Export button" } : undefined}
                      />
                    </CardContent>
                  </Card>

                  {/* Instructions Input */}
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <Textarea
                        placeholder="Describe what you want Solaris to do on your desktop..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                      <div className="flex items-center gap-3 mt-4">
                        {!isRunning ? (
                          <Button 
                            className="flex-1 btn-gradient"
                            onClick={handleStart}
                            disabled={!instructions.trim()}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Automation
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" className="flex-1">
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="flex-1"
                              onClick={() => setIsRunning(false)}
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Sidebar */}
                <div>
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <AutomationTimeline steps={steps} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    Recent Automations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-secondary text-center py-8">
                    No automation history yet
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Automation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-secondary">
                    Settings for desktop automation will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Action Confirm Modal */}
        <ActionConfirmModal
          open={showConfirm}
          action={{
            type: "click",
            target: "Export button",
            description: "Click the Export button in Figma",
            coordinates: { x: 450, y: 350 },
          }}
          onConfirm={() => setShowConfirm(false)}
          onDeny={() => setShowConfirm(false)}
          autoConfirmSeconds={5}
        />
      </div>
    </div>
  );
}
