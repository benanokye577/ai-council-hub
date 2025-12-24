import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  User,
  FileText,
  Tag,
  Calendar,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Entity {
  id: string;
  name: string;
  type: 'person' | 'concept' | 'project' | 'document' | 'event';
  x: number;
  y: number;
  connections: string[];
}

const mockEntities: Entity[] = [
  { id: '1', name: 'AI Architecture', type: 'concept', x: 400, y: 300, connections: ['2', '3', '5'] },
  { id: '2', name: 'Voice Interface', type: 'project', x: 250, y: 200, connections: ['1', '4'] },
  { id: '3', name: 'Workflow Engine', type: 'project', x: 550, y: 200, connections: ['1', '6'] },
  { id: '4', name: 'ElevenLabs', type: 'concept', x: 150, y: 350, connections: ['2'] },
  { id: '5', name: 'Multi-Agent', type: 'concept', x: 500, y: 420, connections: ['1', '7'] },
  { id: '6', name: 'Node Canvas', type: 'document', x: 650, y: 320, connections: ['3'] },
  { id: '7', name: 'Council Debate', type: 'concept', x: 350, y: 480, connections: ['5'] },
];

interface MemoryGraphProps {
  className?: string;
}

export function MemoryGraph({ className }: MemoryGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [entities, setEntities] = useState(mockEntities);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(1);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const selectedEntity = entities.find(e => e.id === selectedId);
  const filteredEntities = search 
    ? entities.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : entities;

  const getTypeColor = (type: Entity['type']) => {
    switch (type) {
      case 'person': return 'hsl(var(--primary))';
      case 'concept': return 'hsl(var(--workflow-condition))';
      case 'project': return 'hsl(var(--workflow-action))';
      case 'document': return 'hsl(var(--workflow-trigger))';
      case 'event': return 'hsl(var(--workflow-ai))';
    }
  };

  const getTypeIcon = (type: Entity['type']) => {
    switch (type) {
      case 'person': return User;
      case 'concept': return Brain;
      case 'project': return Tag;
      case 'document': return FileText;
      case 'event': return Calendar;
    }
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingId(id);
    const entity = entities.find(en => en.id === id);
    if (entity) {
      setOffset({
        x: e.clientX - entity.x * zoom,
        y: e.clientY - entity.y * zoom
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    
    setEntities(entities.map(en => 
      en.id === draggingId 
        ? { ...en, x: (e.clientX - offset.x) / zoom, y: (e.clientY - offset.y) / zoom }
        : en
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Knowledge Graph</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(1)}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entities..."
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Graph Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-[radial-gradient(circle,hsl(var(--border)/0.3)_1px,transparent_1px)] [background-size:24px_24px]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedId(null)}
      >
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}
        >
          {/* Connections */}
          {entities.map(entity => 
            entity.connections.map(connId => {
              const target = entities.find(e => e.id === connId);
              if (!target) return null;
              
              const isHighlighted = selectedId === entity.id || selectedId === connId;
              
              return (
                <line
                  key={`${entity.id}-${connId}`}
                  x1={entity.x}
                  y1={entity.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeOpacity={isHighlighted ? 0.8 : 0.4}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
          {filteredEntities.map((entity) => {
            const Icon = getTypeIcon(entity.type);
            const isSelected = selectedId === entity.id;
            const isConnected = selectedId && entities.find(e => e.id === selectedId)?.connections.includes(entity.id);
            
            return (
              <motion.div
                key={entity.id}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-shadow",
                  (isSelected || isConnected) && "z-10"
                )}
                style={{ left: entity.x, top: entity.y }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                onMouseDown={(e) => handleMouseDown(entity.id, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(entity.id);
                }}
              >
                <div 
                  className={cn(
                    "p-3 rounded-xl border-2 bg-card shadow-lg transition-all",
                    isSelected && "ring-2 ring-primary/50",
                    isConnected && "ring-2 ring-primary/30"
                  )}
                  style={{ 
                    borderColor: isSelected ? getTypeColor(entity.type) : 'hsl(var(--border))',
                    boxShadow: isSelected ? `0 0 20px ${getTypeColor(entity.type)}40` : undefined
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${getTypeColor(entity.type)}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: getTypeColor(entity.type) }} />
                  </div>
                  <p className="text-xs font-medium text-center whitespace-nowrap max-w-20 truncate">
                    {entity.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Entity Detail Panel */}
      {selectedEntity && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-t border-border p-4"
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: `${getTypeColor(selectedEntity.type)}20` }}
            >
              {(() => {
                const Icon = getTypeIcon(selectedEntity.type);
                return <Icon className="w-5 h-5" style={{ color: getTypeColor(selectedEntity.type) }} />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{selectedEntity.name}</h3>
              <Badge variant="secondary" className="text-xs mt-1 capitalize">
                {selectedEntity.type}
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Link2 className="w-3.5 h-3.5" />
            <span>{selectedEntity.connections.length} connections</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}