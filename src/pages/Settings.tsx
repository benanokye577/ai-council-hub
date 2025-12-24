import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Key,
  Shield,
  Keyboard,
  Info,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Globe,
  Bell,
  Zap,
  Database,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "general", label: "General", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "models", label: "Models & API Keys", icon: Key },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
  { id: "about", label: "About", icon: Info },
];

const shortcuts = [
  { action: "Open Command Palette", keys: ["⌘", "K"] },
  { action: "New Conversation", keys: ["⌘", "N"] },
  { action: "Toggle Sidebar", keys: ["⌘", "/"] },
  { action: "Send Message", keys: ["⌘", "↵"] },
  { action: "Close Modal", keys: ["Esc"] },
  { action: "Search", keys: ["⌘", "F"] },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-border bg-background-secondary/30 p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4 px-2">
          Settings
        </h2>
        <nav className="space-y-1">
          {settingsTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                activeTab === tab.id
                  ? "nav-active text-foreground"
                  : "text-foreground-secondary hover:text-foreground hover:bg-background-hover"
              )}
              whileHover={{ x: 2 }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">General</h2>
                <p className="text-foreground-secondary text-sm">
                  Manage your account and preferences
                </p>
              </div>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary-foreground">
                        JD
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Language</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Select your preferred language
                      </p>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Receive notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Play sounds for actions
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">Appearance</h2>
                <p className="text-foreground-secondary text-sm">
                  Customize the look and feel
                </p>
              </div>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 rounded-lg border-2 border-primary bg-background-hover flex flex-col items-center gap-2">
                      <Moon className="w-6 h-6 text-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Dark
                      </span>
                      <Check className="w-4 h-4 text-primary" />
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-background-card flex flex-col items-center gap-2 opacity-50">
                      <Sun className="w-6 h-6 text-foreground-secondary" />
                      <span className="text-sm font-medium text-foreground-secondary">
                        Light
                      </span>
                    </button>
                    <button className="p-4 rounded-lg border border-border bg-background-card flex flex-col items-center gap-2 opacity-50">
                      <Globe className="w-6 h-6 text-foreground-secondary" />
                      <span className="text-sm font-medium text-foreground-secondary">
                        System
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Accent Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {[
                      "bg-violet-500",
                      "bg-blue-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-rose-500",
                    ].map((color, index) => (
                      <button
                        key={color}
                        className={cn(
                          "w-10 h-10 rounded-full transition-transform hover:scale-110",
                          color,
                          index === 0 && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Models & API Keys */}
          {activeTab === "models" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">
                  Models & API Keys
                </h2>
                <p className="text-foreground-secondary text-sm">
                  Configure AI models and manage API keys
                </p>
              </div>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Default Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Primary Model</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Used for all conversations by default
                      </p>
                    </div>
                    <Select defaultValue="claude-3.5">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3.5">
                          Claude 3.5 Sonnet
                        </SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="claude-3-opus">
                          Claude 3 Opus
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Temperature</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Controls response randomness (0-1)
                      </p>
                    </div>
                    <Input
                      type="number"
                      defaultValue="0.7"
                      step="0.1"
                      min="0"
                      max="1"
                      className="w-24"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">API Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Anthropic API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="sk-ant-..."
                        className="flex-1"
                      />
                      <Button variant="outline">Save</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>OpenAI API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="sk-..."
                        className="flex-1"
                      />
                      <Button variant="outline">Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy & Data */}
          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">Privacy & Data</h2>
                <p className="text-foreground-secondary text-sm">
                  Manage your data and privacy settings
                </p>
              </div>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Keep conversation history</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Store conversations for future reference
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-delete after</Label>
                      <p className="text-xs text-foreground-tertiary">
                        Automatically remove old conversations
                      </p>
                    </div>
                    <Select defaultValue="never">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    Export All Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-error hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All Data
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Keyboard Shortcuts */}
          {activeTab === "shortcuts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">
                  Keyboard Shortcuts
                </h2>
                <p className="text-foreground-secondary text-sm">
                  View and customize keyboard shortcuts
                </p>
              </div>

              <Card variant="gradient-border">
                <CardHeader>
                  <CardTitle className="text-base">Shortcuts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.action}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm text-foreground-secondary">
                          {shortcut.action}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <kbd
                              key={i}
                              className="h-6 px-2 rounded bg-background-hover text-xs font-mono text-foreground flex items-center justify-center min-w-[24px]"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* About */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-h2 text-foreground mb-2">About</h2>
                <p className="text-foreground-secondary text-sm">
                  Application information and updates
                </p>
              </div>

              <Card variant="gradient-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                      <Zap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold gradient-text">
                        Solaris
                      </h3>
                      <p className="text-sm text-foreground-secondary">
                        AI Assistant Desktop Application
                      </p>
                      <Badge variant="gradient" className="mt-2">
                        v1.0.0
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-foreground-secondary">
                    <p>
                      Solaris is a premium AI assistant application featuring
                      multi-agent collaboration, knowledge base management, and
                      advanced analytics.
                    </p>
                    <p className="text-foreground-tertiary">
                      Built with React, TypeScript, and Tailwind CSS
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Check for Updates
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Licenses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
