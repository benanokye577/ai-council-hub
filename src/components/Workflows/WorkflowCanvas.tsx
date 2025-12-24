import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize2, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNode } from "./WorkflowNode";
import { NodeTemplate } from "./NodePalette";
import { WorkflowNodeData, WorkflowConnection } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface WorkflowCanvasProps {
  nodes: WorkflowNodeData[];
  connections: WorkflowConnection[];
  selectedNodeId: string | null;
  onNodesChange: (nodes: WorkflowNodeData[]) => void;
  onConnectionsChange: (connections: WorkflowConnection[]) => void;
  onNodeSelect: (id: string | null) => void;
  onNodeConfigure: (id: string) => void;
  className?: string;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNodeId,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
  onNodeConfigure,
  className,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const template: NodeTemplate = JSON.parse(data);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (e.clientX - canvasRect.left - pan.x) / zoom;
    const y = (e.clientY - canvasRect.top - pan.y) / zoom;

    const newNode: WorkflowNodeData = {
      id: `node_${Date.now()}`,
      type: template.type,
      label: template.label,
      description: template.description,
      icon: template.icon,
      position: { x: Math.max(0, x - 96), y: Math.max(0, y - 40) },
    };

    onNodesChange([...nodes, newNode]);
  }, [nodes, onNodesChange, pan, zoom]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleNodeDragStart = (nodeId: string, e: React.DragEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Set empty image to hide default drag preview
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x - dragOffset.x) / zoom;
    const y = (e.clientY - rect.top - pan.y - dragOffset.y) / zoom;

    onNodesChange(
      nodes.map(n => 
        n.id === draggingNode 
          ? { ...n, position: { x: Math.max(0, x), y: Math.max(0, y) } }
          : n
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
  };

  const handleDeleteNode = (id: string) => {
    onNodesChange(nodes.filter(n => n.id !== id));
    onConnectionsChange(connections.filter(c => c.from !== id && c.to !== id));
    onNodeSelect(null);
  };

  const handleDuplicateNode = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const newNode: WorkflowNodeData = {
      ...node,
      id: `node_${Date.now()}`,
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20,
      },
    };

    onNodesChange([...nodes, newNode]);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Draw connections
  const renderConnections = () => (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
    >
      {connections.map((conn) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return null;

        const fromX = fromNode.position.x + 96; // Half width
        const fromY = fromNode.position.y + 80; // Bottom
        const toX = toNode.position.x + 96;
        const toY = toNode.position.y; // Top

        const midY = (fromY + toY) / 2;

        return (
          <g key={conn.id}>
            <path
              d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <circle cx={toX} cy={toY} r="4" fill="hsl(var(--primary))" />
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className={cn("relative overflow-hidden bg-background-secondary rounded-lg border border-border", className)}>
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-popover rounded-md border border-border shadow-md p-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs text-foreground-secondary w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button 
          variant={showGrid ? "secondary" : "ghost"} 
          size="icon" 
          className="h-7 w-7"
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full h-full min-h-[500px]",
          showGrid && "bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:20px_20px]"
        )}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: "0 0",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onClick={() => onNodeSelect(null)}
      >
        {/* Connections */}
        {renderConnections()}

        {/* Nodes */}
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => onNodeSelect(node.id)}
            onDelete={() => handleDeleteNode(node.id)}
            onDuplicate={() => handleDuplicateNode(node.id)}
            onConfigure={() => onNodeConfigure(node.id)}
            onDragStart={(e) => handleNodeDragStart(node.id, e)}
          />
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">🔌</div>
              <p className="text-sm text-foreground-secondary">Drag nodes from the palette</p>
              <p className="text-xs text-foreground-tertiary mt-1">to start building your workflow</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
