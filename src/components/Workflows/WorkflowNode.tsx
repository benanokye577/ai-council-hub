import { motion } from "framer-motion";
import { GripVertical, Settings, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowNodeData, NODE_TEMPLATES } from "@/types/workflow";

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
  const template = NODE_TEMPLATES[node.type];

  return (
    <div
      className={cn(
        "absolute w-48 rounded-lg border-2 bg-background-card shadow-lg cursor-move transition-all",
        selected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        borderColor: selected ? template.color : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDragStart={onDragStart}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-2 px-3 py-2 rounded-t-md"
        style={{ backgroundColor: template.bgColor }}
      >
        <GripVertical className="w-4 h-4 text-foreground-tertiary" />
        <span className="text-lg">{node.icon}</span>
        <span 
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: template.color }}
        >
          {node.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <h4 className="font-medium text-sm text-foreground">{node.label}</h4>
        <p className="text-xs text-foreground-tertiary mt-1 line-clamp-2">
          {node.description}
        </p>
      </div>

      {/* Connection Points */}
      <div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-background"
        style={{ borderColor: template.color }}
      />
      {node.type === 'condition' ? (
        <>
          <div 
            className="absolute -bottom-2 left-1/4 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center"
            style={{ borderColor: 'hsl(142, 71%, 45%)' }}
          >
            <span className="text-[8px] text-success font-bold">Y</span>
          </div>
          <div 
            className="absolute -bottom-2 left-3/4 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center"
            style={{ borderColor: 'hsl(0, 84%, 60%)' }}
          >
            <span className="text-[8px] text-error font-bold">N</span>
          </div>
        </>
      ) : (
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-background"
          style={{ borderColor: template.color }}
        />
      )}

      {/* Actions (visible on hover/select) */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 right-0 flex items-center gap-1 bg-popover rounded-md border border-border shadow-md p-1"
        >
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
            className="h-6 w-6 text-error hover:text-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
