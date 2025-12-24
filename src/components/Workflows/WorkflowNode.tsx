import { Settings, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowNodeData, NodeType } from "@/types/workflow";

const typeConfig: Record<NodeType, { color: string; bgColor: string }> = {
  trigger: { color: "hsl(var(--workflow-trigger))", bgColor: "hsl(var(--workflow-trigger) / 0.1)" },
  condition: { color: "hsl(var(--workflow-condition))", bgColor: "hsl(var(--workflow-condition) / 0.1)" },
  action: { color: "hsl(var(--workflow-action))", bgColor: "hsl(var(--workflow-action) / 0.1)" },
  ai: { color: "hsl(var(--workflow-ai))", bgColor: "hsl(var(--workflow-ai) / 0.1)" },
};

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onConfigure: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export function WorkflowNode({
  node,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onConfigure,
  onDragStart,
}: WorkflowNodeProps) {
  const config = typeConfig[node.type];

  return (
    <div
      className={cn(
        "absolute w-40 group cursor-move transition-shadow duration-150",
        selected && "z-10"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDragStart={onDragStart}
    >
      {/* Connection Point Top */}
      <div 
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-background z-10"
        style={{ borderColor: config.color }}
      />

      {/* Node Card */}
      <div 
        className={cn(
          "rounded-lg border bg-card overflow-hidden transition-all duration-150",
          selected 
            ? "border-primary shadow-lg shadow-primary/10" 
            : "border-border/60 hover:border-border"
        )}
      >
        {/* Header */}
        <div 
          className="px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: config.bgColor }}
        >
          <span className="text-sm">{node.icon}</span>
          <span 
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: config.color }}
          >
            {node.type}
          </span>
        </div>

        {/* Body */}
        <div className="px-3 py-2.5">
          <h4 className="text-sm font-medium text-foreground">{node.label}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {node.description}
          </p>
        </div>
      </div>

      {/* Connection Point Bottom */}
      {node.type === 'condition' ? (
        <>
          <div 
            className="absolute -bottom-1.5 left-1/4 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-background flex items-center justify-center"
            style={{ borderColor: 'hsl(var(--success))' }}
          >
            <span className="text-[6px] font-bold text-success">Y</span>
          </div>
          <div 
            className="absolute -bottom-1.5 left-3/4 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-background flex items-center justify-center"
            style={{ borderColor: 'hsl(var(--error))' }}
          >
            <span className="text-[6px] font-bold text-error">N</span>
          </div>
        </>
      ) : (
        <div 
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-background"
          style={{ borderColor: config.color }}
        />
      )}

      {/* Actions */}
      {selected && (
        <div className="absolute -top-8 right-0 flex items-center gap-0.5 bg-card rounded border border-border shadow-md p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}