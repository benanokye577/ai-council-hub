import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Crown,
  Shield,
  User,
  Eye,
  Settings,
  Book,
  Share2,
  Search,
  X,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTeamWorkspace, TeamMember, KnowledgeBase } from '@/hooks/useTeamWorkspace';
import { cn } from '@/lib/utils';

interface TeamSettingsProps {
  className?: string;
  onClose?: () => void;
}

export function TeamSettings({ className, onClose }: TeamSettingsProps) {
  const {
    workspace,
    currentUserId,
    addMember,
    updateMember,
    removeMember,
    addKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
    searchKnowledgeBase,
    updateSettings,
    updateWorkspace,
    getCurrentUser,
  } = useTeamWorkspace();

  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member' as const });
  const [newKnowledge, setNewKnowledge] = useState({ title: '', content: '', category: '', tags: '' });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const roleIcons = {
    owner: <Crown className="w-3 h-3" />,
    admin: <Shield className="w-3 h-3" />,
    member: <User className="w-3 h-3" />,
    viewer: <Eye className="w-3 h-3" />,
  };

  const roleColors = {
    owner: 'bg-warning/20 text-warning',
    admin: 'bg-primary/20 text-primary',
    member: 'bg-info/20 text-info',
    viewer: 'bg-foreground/20 text-foreground-secondary',
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-foreground-tertiary',
    away: 'bg-warning',
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    addMember({
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'offline',
    });
    setNewMember({ name: '', email: '', role: 'member' });
    setShowAddMember(false);
  };

  const handleAddKnowledge = () => {
    if (!newKnowledge.title.trim() || !newKnowledge.content.trim()) return;
    addKnowledgeEntry({
      title: newKnowledge.title,
      content: newKnowledge.content,
      category: newKnowledge.category || 'General',
      tags: newKnowledge.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdBy: currentUserId,
      accessLevel: 'team',
    });
    setNewKnowledge({ title: '', content: '', category: '', tags: '' });
    setShowAddKnowledge(false);
  };

  const filteredKnowledge = searchQuery
    ? searchKnowledgeBase(searchQuery)
    : workspace.knowledgeBase;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{workspace.name}</h2>
            <p className="text-sm text-foreground-secondary">
              {workspace.members.length} members
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="members" className="gap-1">
            <Users className="w-4 h-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-1">
            <Book className="w-4 h-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {isAdmin && (
            <Button
              size="sm"
              className="w-full btn-gradient"
              onClick={() => setShowAddMember(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Member
            </Button>
          )}

          <AnimatePresence>
            {showAddMember && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={newMember.email}
                          onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(v) => setNewMember(prev => ({ ...prev, role: v as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setShowAddMember(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>
                        Add Member
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {workspace.members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === currentUserId}
                isAdmin={isAdmin}
                roleIcons={roleIcons}
                roleColors={roleColors}
                statusColors={statusColors}
                onRemove={() => removeMember(member.id)}
                onUpdateRole={(role) => updateMember(member.id, { role })}
              />
            ))}
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
              <Input
                placeholder="Search knowledge base..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowAddKnowledge(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <AnimatePresence>
            {showAddKnowledge && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Entry title"
                          value={newKnowledge.title}
                          onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          placeholder="General"
                          value={newKnowledge.category}
                          onChange={(e) => setNewKnowledge(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        placeholder="Write your knowledge entry..."
                        rows={4}
                        value={newKnowledge.content}
                        onChange={(e) => setNewKnowledge(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        placeholder="tag1, tag2, tag3"
                        value={newKnowledge.tags}
                        onChange={(e) => setNewKnowledge(prev => ({ ...prev, tags: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setShowAddKnowledge(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddKnowledge}>
                        Add Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {filteredKnowledge.map((entry) => (
              <KnowledgeCard
                key={entry.id}
                entry={entry}
                onDelete={() => deleteKnowledgeEntry(entry.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Workspace Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Workspace Name</Label>
                <Input
                  value={workspace.name}
                  onChange={(e) => updateWorkspace({ name: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={workspace.description}
                  onChange={(e) => updateWorkspace({ description: e.target.value })}
                  disabled={!isAdmin}
                  rows={2}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Allow Member Invites</p>
                    <p className="text-xs text-foreground-secondary">
                      Members can invite others
                    </p>
                  </div>
                  <Switch
                    checked={workspace.settings.allowMemberInvites}
                    onCheckedChange={(v) => updateSettings({ allowMemberInvites: v })}
                    disabled={!isAdmin}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Real-time Sync</p>
                    <p className="text-xs text-foreground-secondary">
                      Sync changes in real-time
                    </p>
                  </div>
                  <Switch
                    checked={workspace.settings.enableRealTimeSync}
                    onCheckedChange={(v) => updateSettings({ enableRealTimeSync: v })}
                    disabled={!isAdmin}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Session Visibility</Label>
                  <Select
                    value={workspace.settings.defaultSessionVisibility}
                    onValueChange={(v) => updateSettings({ defaultSessionVisibility: v as any })}
                    disabled={!isAdmin}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MemberCard({
  member,
  isCurrentUser,
  isAdmin,
  roleIcons,
  roleColors,
  statusColors,
  onRemove,
  onUpdateRole,
}: {
  member: TeamMember;
  isCurrentUser: boolean;
  isAdmin: boolean;
  roleIcons: Record<string, React.ReactNode>;
  roleColors: Record<string, string>;
  statusColors: Record<string, string>;
  onRemove: () => void;
  onUpdateRole: (role: TeamMember['role']) => void;
}) {
  return (
    <Card className="glass-card">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background',
                statusColors[member.status]
              )} />
            </div>
            <div>
              <p className="font-medium flex items-center gap-2">
                {member.name}
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </p>
              <p className="text-sm text-foreground-secondary">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn('gap-1', roleColors[member.role])}>
              {roleIcons[member.role]}
              {member.role}
            </Badge>
            {isAdmin && !isCurrentUser && member.role !== 'owner' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-error hover:text-error"
                onClick={onRemove}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KnowledgeCard({
  entry,
  onDelete,
}: {
  entry: KnowledgeBase;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="glass-card">
      <CardContent className="p-3">
        <div
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{entry.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {entry.category}
                </Badge>
                {entry.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error hover:text-error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border/50"
            >
              <p className="text-sm text-foreground-secondary whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
