import { useState } from "react";
import { DailyBriefPanel } from "@/components/Proactive/DailyBriefPanel";
import { InsightFeed } from "@/components/Proactive/InsightFeed";
import { ProactiveSettings } from "@/components/Proactive/ProactiveSettings";
import { Insight } from "@/components/Proactive/InsightCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const mockBriefData = {
  greeting: "Good morning",
  userName: "John",
  date: new Date(),
  peakHours: "9-11am",
  tasksToday: [
    { id: "1", title: "Review API documentation", priority: "high" as const, dueTime: "10:00 AM", completed: false },
    { id: "2", title: "Team standup meeting", priority: "medium" as const, dueTime: "11:00 AM", completed: true },
    { id: "3", title: "Fix authentication bug", priority: "high" as const, dueTime: "2:00 PM", completed: false },
    { id: "4", title: "Update project roadmap", priority: "low" as const, completed: false },
  ],
  councilSuggestion: "Start with the API documentation review - you're most focused in the morning",
  focusRecommendation: "Block 2 hours for deep work on the auth bug",
  upcomingDeadlines: [
    { title: "Q4 Planning Document", date: "Dec 28" },
    { title: "Client Demo Prep", date: "Dec 30" },
  ],
  streak: 5,
};

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "deadline",
    title: "Task overdue: Review PR #423",
    description: "This task was due 2 days ago. Consider rescheduling or marking as complete.",
    priority: "high",
    actions: [
      { label: "Reschedule", action: "reschedule" },
      { label: "Complete", action: "complete" },
    ],
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    type: "suggestion",
    title: "Productivity insight",
    description: "You've completed 40% more tasks on Thursdays. Consider scheduling important work then.",
    priority: "low",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    type: "opportunity",
    title: "Code Agent suggests refactor",
    description: "The auth module has grown complex. A refactor could improve maintainability.",
    priority: "medium",
    actions: [
      { label: "Create Task", action: "create_task" },
      { label: "Discuss", action: "discuss" },
    ],
    timestamp: new Date(Date.now() - 10800000),
  },
];

export default function Brief() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(mockInsights);

  const handleDismissInsight = (id: string) => {
    setInsights(insights.map(i => i.id === id ? { ...i, dismissed: true } : i));
  };

  const handleInsightAction = (id: string, action: string) => {
    console.log("Action:", action, "on insight:", id);
    // Handle actions
  };

  const handleStartTask = (taskId: string) => {
    navigate("/focus");
  };

  const handleOpenChat = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-mesh">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="brief" className="space-y-6">
          <TabsList>
            <TabsTrigger value="brief">Daily Brief</TabsTrigger>
            <TabsTrigger value="insights">All Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-6">
            <DailyBriefPanel
              data={mockBriefData}
              onStartTask={handleStartTask}
              onOpenChat={handleOpenChat}
            />

            <InsightFeed
              insights={insights}
              onDismiss={handleDismissInsight}
              onAction={handleInsightAction}
              maxVisible={3}
            />
          </TabsContent>

          <TabsContent value="insights">
            <InsightFeed
              insights={insights}
              onDismiss={handleDismissInsight}
              onAction={handleInsightAction}
              maxVisible={100}
              collapsible={false}
            />
          </TabsContent>

          <TabsContent value="settings">
            <ProactiveSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
