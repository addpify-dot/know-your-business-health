import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bot, Send, X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSavedAssessments } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { RuleBasedChatEngine, ChatMessage } from "@/lib/chatEngine";

// Rule-based AI chat widget - no external APIs
const STORAGE_KEY = "bhc_ai_chat_thread_v2";

function useAssessmentContext() {
  // Prefer current in-memory assessment if Results page set it
  const current = (window as any).bhcCurrentAssessment;
  if (current) return current;
  try {
    const saved = getSavedAssessments();
    return saved?.[0]?.data;
  } catch {
    return undefined;
  }
}

function useLanguage() {
  const ctx = useAssessmentContext();
  return (ctx?.language as "en" | "hi") || (ctx?.lang as "en" | "hi") || "en";
}

function t(lang: "en" | "hi", en: string, hi: string) {
  return lang === "hi" ? hi : en;
}

export default function RuleBasedChatWidget() {
  const { user } = useAuth();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });

  const lang = useLanguage();
  const areaRef = useRef<HTMLDivElement>(null);
  const assessment = useAssessmentContext();

  // Initialize chat engine
  const [chatEngine] = useState(() => new RuleBasedChatEngine({
    language: lang,
    previousMessages: messages,
    assessmentData: assessment
  }));

  // Update chat engine context when assessment changes
  useEffect(() => {
    chatEngine.updateContext({
      language: lang,
      assessmentData: assessment
    });
  }, [lang, assessment, chatEngine]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    areaRef.current?.scrollTo({ top: areaRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Open from global event
  useEffect(() => {
    const handler = () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      if (!hasActiveSubscription && !subscriptionLoading) {
        navigate('/subscription');
        return;
      }
      setOpen(true);
    };
    window.addEventListener("bhc:open-ai-chat", handler);
    return () => window.removeEventListener("bhc:open-ai-chat", handler);
  }, [user, hasActiveSubscription, subscriptionLoading, navigate]);

  // Seed greeting on first open if empty
  useEffect(() => {
    if (open && messages.length === 0 && hasActiveSubscription) {
      const greeting: ChatMessage = {
        role: "assistant",
        content: t(
          lang,
          "Hi! I've reviewed your business assessment. I can help you with:\n\n• Creating action plans\n• Solving specific problems\n• Improving operations\n• Growing your business\n\nWhat would you like to work on first?",
          "नमस्ते! मैंने आपके व्यावसायिक आकलन की समीक्षा की है। मैं आपकी इनमें मदद कर सकता हूं:\n\n• एक्शन प्लान बनाना\n• विशिष्ट समस्याओं का समाधान\n• संचालन में सुधार\n• व्यवसाय बढ़ाना\n\nआप पहले किस पर काम करना चाहेंगे?"
        ),
        timestamp: Date.now()
      };
      setMessages([greeting]);
    }
  }, [open, hasActiveSubscription, lang]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { 
      role: "user", 
      content: input.trim(),
      timestamp: Date.now()
    };
    
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate thinking time for better UX
    setTimeout(() => {
      const response = chatEngine.generateResponse(userMsg.content);
      const aiMsg: ChatMessage = { 
        role: "assistant", 
        content: response,
        timestamp: Date.now()
      };
      
      setMessages((m) => [...m, aiMsg]);
      setLoading(false);
    }, 800);
  };

  const quickSuggestions = chatEngine.getQuickSuggestions();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] sm:h-[85vh] w-full max-w-none p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {t(lang, "Smart Business AI", "स्मार्ट बिजनेस AI")}
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  {t(lang, "Your AI Business Coach", "आपका AI बिजनेस कोच")}
                </div>
              </div>
              {!hasActiveSubscription && (
                <Badge variant="secondary" className="ml-auto">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasActiveSubscription ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="p-4 rounded-full bg-muted w-20 h-20 mx-auto flex items-center justify-center">
                  <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Business Coach - Premium Feature</h3>
                  <p className="text-muted-foreground">
                    {t(
                      lang,
                      "Get unlimited AI business coaching for just ₹99/month",
                      "केवल ₹99/महीना में असीमित AI बिजनेस कोचिंग पाएं"
                    )}
                  </p>
                </div>
                <Button onClick={() => navigate('/subscription')} size="lg" className="w-full">
                  {t(lang, "Upgrade to Premium", "प्रीमियम में अपग्रेड करें")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <ScrollArea className="flex-1 px-6" ref={areaRef as any}>
                <div className="py-6 space-y-4">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                        m.role === "assistant" 
                          ? "bg-muted text-foreground rounded-bl-sm" 
                          : "bg-primary text-primary-foreground rounded-br-sm"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-3 bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                        <Bot className="w-4 h-4 animate-pulse" />
                        <div className="text-sm">
                          {t(lang, "Thinking...", "सोच रहा हूं...")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Suggestions */}
              {quickSuggestions.length > 0 && (
                <div className="px-6 py-2 border-t bg-background/50">
                  <div className="flex gap-2 overflow-x-auto">
                    {quickSuggestions.slice(0, 4).map((suggestion, i) => (
                      <Button 
                        key={i} 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setInput(suggestion)}
                        className="text-xs whitespace-nowrap flex-shrink-0"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="px-6 py-4 border-t bg-background/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t(lang, "Ask about your business...", "अपने बिज़नेस के बारे में पूछें...")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={loading}
                    className="flex-1 h-12 text-base"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                    size="lg"
                    className="h-12 px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}