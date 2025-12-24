import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, FileText, Brain, Target, Calendar, 
  ChevronRight, Play, CheckCircle, Clock, Star,
  FolderOpen, FileIcon, Video, Presentation,
  Plus, Music, Link2, CalendarDays, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mock data
const courses = [
  { id: '1', name: 'Advanced Mathematics', code: 'MATH301', progress: 75, instructor: 'Dr. Smith', color: 'hsl(var(--primary))' },
  { id: '2', name: 'Computer Science Fundamentals', code: 'CS101', progress: 45, instructor: 'Prof. Johnson', color: 'hsl(187, 80%, 50%)' },
  { id: '3', name: 'Physics II', code: 'PHYS202', progress: 90, instructor: 'Dr. Williams', color: 'hsl(330, 81%, 60%)' },
  { id: '4', name: 'Introduction to Psychology', code: 'PSY101', progress: 30, instructor: 'Prof. Davis', color: 'hsl(45, 90%, 55%)' },
];

const materials = [
  { id: '1', name: 'Lecture 12 - Derivatives.pdf', type: 'pdf', course: 'MATH301', date: '2024-01-15' },
  { id: '2', name: 'Week 5 Slides.pptx', type: 'slides', course: 'CS101', date: '2024-01-14' },
  { id: '3', name: 'Lab Notes - Momentum.pdf', type: 'pdf', course: 'PHYS202', date: '2024-01-13' },
  { id: '4', name: 'Video: Memory & Learning', type: 'video', course: 'PSY101', date: '2024-01-12' },
  { id: '5', name: 'Problem Set 7.pdf', type: 'pdf', course: 'MATH301', date: '2024-01-11' },
];

const quizQuestions = [
  { id: '1', question: 'What is the derivative of x²?', answer: '2x', course: 'MATH301' },
  { id: '2', question: 'What is Big O notation used for?', answer: 'Describing algorithm complexity', course: 'CS101' },
  { id: '3', question: 'What is Newton\'s second law?', answer: 'F = ma', course: 'PHYS202' },
  { id: '4', question: 'What is classical conditioning?', answer: 'Learning through association', course: 'PSY101' },
];

const deadlines = [
  { id: '1', title: 'Math Assignment 5', course: 'MATH301', dueDate: '2024-01-20', type: 'assignment' },
  { id: '2', title: 'CS Project Milestone', course: 'CS101', dueDate: '2024-01-22', type: 'project' },
  { id: '3', title: 'Physics Lab Report', course: 'PHYS202', dueDate: '2024-01-25', type: 'report' },
  { id: '4', title: 'Psychology Quiz', course: 'PSY101', dueDate: '2024-01-18', type: 'quiz' },
];

const integrations = [
  { id: 'spotify', name: 'Spotify', icon: Music, status: 'connected', info: 'Lo-fi Study Mix playing' },
  { id: 'moodle', name: 'Moodle', icon: BookOpen, status: 'connected', info: '4 courses synced' },
  { id: 'calendar', name: 'Calendar', icon: CalendarDays, status: 'connected', info: '3 upcoming events' },
];

export default function Study() {
  const [activeTab, setActiveTab] = useState('courses');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'slides': return Presentation;
      case 'video': return Video;
      default: return FileIcon;
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleQuizAnswer = (correct: boolean) => {
    setQuizScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    setShowAnswer(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizMode(false);
      setCurrentQuizIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Dashboard</h1>
            <p className="text-muted-foreground">Track your courses, materials, and progress</p>
          </div>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync with Moodle
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="courses" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Courses</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Materials</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">Quiz</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Progress</span>
                </TabsTrigger>
                <TabsTrigger value="deadlines" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Deadlines</span>
                </TabsTrigger>
              </TabsList>

              {/* Course List */}
              <TabsContent value="courses" className="mt-6">
                <div className="grid gap-4">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${course.color}20` }}
                            >
                              <BookOpen className="w-6 h-6" style={{ color: course.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {course.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {course.code} • {course.instructor}
                                  </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={course.progress} className="flex-1 h-2" />
                                <span className="text-xs text-muted-foreground">{course.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Materials Browser */}
              <TabsContent value="materials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Materials</CardTitle>
                    <CardDescription>PDFs, slides, and notes from your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {materials.map((material, index) => {
                          const Icon = getFileIcon(material.type);
                          return (
                            <motion.div
                              key={material.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate group-hover:text-primary transition-colors">
                                  {material.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {material.course} • {material.date}
                                </p>
                              </div>
                              <Badge variant="outline" className="shrink-0">
                                {material.type.toUpperCase()}
                              </Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Mode */}
              <TabsContent value="quiz" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flashcard Quiz</CardTitle>
                    <CardDescription>Test your knowledge with flashcard-style questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!quizMode ? (
                      <div className="text-center py-8">
                        <Brain className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Ready to test your knowledge?</h3>
                        <p className="text-muted-foreground mb-4">
                          {quizQuestions.length} questions from your courses
                        </p>
                        {quizScore.total > 0 && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Last score: {quizScore.correct}/{quizScore.total} correct
                          </p>
                        )}
                        <Button onClick={() => { setQuizMode(true); setQuizScore({ correct: 0, total: 0 }); }} className="gap-2">
                          <Play className="w-4 h-4" />
                          Start Quiz
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline">{quizQuestions[currentQuizIndex].course}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Question {currentQuizIndex + 1} of {quizQuestions.length}
                          </span>
                        </div>
                        <Progress value={((currentQuizIndex + 1) / quizQuestions.length) * 100} className="mb-6" />
                        
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentQuizIndex}
                            initial={{ opacity: 0, rotateY: -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: 90 }}
                            className="min-h-[200px] flex flex-col items-center justify-center text-center p-6 rounded-xl bg-secondary/30 border border-border"
                          >
                            {!showAnswer ? (
                              <>
                                <p className="text-xl font-medium mb-6">
                                  {quizQuestions[currentQuizIndex].question}
                                </p>
                                <Button onClick={() => setShowAnswer(true)}>
                                  Show Answer
                                </Button>
                              </>
                            ) : (
                              <>
                                <p className="text-lg text-primary font-semibold mb-6">
                                  {quizQuestions[currentQuizIndex].answer}
                                </p>
                                <div className="flex gap-3">
                                  <Button variant="outline" onClick={() => handleQuizAnswer(false)} className="gap-2">
                                    Got it wrong
                                  </Button>
                                  <Button onClick={() => handleQuizAnswer(true)} className="gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Got it right
                                  </Button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tracker */}
              <TabsContent value="progress" className="mt-6">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revision Progress</CardTitle>
                      <CardDescription>Track your study progress across all courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {courses.map((course) => (
                          <div key={course.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: course.color }}
                                />
                                <span className="font-medium">{course.name}</span>
                              </div>
                              <span className="text-sm font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-3" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-primary">24</div>
                        <p className="text-xs text-muted-foreground">Hours Studied</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-primary">87</div>
                        <p className="text-xs text-muted-foreground">Flashcards Done</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-primary">12</div>
                        <p className="text-xs text-muted-foreground">Materials Read</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-primary">7</div>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Upcoming Deadlines */}
              <TabsContent value="deadlines" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                    <CardDescription>Assignment due dates and important events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deadlines.sort((a, b) => getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate)).map((deadline, index) => {
                        const daysUntil = getDaysUntil(deadline.dueDate);
                        const isUrgent = daysUntil <= 3;
                        return (
                          <motion.div
                            key={deadline.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                              isUrgent ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              isUrgent ? "bg-destructive/20" : "bg-primary/10"
                            )}>
                              <Clock className={cn("w-6 h-6", isUrgent ? "text-destructive" : "text-primary")} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{deadline.title}</h4>
                              <p className="text-sm text-muted-foreground">{deadline.course}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={isUrgent ? "destructive" : "secondary"}>
                                {daysUntil <= 0 ? 'Overdue' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{deadline.dueDate}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Integrations Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Integrations</CardTitle>
                <CardDescription>Connected services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integration.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{integration.info}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2 mt-2">
                  <Plus className="w-4 h-4" />
                  Add Integration
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Priority: Math Assignment</p>
                    <p className="text-xs text-muted-foreground">Due in 2 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Study Goal: 2 hours</p>
                    <Progress value={65} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Review 20 flashcards</p>
                    <p className="text-xs text-muted-foreground">14 completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
