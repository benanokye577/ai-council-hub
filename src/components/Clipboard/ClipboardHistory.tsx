import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clipboard, 
  Search, 
  Copy, 
  Trash2, 
  Pin, 
  Image, 
  FileText, 
  Code, 
  Link,
  Clock,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ClipboardItemType = 'text' | 'code' | 'image' | 'link' | 'file';

interface ClipboardItem {
  id: string;
  content: string;
  preview?: string;
  type: ClipboardItemType;
  isPinned: boolean;
  timestamp: Date;
  source?: string;
}

const mockClipboardHistory: ClipboardItem[] = [
  { id: '1', content: 'const handleSubmit = async () => {\n  await api.post("/data", formData);\n};', type: 'code', isPinned: true, timestamp: new Date(), source: 'VS Code' },
  { id: '2', content: 'https://docs.lovable.dev/features/cloud', type: 'link', isPinned: false, timestamp: new Date(Date.now() - 300000), source: 'Chrome' },
  { id: '3', content: 'Remember to update the API documentation with the new endpoints and authentication flow.', type: 'text', isPinned: false, timestamp: new Date(Date.now() - 600000), source: 'Notion' },
  { id: '4', content: 'Meeting notes: Discussed Q1 roadmap, prioritized voice features and workflow builder.', type: 'text', isPinned: true, timestamp: new Date(Date.now() - 900000), source: 'Notes' },
  { id: '5', content: 'function calculateCost(tokens: number, model: string): number', type: 'code', isPinned: false, timestamp: new Date(Date.now() - 1200000), source: 'VS Code' },
  { id: '6', content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...', preview: 'Screenshot', type: 'image', isPinned: false, timestamp: new Date(Date.now() - 1500000), source: 'Screenshot' },
];

interface ClipboardHistoryProps {
  className?: string;
  maxItems?: number;
}

export function ClipboardHistory({ className, maxItems = 50 }: ClipboardHistoryProps) {
  const [items, setItems] = useState(mockClipboardHistory);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ClipboardItemType | 'all'>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.source?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const pinnedItems = filteredItems.filter(i => i.isPinned);
  const recentItems = filteredItems.filter(i => !i.isPinned);

  const handleCopy = async (item: ClipboardItem) => {
    await navigator.clipboard.writeText(item.content);
    toast.success('Copied to clipboard');
  };

  const handlePin = (id: string) => {
    setItems(items.map(i => 
      i.id === id ? { ...i, isPinned: !i.isPinned } : i
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const getTypeIcon = (type: ClipboardItemType) => {
    switch (type) {
      case 'code': return <Code className="w-3.5 h-3.5" />;
      case 'image': return <Image className="w-3.5 h-3.5" />;
      case 'link': return <Link className="w-3.5 h-3.5" />;
      case 'file': return <FileText className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Clipboard History</h2>
          <Badge variant="secondary" className="ml-auto">
            {items.length} items
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clipboard..."
            className="pl-8 h-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'text', 'code', 'link', 'image'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Pinned */}
          {pinnedItems.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </p>
              <div className="space-y-1">
                {pinnedItems.map((item, i) => (
                  <ClipboardItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onCopy={() => handleCopy(item)}
                    onPin={() => handlePin(item.id)}
                    onDelete={() => handleDelete(item.id)}
                    getTypeIcon={getTypeIcon}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent */}
          {recentItems.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent
              </p>
              <div className="space-y-1">
                {recentItems.map((item, i) => (
                  <ClipboardItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onCopy={() => handleCopy(item)}
                    onPin={() => handlePin(item.id)}
                    onDelete={() => handleDelete(item.id)}
                    getTypeIcon={getTypeIcon}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Clipboard className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No clipboard items</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ClipboardItemCard({
  item,
  index,
  onCopy,
  onPin,
  onDelete,
  getTypeIcon,
  formatTime
}: {
  item: ClipboardItem;
  index: number;
  onCopy: () => void;
  onPin: () => void;
  onDelete: () => void;
  getTypeIcon: (type: ClipboardItemType) => React.ReactNode;
  formatTime: (date: Date) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="group p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          "p-1.5 rounded-md shrink-0 mt-0.5",
          item.type === 'code' && "bg-[hsl(var(--workflow-action))]/10 text-[hsl(var(--workflow-action))]",
          item.type === 'link' && "bg-primary/10 text-primary",
          item.type === 'image' && "bg-[hsl(var(--workflow-ai))]/10 text-[hsl(var(--workflow-ai))]",
          item.type === 'text' && "bg-secondary text-muted-foreground"
        )}>
          {getTypeIcon(item.type)}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm line-clamp-2",
            item.type === 'code' && "font-mono text-xs"
          )}>
            {item.type === 'image' ? item.preview || 'Image' : item.content}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{formatTime(item.timestamp)}</span>
            {item.source && (
              <>
                <span>·</span>
                <span>{item.source}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onCopy}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", item.isPinned && "text-warning")}
            onClick={onPin}
          >
            <Pin className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}