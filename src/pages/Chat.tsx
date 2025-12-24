import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Search,
  Plus,
  Send,
  Mic,
  Paperclip,
  Copy,
  Check,
  MoreVertical,
  Sparkles,
  User,
  Bot,
  Clock,
  Scale,
  CheckCircle2,
  MinusCircle,
  PenLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { QuickActions, detectResponseType } from "@/components/chat/QuickActions";
import { AgentContributionBadges } from "@/components/chat/AgentContributionBadges";

interface AgentContribution {
  name: string;
  vote: "approve" | "abstain" | "modify";
  weight: number;
  expertise: string;
  color: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  councilDeliberation?: {
    consensus: number;
    contributions: AgentContribution[];
    decision: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  agent: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1",
    title: "React Component Refactoring",
    agent: "Code Agent",
    lastMessage: "I've analyzed the component structure...",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "AI Market Research",
    agent: "Research Agent",
    lastMessage: "Here are the key findings...",
    timestamp: "1h ago",
  },
  {
    id: "3",
    title: "Blog Post Draft",
    agent: "Writing Agent",
    lastMessage: "I've completed the outline...",
    timestamp: "3h ago",
  },
  {
    id: "4",
    title: "Sales Data Analysis",
    agent: "Analysis Agent",
    lastMessage: "The Q4 trends show...",
    timestamp: "Yesterday",
  },
];

const councilAgents: AgentContribution[] = [
  { name: "Aria", vote: "approve", weight: 35, expertise: "Strategy", color: "hsl(var(--primary))" },
  { name: "Marcus", vote: "approve", weight: 25, expertise: "Research", color: "hsl(280, 70%, 60%)" },
  { name: "Echo", vote: "modify", weight: 20, expertise: "Code", color: "hsl(200, 70%, 60%)" },
  { name: "Nova", vote: "approve", weight: 20, expertise: "Creative", color: "hsl(340, 70%, 60%)" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! The Council is ready to assist you. We've assembled our specialists to provide comprehensive guidance. How can we help you today?",
    timestamp: new Date(Date.now() - 60000),
    councilDeliberation: {
      consensus: 100,
      decision: "Unanimous greeting",
      contributions: councilAgents.map(a => ({ ...a, vote: "approve" as const })),
    },
  },
  {
    id: "2",
    role: "user",
    content:
      "Can you help me refactor this React component to use hooks instead of class components?",
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: "3",
    role: "assistant",
    content: `Absolutely! I'd be happy to help you convert a class component to functional hooks. Here's an example of how to do that:

\`\`\`tsx
// Before: Class Component
class Counter extends React.Component {
  state = { count: 0 };
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
  
  render() {
    return (
      <button onClick={this.increment}>
        Count: {this.state.count}
      </button>
    );
  }
}

// After: Functional Component with Hooks
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
};
\`\`\`

**Key changes:**
1. Replace \`this.state\` with \`useState\` hook
2. Replace \`this.setState\` with the setter function
3. Use \`useCallback\` for event handlers to prevent unnecessary re-renders
4. Remove the \`render()\` method - the function body is the render

Would you like me to help you convert a specific component?`,
    timestamp: new Date(Date.now() - 40000),
    councilDeliberation: {
      consensus: 85,
      decision: "Approved with modifications",
      contributions: [
        { name: "Aria", vote: "approve", weight: 35, expertise: "Strategy", color: "hsl(var(--primary))" },
        { name: "Marcus", vote: "approve", weight: 25, expertise: "Research", color: "hsl(280, 70%, 60%)" },
        { name: "Echo", vote: "modify", weight: 20, expertise: "Code", color: "hsl(200, 70%, 60%)" },
        { name: "Nova", vote: "approve", weight: 20, expertise: "Creative", color: "hsl(340, 70%, 60%)" },
      ],
    },
  },
];

function CodeBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "text";

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-background-secondary border-b border-border">
        <span className="text-xs font-mono text-foreground-tertiary">
          {language}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="w-3 h-3 text-success" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "hsl(var(--background))",
          fontSize: "13px",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function CouncilDeliberation({ deliberation }: { deliberation: Message["councilDeliberation"] }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!deliberation) return null;

  const getVoteIcon = (vote: AgentContribution["vote"]) => {
    switch (vote) {
      case "approve": return <CheckCircle2 className="w-3 h-3 text-success" />;
      case "abstain": return <MinusCircle className="w-3 h-3 text-foreground-tertiary" />;
      case "modify": return <PenLine className="w-3 h-3 text-warning" />;
    }
  };

  const getVoteLabel = (vote: AgentContribution["vote"]) => {
    switch (vote) {
      case "approve": return "Approved";
      case "abstain": return "Abstained";
      case "modify": return "Modified";
    }
  };

  return (
    <motion.div 
      className="mt-3 pt-3 border-t border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs text-foreground-secondary hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">Council Deliberation</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {deliberation.consensus}% consensus
          </Badge>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              <div className="text-[10px] text-foreground-tertiary mb-2">
                Decision: <span className="text-foreground-secondary">{deliberation.decision}</span>
              </div>
              
              {deliberation.contributions.map((agent, idx) => (
                <motion.div
                  key={agent.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">{agent.name}</span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {agent.expertise}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {getVoteIcon(agent.vote)}
                      <span className="text-[10px] text-foreground-tertiary">{getVoteLabel(agent.vote)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-foreground">{agent.weight}%</div>
                    <div className="text-[9px] text-foreground-tertiary">weight</div>
                  </div>
                </motion.div>
              ))}

              {/* Vote weight visualization */}
              <div className="flex h-2 rounded-full overflow-hidden mt-2">
                {deliberation.contributions.map((agent) => (
                  <motion.div
                    key={agent.name}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.weight}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full"
                    style={{ backgroundColor: agent.color }}
                    title={`${agent.name}: ${agent.weight}%`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChatMessage({ message, onQuickAction }: { message: Message; onQuickAction?: (prompt: string) => void }) {
  const isUser = message.role === "user";
  const responseType = !isUser ? detectResponseType(message.content) : "general";

  // Convert council contributions to agent contribution format
  const agentContributions = message.councilDeliberation?.contributions.map(c => ({
    name: c.name,
    expertise: c.expertise,
    contribution: c.weight,
    color: c.color,
  })) || [];

  const handleQuickAction = (action: { prompt: string }) => {
    if (action.prompt && onQuickAction) {
      onQuickAction(action.prompt);
    }
  };

  return (
    <motion.div
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
          isUser ? "bg-gradient-primary shadow-glow" : "glass-card"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Scale className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3",
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        )}
      >
        {/* Agent Attribution Badges - Show by default for assistant messages */}
        {!isUser && agentContributions.length > 0 && (
          <AgentContributionBadges contributions={agentContributions} compact />
        )}

        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                
                if (isInline) {
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-background-hover text-primary font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                
                return (
                  <CodeBlock className={className}>
                    {String(children).replace(/\n$/, "")}
                  </CodeBlock>
                );
              },
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 text-sm leading-relaxed text-foreground">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-sm text-foreground-secondary">{children}</li>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Quick Actions - contextual based on response type */}
        {!isUser && (
          <QuickActions 
            responseType={responseType} 
            onAction={handleQuickAction}
            content={message.content}
          />
        )}
        
        {/* Council Deliberation Section */}
        {!isUser && message.councilDeliberation && (
          <CouncilDeliberation deliberation={message.councilDeliberation} />
        )}
        
        <div className="flex items-center gap-2 mt-2 text-[10px] text-foreground-tertiary">
          <Clock className="w-3 h-3" />
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="chat-bubble-ai rounded-xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-foreground-tertiary typing-dot" />
          <span className="w-2 h-2 rounded-full bg-foreground-tertiary typing-dot" />
          <span className="w-2 h-2 rounded-full bg-foreground-tertiary typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response with council deliberation
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I understand you want to learn more about this topic. Let me provide some insights...\n\nThis is a simulated response. In a real implementation, this would be connected to an AI backend using Lovable Cloud.",
        timestamp: new Date(),
        councilDeliberation: {
          consensus: Math.floor(Math.random() * 30) + 70,
          decision: "Collaborative response approved",
          contributions: councilAgents.map(a => ({
            ...a,
            vote: Math.random() > 0.2 ? "approve" as const : "modify" as const,
          })),
        },
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversation Sidebar */}
      <div className="w-80 border-r border-border bg-background-secondary/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Button variant="gradient" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
            <Input
              variant="glass"
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all",
                  selectedConversation.id === conv.id
                    ? "nav-active"
                    : "hover:bg-background-hover"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {conv.title}
                      </h4>
                      {conv.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-foreground-secondary truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <span className="text-[10px] text-foreground-tertiary shrink-0">
                    {conv.timestamp}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 text-[10px]"
                >
                  {conv.agent}
                </Badge>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-background-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {selectedConversation.title}
              </h2>
              <p className="text-xs text-foreground-secondary">
                {selectedConversation.agent}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onQuickAction={(prompt) => {
                  setInput(prompt);
                }}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background-secondary/30">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full h-24 px-4 py-3 pr-24 rounded-xl bg-background border border-border resize-none text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary/50 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-foreground-tertiary hover:text-foreground"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-foreground-tertiary hover:text-foreground"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  variant="gradient"
                  size="icon-sm"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="ml-1"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-foreground-tertiary text-center mt-2">
              Press <kbd className="px-1 py-0.5 rounded bg-background-hover text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-background-hover text-[10px] font-mono">Shift + Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
