import { useState } from "react";
import { motion } from "framer-motion";
import { Workflow, Save, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowCanvas } from "@/components/Workflows/WorkflowCanvas";
import { NodePalette, NodeTemplate } from "@/components/Workflows/NodePalette";
import { WorkflowRunner } from "@/components/Workflows/WorkflowRunner";
import { WorkflowLibrary } from "@/components/Workflows/WorkflowLibrary";
import { WorkflowNodeData, WorkflowConnection, Workflow as WorkflowType } from "@/types/workflow";
import { toast } from "sonner";

export default function Workflows() {
  const [nodes, setNodes] = useState<WorkflowNodeData[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | undefined>();

  const handlePaletteDragStart = (template: NodeTemplate, e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleWorkflowSelect = (workflow: WorkflowType) => {
    setSelectedWorkflowId(workflow.id);
    setWorkflowName(workflow.name);
    setNodes(workflow.nodes);
    setConnections(workflow.connections);
    toast.success(`Loaded "${workflow.name}"`);
  };

  const handleNewWorkflow = () => {
    setSelectedWorkflowId(undefined);
    setWorkflowName("Untitled Workflow");
    setNodes([]);
    setConnections([]);
  };

  const handleSave = () => {
    toast.success("Workflow saved!");
  };

  const handleNodeConfigure = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Configure: ${node.label}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-mesh">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Workflow className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="h-8 text-lg font-semibold bg-transparent border-none p-0 focus-visible:ring-0"
                />
                <p className="text-sm text-foreground-secondary">
                  {nodes.length} nodes • {connections.length} connections
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="btn-gradient">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-[220px_1fr_280px] gap-4 h-[calc(100vh-180px)]">
          {/* Left Sidebar - Node Palette */}
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0 h-full overflow-y-auto">
              <NodePalette onDragStart={handlePaletteDragStart} />
            </CardContent>
          </Card>

          {/* Center - Canvas */}
          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId}
            onNodesChange={setNodes}
            onConnectionsChange={setConnections}
            onNodeSelect={setSelectedNodeId}
            onNodeConfigure={handleNodeConfigure}
            className="h-full"
          />

          {/* Right Sidebar */}
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0 h-full">
              <Tabs defaultValue="library" className="h-full flex flex-col">
                <TabsList className="w-full rounded-none border-b border-border">
                  <TabsTrigger value="library" className="flex-1 text-xs">Library</TabsTrigger>
                  <TabsTrigger value="run" className="flex-1 text-xs">Run</TabsTrigger>
                  <TabsTrigger value="config" className="flex-1 text-xs">Config</TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="flex-1 overflow-y-auto p-3 mt-0">
                  <WorkflowLibrary
                    onSelect={handleWorkflowSelect}
                    onNew={handleNewWorkflow}
                    selectedId={selectedWorkflowId}
                  />
                </TabsContent>

                <TabsContent value="run" className="flex-1 overflow-y-auto p-3 mt-0">
                  <WorkflowRunner
                    nodes={nodes}
                    onRun={() => console.log("Running workflow")}
                    onPause={() => console.log("Paused")}
                    onStop={() => console.log("Stopped")}
                    onRestart={() => console.log("Restarting")}
                  />
                </TabsContent>

                <TabsContent value="config" className="flex-1 overflow-y-auto p-3 mt-0">
                  {selectedNodeId ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-foreground">Node Configuration</h3>
                      <p className="text-xs text-foreground-secondary">
                        Configure the selected node's properties and behavior.
                      </p>
                      {/* Node-specific config would go here */}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-8 h-8 text-foreground-tertiary mx-auto mb-2" />
                      <p className="text-sm text-foreground-secondary">Select a node to configure</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
