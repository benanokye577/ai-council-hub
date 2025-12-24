import { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
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
      position: { x: Math.max(0, x - 80), y: Math.max(0, y - 32) },
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

  const renderConnections = () => (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {connections.map((conn) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return null;

        const fromX = fromNode.position.x + 80;
        const fromY = fromNode.position.y + 64;
        const toX = toNode.position.x + 80;
        const toY = toNode.position.y;

        const midY = (fromY + toY) / 2;

        return (
          <g key={conn.id}>
            <path
              d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
            />
            <circle cx={toX} cy={toY} r="3" fill="hsl(var(--primary))" />
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className={cn("relative overflow-hidden bg-background", className)}>
      {/* Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[10px] text-muted-foreground font-mono w-9 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px h-4 bg-border/50" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-full"
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
        {renderConnections()}

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

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-dashed border-muted-foreground/40 rounded" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Drag components here
              </p>
              <p className="text-xs text-muted-foreground/60">
                Build automations by connecting nodes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}