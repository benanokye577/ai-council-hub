import { useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Wrench,
  Settings,
  ChevronLeft,
  Search,
  Code,
  PenTool,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const councilAgents = [
  { name: "Research", icon: Search, status: "active" as const, lastActive: "2m ago" },
  { name: "Code", icon: Code, status: "standby" as const, lastActive: "5m ago" },
  { name: "Writing", icon: PenTool, status: "standby" as const, lastActive: "1h ago" },
];

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Users, label: "Agents", path: "/agents", badge: "5" },
  { icon: BookOpen, label: "Knowledge Base", path: "/knowledge" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function NavItem({
  icon: Icon,
  label,
  path,
  badge,
  collapsed,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  badge?: string;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === path;

  const content = (
    <Link to={path} className="block">
      <motion.div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "nav-active text-foreground"
            : "text-foreground-secondary hover:text-foreground hover:bg-background-hover"
        )}
        whileHover={{ x: collapsed ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon
          className={cn(
            "w-5 h-5 shrink-0 transition-colors",
            isActive ? "text-primary" : "group-hover:text-primary"
          )}
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {badge && !collapsed && (
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] h-5 px-1.5"
          >
            {badge}
          </Badge>
        )}
      </motion.div>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {badge && (
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SolarisLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="relative">
        <img 
          src="/src/assets/logo.png" 
          alt="Solaris Logo" 
          className="w-9 h-9 object-contain"
        />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-success animate-pulse-glow" />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col"
          >
            <span className="text-lg font-bold gradient-text">Solaris</span>
            <span className="text-[10px] text-foreground-tertiary -mt-0.5">
              AI Assistant
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg glass-card mx-2 cursor-pointer hover:bg-background-hover/50 transition-all",
        collapsed && "justify-center mx-0"
      )}
    >
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-foreground">
            JD
          </span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-sidebar" />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">
                John Doe
              </span>
              <Badge variant="gradient" className="text-[10px] px-1.5 py-0">
                PRO
              </Badge>
            </div>
            <span className="text-xs text-foreground-tertiary">Online</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CouncilStatus({ collapsed }: { collapsed: boolean }) {
  const content = (
    <div className={cn(
      "rounded-lg glass-card p-2",
      collapsed && "p-1"
    )}>
      {!collapsed && (
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground-secondary">Council Status</span>
          </div>
          <Link to="/agents" className="text-[10px] text-primary hover:text-primary-light">
            View All →
          </Link>
        </div>
      )}
      <div className={cn("space-y-1", collapsed && "space-y-1.5")}>
        {councilAgents.map((agent) => (
          <div
            key={agent.name}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background-hover/50 transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <div className="relative">
              <agent.icon className={cn(
                "w-4 h-4",
                agent.status === "active" ? "text-primary" : "text-foreground-tertiary"
              )} />
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-sidebar",
                agent.status === "active" ? "bg-success" : "bg-foreground-tertiary"
              )} />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{agent.name}</span>
                  <span className="text-[10px] text-foreground-tertiary">{agent.lastActive}</span>
                </div>
                <span className={cn(
                  "text-[10px]",
                  agent.status === "active" ? "text-success" : "text-foreground-tertiary"
                )}>
                  {agent.status === "active" ? "● Active now" : "○ Standby"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <div className="space-y-1">
            <p className="text-xs font-medium">Council Status</p>
            {councilAgents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  agent.status === "active" ? "bg-success" : "bg-foreground-tertiary"
                )} />
                <span>{agent.name}</span>
                <span className="text-foreground-tertiary">- {agent.status}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0"
      >
        {/* Logo */}
        <div className="p-3 border-b border-sidebar-border">
          <SolarisLogo collapsed={collapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Council Status */}
        <div className="p-2 border-t border-sidebar-border">
          <CouncilStatus collapsed={collapsed} />
        </div>

        {/* User Profile */}
        <div className="p-2 border-t border-sidebar-border">
          <UserProfile collapsed={collapsed} />
        </div>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center text-foreground-secondary",
              !collapsed && "justify-between px-3"
            )}
          >
            {!collapsed && (
              <span className="text-sm">Collapse</span>
            )}
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}
