import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WifiOff,
  Wifi,
  Database,
  RefreshCw,
  Trash2,
  Cloud,
  CloudOff,
  HardDrive,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface OfflineStatusProps {
  className?: string;
  onClose?: () => void;
}

export function OfflineStatus({ className, onClose }: OfflineStatusProps) {
  const {
    isOnline,
    lastOnlineAt,
    cachedConversations,
    pendingActions,
    storageUsed,
    storageLimit,
    syncPendingActions,
    removeCachedConversation,
    clearCache,
    getStoragePercentage,
  } = useOfflineMode();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncPendingActions();
    setIsSyncing(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const storagePercentage = getStoragePercentage();

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            isOnline ? 'bg-success/20' : 'bg-warning/20'
          )}>
            {isOnline ? (
              <Wifi className="w-5 h-5 text-success" />
            ) : (
              <WifiOff className="w-5 h-5 text-warning" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {isOnline ? 'Online' : 'Offline Mode'}
            </h2>
            <p className="text-sm text-foreground-secondary">
              {isOnline 
                ? 'All features available' 
                : lastOnlineAt 
                  ? `Last online ${formatDistanceToNow(lastOnlineAt, { addSuffix: true })}`
                  : 'Working offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pendingActions.length > 0 && isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={cn('w-4 h-4 mr-1', isSyncing && 'animate-spin')} />
              Sync
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card className={cn(
        'glass-card border',
        isOnline ? 'border-success/30' : 'border-warning/30'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Cloud className="w-8 h-8 text-success" />
              ) : (
                <CloudOff className="w-8 h-8 text-warning" />
              )}
              <div>
                <p className="font-medium">
                  {isOnline ? 'Connected to Cloud' : 'Working Locally'}
                </p>
                <p className="text-sm text-foreground-secondary">
                  {isOnline 
                    ? 'Real-time sync enabled' 
                    : 'Changes will sync when online'}
                </p>
              </div>
            </div>
            <div className={cn(
              'w-3 h-3 rounded-full',
              isOnline ? 'bg-success animate-pulse' : 'bg-warning'
            )} />
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-info" />
            Local Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-secondary">
              {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
            </span>
            <span className={cn(
              'font-medium',
              storagePercentage > 80 ? 'text-error' : 
              storagePercentage > 60 ? 'text-warning' : 'text-foreground'
            )}>
              {storagePercentage}% used
            </span>
          </div>
          <Progress 
            value={storagePercentage} 
            className={cn(
              'h-2',
              storagePercentage > 80 && '[&>div]:bg-error',
              storagePercentage > 60 && storagePercentage <= 80 && '[&>div]:bg-warning'
            )}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-error hover:text-error"
            onClick={clearCache}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Cache
          </Button>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <Card className="glass-card border-warning/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-warning" />
                Pending Sync
              </span>
              <Badge variant="secondary">{pendingActions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {pendingActions.slice(0, 5).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between text-sm p-2 rounded-lg bg-background-elevated/30"
                >
                  <span className="capitalize">{action.type.replace('_', ' ')}</span>
                  <span className="text-xs text-foreground-tertiary">
                    {formatDistanceToNow(action.createdAt, { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cached Conversations */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Cached Conversations
            </span>
            <Badge variant="secondary">{cachedConversations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cachedConversations.length === 0 ? (
            <p className="text-sm text-foreground-tertiary text-center py-4">
              No cached conversations
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cachedConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  layout
                  className="flex items-center justify-between p-2 rounded-lg bg-background-elevated/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-foreground-tertiary">
                        {conv.messages.length} messages
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          conv.syncStatus === 'synced' && 'border-success/50 text-success',
                          conv.syncStatus === 'pending' && 'border-warning/50 text-warning',
                          conv.syncStatus === 'failed' && 'border-error/50 text-error'
                        )}
                      >
                        {conv.syncStatus}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-error hover:text-error shrink-0"
                    onClick={() => removeCachedConversation(conv.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <p className="text-xs text-foreground-tertiary text-center">
        {isOnline 
          ? 'Your data is automatically synced to the cloud'
          : 'Data is saved locally and will sync when you reconnect'}
      </p>
    </div>
  );
}
