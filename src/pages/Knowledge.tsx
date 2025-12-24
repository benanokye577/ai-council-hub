import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  FolderOpen,
  FileText,
  File,
  Image,
  Upload,
  MoreVertical,
  Clock,
  HardDrive,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const collections = [
  { id: "1", name: "Project Documentation", count: 8, icon: FolderOpen },
  { id: "2", name: "API References", count: 12, icon: FolderOpen },
  { id: "3", name: "Meeting Notes", count: 24, icon: FolderOpen },
  { id: "4", name: "Research Papers", count: 6, icon: FolderOpen },
];

const files = [
  {
    id: "1",
    name: "Project Architecture.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
    collection: "Project Documentation",
  },
  {
    id: "2",
    name: "API Endpoints.md",
    type: "markdown",
    size: "156 KB",
    modified: "1 day ago",
    collection: "API References",
  },
  {
    id: "3",
    name: "Team Meeting 12-20.txt",
    type: "text",
    size: "12 KB",
    modified: "3 days ago",
    collection: "Meeting Notes",
  },
  {
    id: "4",
    name: "User Research Findings.pdf",
    type: "pdf",
    size: "4.8 MB",
    modified: "1 week ago",
    collection: "Research Papers",
  },
  {
    id: "5",
    name: "Database Schema.md",
    type: "markdown",
    size: "89 KB",
    modified: "2 weeks ago",
    collection: "Project Documentation",
  },
  {
    id: "6",
    name: "Authentication Flow.png",
    type: "image",
    size: "1.2 MB",
    modified: "3 weeks ago",
    collection: "Project Documentation",
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-5 h-5 text-error" />;
    case "markdown":
      return <File className="w-5 h-5 text-info" />;
    case "image":
      return <Image className="w-5 h-5 text-success" />;
    default:
      return <File className="w-5 h-5 text-foreground-secondary" />;
  }
};

export default function Knowledge() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCollection || file.collection === selectedCollection)
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar - Collections */}
      <div className="w-72 border-r border-border bg-background-secondary/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <Button variant="gradient" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Upload Source
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            <p className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider mb-2 px-2">
              Collections
            </p>
            <div className="space-y-1">
              <motion.button
                onClick={() => setSelectedCollection(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                  !selectedCollection
                    ? "nav-active text-foreground"
                    : "text-foreground-secondary hover:text-foreground hover:bg-background-hover"
                )}
                whileHover={{ x: 2 }}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm font-medium flex-1">All Sources</span>
                <Badge variant="secondary" className="text-[10px]">
                  {files.length}
                </Badge>
              </motion.button>
              {collections.map((collection) => (
                <motion.button
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                    selectedCollection === collection.name
                      ? "nav-active text-foreground"
                      : "text-foreground-secondary hover:text-foreground hover:bg-background-hover"
                  )}
                  whileHover={{ x: 2 }}
                >
                  <collection.icon className="w-4 h-4" />
                  <span className="text-sm font-medium flex-1">
                    {collection.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {collection.count}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Storage Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-foreground-tertiary" />
            <span className="text-sm text-foreground-secondary">Storage</span>
          </div>
          <div className="h-1.5 rounded-full bg-background-hover overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "35%" }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-foreground-tertiary">
            12.4 MB of 100 MB used
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-background-secondary/30">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground-secondary">Knowledge Base</span>
            <ChevronRight className="w-4 h-4 text-foreground-tertiary" />
            <span className="text-foreground font-medium">
              {selectedCollection || "All Sources"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
            <Input
              variant="glass"
              placeholder="Search sources..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Files */}
        <ScrollArea className="flex-1 p-4">
          {viewMode === "list" ? (
            <div className="space-y-2">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="gradient-border-card p-4 hover-lift cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {file.collection}
                        </Badge>
                        <span className="text-xs text-foreground-tertiary">
                          {file.size}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-foreground-tertiary">
                        <Clock className="w-3 h-3" />
                        {file.modified}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    variant="gradient-border"
                    className="p-4 hover-lift cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-background-hover flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        {getFileIcon(file.type)}
                      </div>
                      <h4 className="text-sm font-medium text-foreground truncate w-full">
                        {file.name}
                      </h4>
                      <p className="text-xs text-foreground-tertiary mt-1">
                        {file.size}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-12 h-12 text-foreground-tertiary mb-4 opacity-50" />
              <p className="text-foreground-secondary mb-2">No sources found</p>
              <p className="text-sm text-foreground-tertiary">
                Try adjusting your search or add new sources
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
