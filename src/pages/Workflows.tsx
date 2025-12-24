import { useState } from "react";
import { Save, Play, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowCanvas } from "@/components/Workflows/WorkflowCanvas";
import { NodePalette, NodeTemplate } from "@/components/Workflows/NodePalette";
import { WorkflowRunner } from "@/components/Workflows/WorkflowRunner";
import { WorkflowLibrary } from "@/components/Workflows/WorkflowLibrary";
import { WorkflowNodeData, WorkflowConnection, Workflow as WorkflowType } from "@/types/workflow";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Workflows() {
  const [nodes, setNodes] = useState<WorkflowNodeData[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | undefined>();
  const [activePanel, setActivePanel] = useState<'library' | 'runner'>('library');

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
    toast.success("Workflow saved");
  };

  const handleNodeConfigure = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Configure: ${node.label}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Minimal Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 -ml-1.5 rounded-md hover:bg-secondary/50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div className="h-5 w-px bg-border" />
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="h-7 w-48 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-primary px-2"
          />
          <span className="text-xs text-muted-foreground font-mono">
            {nodes.length}n · {connections.length}c
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave} className="text-xs h-7 px-3">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
          <Button size="sm" className="text-xs h-7 px-3 bg-primary hover:bg-primary/90" onClick={() => setActivePanel('runner')}>
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Palette */}
        <aside className="w-52 border-r border-border/50 overflow-y-auto">
          <NodePalette onDragStart={handlePaletteDragStart} />
        </aside>

        {/* Center: Canvas */}
        <main className="flex-1 relative">
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
        </main>

        {/* Right: Panel */}
        <aside className="w-64 border-l border-border/50 flex flex-col overflow-hidden">
          {/* Panel Tabs */}
          <div className="flex border-b border-border/50 shrink-0">
            <button
              onClick={() => setActivePanel('library')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activePanel === 'library'
                  ? 'text-foreground border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setActivePanel('runner')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activePanel === 'runner'
                  ? 'text-foreground border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Runner
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activePanel === 'library' ? (
              <WorkflowLibrary
                onSelect={handleWorkflowSelect}
                onNew={handleNewWorkflow}
                selectedId={selectedWorkflowId}
              />
            ) : (
              <WorkflowRunner
                nodes={nodes}
                onRun={() => console.log("Running workflow")}
                onPause={() => console.log("Paused")}
                onStop={() => console.log("Stopped")}
                onRestart={() => console.log("Restarting")}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}