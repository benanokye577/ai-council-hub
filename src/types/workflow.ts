export type NodeType = 'trigger' | 'condition' | 'action' | 'ai';

export interface WorkflowNodeData {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  config?: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  fromPort?: 'yes' | 'no' | 'default';
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNodeData[];
  connections: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export const NODE_TEMPLATES: Record<NodeType, { color: string; bgColor: string }> = {
  trigger: { color: 'hsl(38, 92%, 50%)', bgColor: 'hsl(38, 92%, 50%, 0.15)' },
  condition: { color: 'hsl(263, 70%, 58%)', bgColor: 'hsl(263, 70%, 58%, 0.15)' },
  action: { color: 'hsl(187, 80%, 50%)', bgColor: 'hsl(187, 80%, 50%, 0.15)' },
  ai: { color: 'hsl(330, 81%, 60%)', bgColor: 'hsl(330, 81%, 60%, 0.15)' },
};
