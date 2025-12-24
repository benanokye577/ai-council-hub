import { Download, FileText, FileJson, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ConversationMessage } from './ConversationHistory';
import { cn } from '@/lib/utils';

interface ConversationExportProps {
  messages: ConversationMessage[];
  className?: string;
}

export function ConversationExport({ messages, className }: ConversationExportProps) {
  const [copied, setCopied] = useState(false);

  const formatAsText = () => {
    return messages
      .map(m => {
        const role = m.role === 'user' ? 'You' : 'Assistant';
        const time = m.timestamp.toLocaleTimeString();
        return `[${time}] ${role}: ${m.content}`;
      })
      .join('\n\n');
  };

  const formatAsMarkdown = () => {
    const lines = ['# Conversation Export', '', `*Exported on ${new Date().toLocaleString()}*`, ''];
    
    messages.forEach(m => {
      const role = m.role === 'user' ? '**You**' : '**Assistant**';
      const time = m.timestamp.toLocaleTimeString();
      lines.push(`### ${role} - ${time}`);
      lines.push('');
      lines.push(m.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    });
    
    return lines.join('\n');
  };

  const formatAsJson = () => {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    }, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${filename}`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatAsText());
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleExport = (format: 'text' | 'markdown' | 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'text':
        downloadFile(formatAsText(), `conversation-${timestamp}.txt`, 'text/plain');
        break;
      case 'markdown':
        downloadFile(formatAsMarkdown(), `conversation-${timestamp}.md`, 'text/markdown');
        break;
      case 'json':
        downloadFile(formatAsJson(), `conversation-${timestamp}.json`, 'application/json');
        break;
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="h-8 px-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Download className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('text')}>
            <FileText className="w-4 h-4 mr-2" />
            Export as Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('markdown')}>
            <FileText className="w-4 h-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileJson className="w-4 h-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
