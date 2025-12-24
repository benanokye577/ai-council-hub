import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WorkflowNodeData } from "@/types/workflow";

type RunStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';
type NodeStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

interface NodeRunState {
  nodeId: string;
  status: NodeStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  output?: any;
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

  const progress = nodes.length > 0 
    ? (nodeStates.filter(n => n.status === 'completed').length / nodes.length) * 100
    : 0;

  const handleRun = () => {
    setStatus('running');
    setNodeStates(nodes.map(n => ({ nodeId: n.id, status: 'pending' as const })));
    setCurrentNodeIndex(0);
    
    // Simulate execution
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
    }, 1500);

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

  const handleRestart = () => {
    handleStop();
    handleRun();
  };

  const getStatusIcon = (nodeStatus: NodeStatus) => {
    switch (nodeStatus) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-foreground-tertiary" />;
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-success" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5 text-error" />;
      case 'skipped':
        return <div className="w-3.5 h-3.5 rounded-full border border-foreground-tertiary" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex items-center gap-2">
        {status === 'idle' || status === 'completed' || status === 'failed' ? (
          <Button 
            className="flex-1 btn-gradient" 
            onClick={handleRun}
            disabled={nodes.length === 0}
          >
            <Play className="w-4 h-4 mr-2" />
            Run Workflow
          </Button>
        ) : (
          <>
            {status === 'running' ? (
              <Button variant="outline" className="flex-1" onClick={handlePause}>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button className="flex-1 btn-gradient" onClick={handleRun}>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            <Button variant="destructive" onClick={handleStop}>
              <Square className="w-4 h-4" />
            </Button>
          </>
        )}
        {(status === 'completed' || status === 'failed') && (
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress */}
      {status !== 'idle' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-secondary">
              {status === 'running' && "Running..."}
              {status === 'paused' && "Paused"}
              {status === 'completed' && "Completed"}
              {status === 'failed' && "Failed"}
            </span>
            <span className="text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Node Execution Log */}
      {nodeStates.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {nodeStates.map((ns, i) => {
            const node = nodes.find(n => n.id === ns.nodeId);
            if (!node) return null;

            return (
              <motion.div
                key={ns.nodeId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-xs",
                  ns.status === 'running' && "bg-primary/10",
                  ns.status === 'completed' && "bg-success/5",
                  ns.status === 'failed' && "bg-error/10"
                )}
              >
                {getStatusIcon(ns.status)}
                <span className="text-sm">{node.icon}</span>
                <span className="flex-1 text-foreground truncate">{node.label}</span>
                {ns.completedAt && (
                  <span className="text-foreground-tertiary">
                    {((ns.completedAt.getTime() - (ns.startedAt?.getTime() || 0)) / 1000).toFixed(1)}s
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
