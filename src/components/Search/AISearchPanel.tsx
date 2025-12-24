import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ExternalLink, Loader2, BookOpen, Globe, X, Filter, Calendar, Link2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface SearchResult {
  answer: string;
  citations: string[];
  model: string;
}

interface AISearchPanelProps {
  className?: string;
  onClose?: () => void;
}

const DATE_FILTERS = [
  { value: 'any', label: 'Any time' },
  { value: 'day', label: 'Past 24 hours' },
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
  { value: 'year', label: 'Past year' },
];

const SUGGESTED_DOMAINS = [
  'wikipedia.org',
  'github.com',
  'stackoverflow.com',
  'arxiv.org',
  'nature.com',
  'medium.com',
];

export function AISearchPanel({ className, onClose }: AISearchPanelProps) {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'web' | 'academic'>('web');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<{ query: string; timestamp: Date }[]>([]);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('any');
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/perplexity-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          query, 
          searchMode,
          dateFilter: dateFilter !== 'any' ? dateFilter : undefined,
          domains: domains.length > 0 ? domains : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setResult(data);
      setSearchHistory(prev => [{ query, timestamp: new Date() }, ...prev.slice(0, 9)]);
      toast.success('Search completed');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    // Clean the domain
    let cleanDomain = newDomain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
    cleanDomain = cleanDomain.split('/')[0];
    
    if (!domains.includes(cleanDomain)) {
      setDomains(prev => [...prev, cleanDomain]);
    }
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(prev => prev.filter(d => d !== domain));
  };

  const handleAddSuggestedDomain = (domain: string) => {
    if (!domains.includes(domain)) {
      setDomains(prev => [...prev, domain]);
    }
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const activeFiltersCount = (dateFilter !== 'any' ? 1 : 0) + (domains.length > 0 ? 1 : 0);

  return (
    <Card className={`bg-card/95 backdrop-blur-xl border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Search
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Mode Tabs */}
        <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'web' | 'academic')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="web" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Web Search
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Academic
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="pl-10 bg-background/50"
              disabled={isLoading}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={activeFiltersCount > 0 ? 'border-primary text-primary' : ''}
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filters Section */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-border/50"
            >
              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date Range
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FILTERS.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Domain Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Filter by Domains
                </label>
                
                {/* Active domains */}
                {domains.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {domains.map(domain => (
                      <Badge 
                        key={domain} 
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {domain}
                        <button 
                          onClick={() => handleRemoveDomain(domain)}
                          className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-muted-foreground"
                      onClick={() => setDomains([])}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Add domain input */}
                <div className="flex gap-2">
                  <Input
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                    placeholder="Add domain (e.g., wikipedia.org)"
                    className="bg-background/50 text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAddDomain}
                    disabled={!newDomain.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested domains */}
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Suggested:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_DOMAINS.filter(d => !domains.includes(d)).slice(0, 4).map(domain => (
                      <Badge 
                        key={domain}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleAddSuggestedDomain(domain)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Searching the web...</p>
              </div>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Answer */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <ScrollArea className="max-h-[300px]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.answer}
                  </p>
                </ScrollArea>
              </div>

              {/* Citations */}
              {result.citations && result.citations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Sources ({result.citations.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.citations.map((citation, index) => (
                      <motion.a
                        key={index}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <span className="mr-1 text-primary">[{index + 1}]</span>
                          {extractDomain(citation)}
                        </Badge>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Active filters & Model info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Powered by Perplexity {result.model}</span>
                  {dateFilter !== 'any' && (
                    <Badge variant="outline" className="text-xs">
                      {DATE_FILTERS.find(f => f.value === dateFilter)?.label}
                    </Badge>
                  )}
                  {domains.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {domains.length} domain{domains.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {searchMode === 'academic' ? 'Academic' : 'Web'} Search
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search History */}
        {searchHistory.length > 0 && !result && !isLoading && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
            <div className="space-y-1">
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(item.query)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors truncate"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
