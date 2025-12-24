import { useState, useEffect, useCallback } from 'react';

export interface CachedConversation {
  id: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  cachedAt: Date;
  syncStatus: 'synced' | 'pending' | 'failed';
}

export interface OfflineState {
  isOnline: boolean;
  lastOnlineAt: Date | null;
  cachedConversations: CachedConversation[];
  pendingActions: Array<{
    id: string;
    type: string;
    data: any;
    createdAt: Date;
  }>;
  storageUsed: number;
  storageLimit: number;
}

const STORAGE_KEY = 'nebula_offline_cache';
const STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB limit

export function useOfflineMode() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    lastOnlineAt: navigator.onLine ? new Date() : null,
    cachedConversations: [],
    pendingActions: [],
    storageUsed: 0,
    storageLimit: STORAGE_LIMIT,
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOnline: true,
        lastOnlineAt: new Date(),
      }));
      // Trigger sync when coming back online
      syncPendingActions();
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOnline: false,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load cached data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          cachedConversations: parsed.cachedConversations?.map((c: any) => ({
            ...c,
            cachedAt: new Date(c.cachedAt),
            messages: c.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          })) || [],
          pendingActions: parsed.pendingActions?.map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt),
          })) || [],
          storageUsed: new Blob([stored]).size,
        }));
      }
    } catch (error) {
      console.error('Failed to load offline cache:', error);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      const data = JSON.stringify({
        cachedConversations: state.cachedConversations,
        pendingActions: state.pendingActions,
      });
      localStorage.setItem(STORAGE_KEY, data);
      setState(prev => ({
        ...prev,
        storageUsed: new Blob([data]).size,
      }));
    } catch (error) {
      console.error('Failed to save offline cache:', error);
    }
  }, [state.cachedConversations, state.pendingActions]);

  const cacheConversation = useCallback((conversation: Omit<CachedConversation, 'cachedAt' | 'syncStatus'>) => {
    setState(prev => {
      // Check storage limit
      const newData = JSON.stringify(conversation);
      if (prev.storageUsed + new Blob([newData]).size > prev.storageLimit) {
        // Remove oldest cached conversation to make room
        const sorted = [...prev.cachedConversations].sort(
          (a, b) => a.cachedAt.getTime() - b.cachedAt.getTime()
        );
        if (sorted.length > 0) {
          const removed = sorted[0];
          return {
            ...prev,
            cachedConversations: [
              ...prev.cachedConversations.filter(c => c.id !== removed.id),
              {
                ...conversation,
                cachedAt: new Date(),
                syncStatus: prev.isOnline ? 'synced' : 'pending',
              },
            ],
          };
        }
      }

      const existing = prev.cachedConversations.findIndex(c => c.id === conversation.id);
      if (existing >= 0) {
        const updated = [...prev.cachedConversations];
        updated[existing] = {
          ...conversation,
          cachedAt: new Date(),
          syncStatus: prev.isOnline ? 'synced' : 'pending',
        };
        return { ...prev, cachedConversations: updated };
      }

      return {
        ...prev,
        cachedConversations: [
          ...prev.cachedConversations,
          {
            ...conversation,
            cachedAt: new Date(),
            syncStatus: prev.isOnline ? 'synced' : 'pending',
          },
        ],
      };
    });
  }, []);

  const addPendingAction = useCallback((type: string, data: any) => {
    setState(prev => ({
      ...prev,
      pendingActions: [
        ...prev.pendingActions,
        {
          id: crypto.randomUUID(),
          type,
          data,
          createdAt: new Date(),
        },
      ],
    }));
  }, []);

  const syncPendingActions = useCallback(async () => {
    if (!navigator.onLine) return { success: false, synced: 0 };

    let synced = 0;
    const failedActions: typeof state.pendingActions = [];

    for (const action of state.pendingActions) {
      try {
        // Simulate sync - in real implementation, this would call the API
        console.log('Syncing action:', action.type, action.data);
        synced++;
      } catch (error) {
        console.error('Failed to sync action:', error);
        failedActions.push(action);
      }
    }

    setState(prev => ({
      ...prev,
      pendingActions: failedActions,
      cachedConversations: prev.cachedConversations.map(c => ({
        ...c,
        syncStatus: 'synced' as const,
      })),
    }));

    return { success: failedActions.length === 0, synced };
  }, [state.pendingActions]);

  const getCachedConversation = useCallback((id: string) => {
    return state.cachedConversations.find(c => c.id === id);
  }, [state.cachedConversations]);

  const removeCachedConversation = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cachedConversations: prev.cachedConversations.filter(c => c.id !== id),
    }));
  }, []);

  const clearCache = useCallback(() => {
    setState(prev => ({
      ...prev,
      cachedConversations: [],
      pendingActions: [],
      storageUsed: 0,
    }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getStoragePercentage = useCallback(() => {
    return Math.round((state.storageUsed / state.storageLimit) * 100);
  }, [state.storageUsed, state.storageLimit]);

  return {
    isOnline: state.isOnline,
    lastOnlineAt: state.lastOnlineAt,
    cachedConversations: state.cachedConversations,
    pendingActions: state.pendingActions,
    storageUsed: state.storageUsed,
    storageLimit: state.storageLimit,
    cacheConversation,
    addPendingAction,
    syncPendingActions,
    getCachedConversation,
    removeCachedConversation,
    clearCache,
    getStoragePercentage,
  };
}
