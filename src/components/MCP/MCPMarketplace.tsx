import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Puzzle, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MCPServerCard, MCPServer } from "./MCPServerCard";
import { cn } from "@/lib/utils";

const mockServers: MCPServer[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Access repositories, issues, pull requests, and code search",
    icon: "📁",
    category: "Development",
    rating: 4.8,
    downloads: 15420,
    installed: false,
    connected: false,
    tools: ["search_repos", "create_issue", "get_pr", "browse_code"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Read and write Notion pages, databases, and blocks",
    icon: "📝",
    category: "Productivity",
    rating: 4.9,
    downloads: 12350,
    installed: true,
    connected: true,
    tools: ["search_pages", "create_page", "update_block", "query_db"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages, manage channels, and search conversations",
    icon: "💬",
    category: "Communication",
    rating: 4.6,
    downloads: 8920,
    installed: true,
    connected: false,
    authRequired: true,
    tools: ["send_message", "search", "list_channels"],
  },
  {
    id: "linear",
    name: "Linear",
    description: "Manage issues, projects, and sprints in Linear",
    icon: "🎯",
    category: "Development",
    rating: 4.7,
    downloads: 6540,
    installed: false,
    connected: false,
    tools: ["create_issue", "update_issue", "list_projects"],
  },
  {
    id: "figma",
    name: "Figma",
    description: "Access design files, components, and export assets",
    icon: "🎨",
    category: "Design",
    rating: 4.5,
    downloads: 5230,
    installed: false,
    connected: false,
    tools: ["get_file", "export_asset", "list_components"],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Query and manage PostgreSQL databases directly",
    icon: "🐘",
    category: "Database",
    rating: 4.8,
    downloads: 9870,
    installed: false,
    connected: false,
    tools: ["query", "describe_table", "list_tables"],
  },
];

const categories = ["All", "Development", "Productivity", "Communication", "Design", "Database"];

interface MCPMarketplaceProps {
  className?: string;
}

export function MCPMarketplace({ className }: MCPMarketplaceProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [servers, setServers] = useState(mockServers);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const installedServers = servers.filter((s) => s.installed);
  const availableServers = servers.filter((s) => !s.installed);

  const filteredServers = availableServers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (id: string) => {
    setServers(servers.map(s => 
      s.id === id ? { ...s, installed: true } : s
    ));
  };

  const handleUninstall = (id: string) => {
    setServers(servers.map(s => 
      s.id === id ? { ...s, installed: false, connected: false } : s
    ));
  };

  const handleConfigure = (id: string) => {
    // Would open config modal
    console.log("Configure:", id);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Puzzle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">MCP Marketplace</h2>
            <p className="text-sm text-foreground-secondary">
              Extend Solaris with powerful integrations
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="installed">
            Installed
            {installedServers.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {installedServers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
              <Input
                placeholder="Search servers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Server Grid */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-3"
          )}>
            {filteredServers.map((server, i) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <MCPServerCard
                  server={server}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onConfigure={handleConfigure}
                  compact={viewMode === "list"}
                />
              </motion.div>
            ))}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <Puzzle className="w-12 h-12 text-foreground-tertiary mx-auto mb-3" />
              <p className="text-foreground-secondary">No servers found</p>
              <p className="text-sm text-foreground-tertiary">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="installed" className="space-y-4">
          {installedServers.length > 0 ? (
            <div className="space-y-3">
              {installedServers.map((server) => (
                <MCPServerCard
                  key={server.id}
                  server={server}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onConfigure={handleConfigure}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Puzzle className="w-12 h-12 text-foreground-tertiary mx-auto mb-3" />
              <p className="text-foreground-secondary">No servers installed</p>
              <p className="text-sm text-foreground-tertiary">
                Browse the marketplace to add integrations
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
