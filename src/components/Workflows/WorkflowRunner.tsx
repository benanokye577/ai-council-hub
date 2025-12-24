import { useState } from "react";
import { Play, Pause, Square, RotateCcw, CheckCircle, XCircle, Loader2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowNodeData } from "@/types/workflow";

type RunStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';
type NodeStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

interface NodeRunState {
  nodeId: string;
  status: NodeStatus;
  startedAt?: Date;
  completedAt?: Date;
}

interface WorkflowRunnerProps {
  nodes: WorkflowNodeData[];
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  className?: string;
}

export function WorkflowRunner({
  nodes,
  onRun,
  onPause,
  onStop,
  onRestart,
  className,
}: WorkflowRunnerProps) {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [nodeStates, setNodeStates] = useState<NodeRunState[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  const completedCount = nodeStates.filter(n => n.status === 'completed').length;
  const progress = nodes.length > 0 ? (completedCount / nodes.length) * 100 : 0;

  const handleRun = () => {
    setStatus('running');
    setNodeStates(nodes.map(n => ({ nodeId: n.id, status: 'pending' as const })));
    setCurrentNodeIndex(0);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index >= nodes.length) {
        clearInterval(interval);
        setStatus('completed');
        return;
      }

      setNodeStates(prev => prev.map((ns, i) => 
        i === index 
          ? { ...ns, status: 'running', startedAt: new Date() }
          : i < index
            ? { ...ns, status: 'completed', completedAt: new Date() }
            : ns
      ));
      setCurrentNodeIndex(index);
      index++;
    }, 1200);

    onRun();
  };

  const handlePause = () => {
    setStatus('paused');
    onPause();
  };

  const handleStop = () => {
    setStatus('idle');
    setNodeStates([]);
    setCurrentNodeIndex(0);
    onStop();
  };

  const getStatusIcon = (nodeStatus: NodeStatus) => {
    switch (nodeStatus) {
      case 'pending':
        return <Circle className="w-3 h-3 text-muted-foreground/40" />;
      case 'running':
        return <Loader2 className="w-3 h-3 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-success" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-destructive" />;
      default:
        return <Circle className="w-3 h-3 text-muted-foreground/20" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status */}
      {status !== 'idle' && (
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            "font-medium",
            status === 'running' && "text-primary",
            status === 'completed' && "text-success",
            status === 'failed' && "text-destructive",
            status === 'paused' && "text-warning"
          )}>
            {status === 'running' && "Running..."}
            {status === 'paused' && "Paused"}
            {status === 'completed' && "Complete"}
            {status === 'failed' && "Failed"}
          </span>
          <span className="text-muted-foreground font-mono">
            {completedCount}/{nodes.length}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      {status !== 'idle' && (
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300",
              status === 'completed' ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {status === 'idle' || status === 'completed' || status === 'failed' ? (
          <Button 
            className="flex-1 h-8 text-xs" 
            onClick={handleRun}
            disabled={nodes.length === 0}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {status === 'completed' ? 'Run Again' : 'Run'}
          </Button>
        ) : (
          <>
            {status === 'running' ? (
              <Button variant="outline" className="flex-1 h-8 text-xs" onClick={handlePause}>
                <Pause className="w-3.5 h-3.5 mr-1.5" />
                Pause
              </Button>
            ) : (
              <Button className="flex-1 h-8 text-xs" onClick={handleRun}>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Resume
              </Button>
            )}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleStop}>
              <Square className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
        {(status === 'completed' || status === 'failed') && (
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { handleStop(); handleRun(); }}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Execution Log */}
      {nodeStates.length > 0 && (
        <div className="space-y-1 pt-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Execution Log
          </p>
          {nodeStates.map((ns) => {
            const node = nodes.find(n => n.id === ns.nodeId);
            if (!node) return null;

            return (
              <div
                key={ns.nodeId}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors",
                  ns.status === 'running' && "bg-primary/5",
                  ns.status === 'completed' && "opacity-60"
                )}
              >
                {getStatusIcon(ns.status)}
                <span className="text-sm">{node.icon}</span>
                <span className="flex-1 text-foreground truncate text-xs">{node.label}</span>
                {ns.completedAt && ns.startedAt && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {((ns.completedAt.getTime() - ns.startedAt.getTime()) / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">
            Add nodes to run a workflow
          </p>
        </div>
      )}
    </div>
  );
}