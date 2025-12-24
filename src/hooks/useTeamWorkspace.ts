import { useState, useEffect, useCallback } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
}

export interface SharedSession {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  sharedWith: string[]; // member IDs
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  accessLevel: 'private' | 'team' | 'public';
}

export interface TeamWorkspace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  sharedSessions: SharedSession[];
  knowledgeBase: KnowledgeBase[];
  settings: {
    allowMemberInvites: boolean;
    defaultSessionVisibility: 'private' | 'team';
    enableRealTimeSync: boolean;
  };
  createdAt: Date;
}

const STORAGE_KEY = 'nebula_team_workspace';

const defaultWorkspace: TeamWorkspace = {
  id: crypto.randomUUID(),
  name: 'My Workspace',
  description: 'Personal workspace for voice conversations',
  members: [
    {
      id: 'current-user',
      name: 'You',
      email: 'user@example.com',
      role: 'owner',
      status: 'online',
      lastActive: new Date(),
    },
  ],
  sharedSessions: [],
  knowledgeBase: [
    {
      id: 'kb-1',
      title: 'Getting Started',
      content: 'Welcome to Nebula! Use voice commands to interact with your AI assistant.',
      category: 'Help',
      tags: ['tutorial', 'basics'],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      accessLevel: 'team',
    },
  ],
  settings: {
    allowMemberInvites: true,
    defaultSessionVisibility: 'private',
    enableRealTimeSync: true,
  },
  createdAt: new Date(),
};

export function useTeamWorkspace() {
  const [workspace, setWorkspace] = useState<TeamWorkspace>(defaultWorkspace);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId] = useState('current-user');

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWorkspace({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          members: parsed.members.map((m: any) => ({
            ...m,
            lastActive: new Date(m.lastActive),
          })),
          sharedSessions: parsed.sharedSessions.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
          })),
          knowledgeBase: parsed.knowledgeBase.map((k: any) => ({
            ...k,
            createdAt: new Date(k.createdAt),
            updatedAt: new Date(k.updatedAt),
          })),
        });
      }
    } catch (error) {
      console.error('Failed to load workspace:', error);
    }
    setIsLoading(false);
  }, []);

  // Save when workspace changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    }
  }, [workspace, isLoading]);

  // Member management
  const addMember = useCallback((member: Omit<TeamMember, 'id' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...member,
      id: crypto.randomUUID(),
      lastActive: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
    return newMember;
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setWorkspace(prev => ({
      ...prev,
      members: prev.members.map(m =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  }, []);

  const removeMember = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
    }));
  }, []);

  // Session sharing
  const shareSession = useCallback((session: Omit<SharedSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: SharedSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      sharedSessions: [...prev.sharedSessions, newSession],
    }));
    return newSession;
  }, []);

  const updateSharedSession = useCallback((id: string, updates: Partial<SharedSession>) => {
    setWorkspace(prev => ({
      ...prev,
      sharedSessions: prev.sharedSessions.map(s =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
      ),
    }));
  }, []);

  const unshareSession = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      sharedSessions: prev.sharedSessions.filter(s => s.id !== id),
    }));
  }, []);

  // Knowledge base management
  const addKnowledgeEntry = useCallback((entry: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: KnowledgeBase = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      knowledgeBase: [...prev.knowledgeBase, newEntry],
    }));
    return newEntry;
  }, []);

  const updateKnowledgeEntry = useCallback((id: string, updates: Partial<KnowledgeBase>) => {
    setWorkspace(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.map(k =>
        k.id === id ? { ...k, ...updates, updatedAt: new Date() } : k
      ),
    }));
  }, []);

  const deleteKnowledgeEntry = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.filter(k => k.id !== id),
    }));
  }, []);

  const searchKnowledgeBase = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return workspace.knowledgeBase.filter(entry =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [workspace.knowledgeBase]);

  // Workspace settings
  const updateSettings = useCallback((updates: Partial<TeamWorkspace['settings']>) => {
    setWorkspace(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const updateWorkspace = useCallback((updates: Partial<Pick<TeamWorkspace, 'name' | 'description'>>) => {
    setWorkspace(prev => ({ ...prev, ...updates }));
  }, []);

  // Get sessions accessible to current user
  const getAccessibleSessions = useCallback(() => {
    return workspace.sharedSessions.filter(session =>
      session.ownerId === currentUserId ||
      session.sharedWith.includes(currentUserId) ||
      session.isPublic
    );
  }, [workspace.sharedSessions, currentUserId]);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return workspace.members.find(m => m.id === currentUserId);
  }, [workspace.members, currentUserId]);

  return {
    workspace,
    isLoading,
    currentUserId,
    // Member management
    addMember,
    updateMember,
    removeMember,
    // Session sharing
    shareSession,
    updateSharedSession,
    unshareSession,
    getAccessibleSessions,
    // Knowledge base
    addKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
    searchKnowledgeBase,
    // Workspace management
    updateSettings,
    updateWorkspace,
    getCurrentUser,
  };
}
