import { useState } from "react";
import { motion } from "framer-motion";
import { Timer, BarChart3, Settings, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FocusTimer } from "@/components/Focus/FocusTimer";
import { FocusOverlay } from "@/components/Focus/FocusOverlay";

const recentTasks = [
  { id: "1", title: "Review API documentation", duration: 25, completed: true },
  { id: "2", title: "Fix authentication bug", duration: 50, completed: true },
  { id: "3", title: "Write unit tests", duration: 25, completed: false },
];

const focusStats = {
  todaySessions: 4,
  todayMinutes: 100,
  weekSessions: 18,
  weekMinutes: 450,
  streak: 5,
  avgSessionLength: 25,
};

export default function Focus() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | undefined>();

  const startFocusSession = (taskTitle?: string) => {
    setCurrentTask(taskTitle);
    setOverlayOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-mesh">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Timer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Focus Mode</h1>
              <p className="text-sm text-foreground-secondary">
                Deep work sessions with the council
              </p>
            </div>
          </div>
          <Badge variant="gradient" className="gap-1">
            🔥 {focusStats.streak} day streak
          </Badge>
        </div>

        <Tabs defaultValue="timer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <Card className="glass-card">
              <CardContent className="py-12">
                <FocusTimer
                  initialMinutes={25}
                  breakMinutes={5}
                  taskTitle={currentTask}
                  onComplete={() => console.log("Session complete!")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-primary" />
                  Quick Focus Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ x: 2 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/50 border border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                    onClick={() => startFocusSession(task.title)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-success' : 'bg-warning'}`} />
                      <span className="text-sm text-foreground">{task.title}</span>
                    </div>
                    <Button size="sm" className="h-7 text-xs">
                      Focus
                    </Button>
                  </motion.div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => startFocusSession()}
                >
                  Start Free Focus
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{focusStats.todaySessions}</p>
                  <p className="text-xs text-foreground-tertiary mt-1">Sessions Today</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{focusStats.todayMinutes}</p>
                  <p className="text-xs text-foreground-tertiary mt-1">Minutes Today</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{focusStats.weekSessions}</p>
                  <p className="text-xs text-foreground-tertiary mt-1">This Week</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{focusStats.streak}</p>
                  <p className="text-xs text-foreground-tertiary mt-1">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2 h-32">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const heights = [60, 80, 45, 100, 75, 30, 20];
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          className="w-full bg-primary/80 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${heights[i]}%` }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                        />
                        <span className="text-[10px] text-foreground-tertiary">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Focus Overlay */}
      <FocusOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        taskTitle={currentTask}
        onComplete={() => console.log("Completed!")}
      />
    </div>
  );
}
