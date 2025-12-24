import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Server, 
  HardDrive, 
  Trash2, 
  Play, 
  Pause,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LocalModel {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  status: 'available' | 'downloading' | 'installed' | 'running';
  downloadProgress?: number;
  description: string;
}

const availableModels: LocalModel[] = [
  { id: '1', name: 'Llama 3.2 3B', size: '2.0 GB', sizeBytes: 2147483648, status: 'installed', description: 'Fast, efficient for basic tasks' },
  { id: '2', name: 'Llama 3.2 7B', size: '4.1 GB', sizeBytes: 4403298304, status: 'running', description: 'Balanced performance and quality' },
  { id: '3', name: 'Mistral 7B', size: '4.0 GB', sizeBytes: 4294967296, status: 'available', description: 'Great for coding and analysis' },
  { id: '4', name: 'Phi-3 Mini', size: '2.3 GB', sizeBytes: 2469606195, status: 'downloading', downloadProgress: 67, description: 'Compact but powerful' },
  { id: '5', name: 'CodeLlama 7B', size: '3.8 GB', sizeBytes: 4080218931, status: 'available', description: 'Specialized for code generation' },
];

interface LocalModelManagerProps {
  className?: string;
}

export function LocalModelManager({ className }: LocalModelManagerProps) {
  const [models, setModels] = useState(availableModels);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [preferLocal, setPreferLocal] = useState(true);

  const installedModels = models.filter(m => m.status === 'installed' || m.status === 'running');
  const totalSize = installedModels.reduce((sum, m) => sum + m.sizeBytes, 0);
  const runningModel = models.find(m => m.status === 'running');

  const handleDownload = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, status: 'downloading', downloadProgress: 0 } : m
    ));
    
    // Simulate download progress
    const interval = setInterval(() => {
      setModels(prev => prev.map(m => {
        if (m.id === id && m.status === 'downloading') {
          const newProgress = (m.downloadProgress || 0) + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...m, status: 'installed', downloadProgress: undefined };
          }
          return { ...m, downloadProgress: newProgress };
        }
        return m;
      }));
    }, 500);
  };

  const handleDelete = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, status: 'available' } : m
    ));
  };

  const handleRun = (id: string) => {
    setModels(models.map(m => ({
      ...m,
      status: m.id === id ? 'running' : (m.status === 'running' ? 'installed' : m.status)
    })));
  };

  const handleStop = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, status: 'installed' } : m
    ));
  };

  const getStatusBadge = (status: LocalModel['status']) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-success/20 text-success border-success/30">Running</Badge>;
      case 'installed':
        return <Badge variant="secondary">Installed</Badge>;
      case 'downloading':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Downloading</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isOfflineMode ? "bg-warning/10" : "bg-success/10"
              )}>
                {isOfflineMode ? (
                  <WifiOff className="w-5 h-5 text-warning" />
                ) : (
                  <Wifi className="w-5 h-5 text-success" />
                )}
              </div>
              <div>
                <p className="font-medium">{isOfflineMode ? 'Offline Mode' : 'Online'}</p>
                <p className="text-xs text-muted-foreground">
                  {runningModel ? `Using ${runningModel.name}` : 'No local model running'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="font-semibold">{(totalSize / 1073741824).toFixed(1)} GB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Local Model Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Prefer Local Models</Label>
              <p className="text-xs text-muted-foreground">Use local models when available</p>
            </div>
            <Switch checked={preferLocal} onCheckedChange={setPreferLocal} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Offline Mode</Label>
              <p className="text-xs text-muted-foreground">Only use local models (no API calls)</p>
            </div>
            <Switch checked={isOfflineMode} onCheckedChange={setIsOfflineMode} />
          </div>
        </CardContent>
      </Card>

      {/* Models List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Available Models</h3>
        
        {models.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn(
              model.status === 'running' && "border-success/50 bg-success/5"
            )}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg mt-0.5",
                      model.status === 'running' ? "bg-success/10" : "bg-secondary"
                    )}>
                      <Server className={cn(
                        "w-4 h-4",
                        model.status === 'running' ? "text-success" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{model.name}</p>
                        {getStatusBadge(model.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {model.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {model.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {model.status === 'available' && (
                      <Button size="sm" variant="outline" onClick={() => handleDownload(model.id)}>
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download
                      </Button>
                    )}
                    {model.status === 'installed' && (
                      <>
                        <Button size="sm" onClick={() => handleRun(model.id)}>
                          <Play className="w-3.5 h-3.5 mr-1.5" />
                          Run
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(model.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    {model.status === 'running' && (
                      <Button size="sm" variant="outline" onClick={() => handleStop(model.id)}>
                        <Pause className="w-3.5 h-3.5 mr-1.5" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>

                {/* Download Progress */}
                {model.status === 'downloading' && model.downloadProgress !== undefined && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Downloading...</span>
                      <span>{Math.round(model.downloadProgress)}%</span>
                    </div>
                    <Progress value={model.downloadProgress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}