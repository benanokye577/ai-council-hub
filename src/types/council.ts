// Task/Goal System Types for Multi-Agent Council

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AgentRole = 'aria' | 'marcus' | 'echo' | 'nova';
export type VotingMode = 'majority' | 'weighted' | 'consensus' | 'dictator';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedMinutes?: number;
  tags: string[];
  agentAssigned?: AgentRole;
  recurringPattern?: string; // Cron expression
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: Date;
}

export interface Goal {
  id: string;
  title: string;
  targetDate: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  linkedTasks: string[];
}

export interface MarketSignal {
  id: string;
  title: string;
  edge: number; // Percentage edge
  confidence: number;
  source: string;
}

export interface DailyBrief {
  date: Date;
  priorityTasks: Task[];
  upcomingDeadlines: Task[];
  councilRecommendations: string[];
  marketOpportunities?: MarketSignal[];
}

// Council Voting Types
export interface CouncilVote {
  agentId: string;
  response: string;
  confidence: number; // 0-1
  reasoning: string;
  votesFor: string[]; // IDs of responses this agent endorses
}

export interface CouncilDecision {
  winningResponse: string;
  voteBreakdown: Record<string, number>;
  dissent?: string[]; // Minority opinions worth surfacing
  synthesizedResponse: string;
}

export interface CouncilSettings {
  votingMode: VotingMode;
  quorumRequired: number; // Percentage of agents needed
  tieBreaker: AgentRole;
  allowDissent: boolean;
}

// Automation Types
export interface Automation {
  id: string;
  name: string;
  schedule: string; // Cron expression or human-readable
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  type: 'morning_brief' | 'market_scan' | 'weekly_review' | 'custom';
}
