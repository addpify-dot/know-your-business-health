import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  return (
    <div className="pointer-events-none">
      {/* Floating toggle is via events; the panel itself is here */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-1rem,380px)] pointer-events-auto">
          <Card className="shadow-xl border bg-background">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <div className="font-semibold">{t(lang, "Smart Business AI", "स्मार्ट बिजनेस AI")}</div>
                {!hasActiveSubscription && (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!hasActiveSubscription ? (
              <div className="p-6 text-center space-y-4">
                <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-lg">AI Business Coach - Premium Feature</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(
                      lang,
                      "Get unlimited AI business coaching for just ₹99/month",
                      "केवल ₹99/महीना में असीमित AI बिजनेस कोचिंग पाएं"
                    )}
                  </p>
                </div>
                <Button onClick={() => navigate('/subscription')} className="w-full">
                  {t(lang, "Upgrade to Premium", "प्रीमियम में अपग्रेड करें")}
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-80" ref={areaRef as any}>
                  <div className="p-3 space-y-3">
                    {messages.map((m, idx) => (
                      <div key={idx} className={m.role === "assistant" ? "" : "text-right"}>
                        <div className={`inline-block rounded-md px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap ${
                          m.role === "assistant" 
                            ? "bg-muted text-foreground" 
                            : "bg-primary text-primary-foreground"
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bot className="w-4 h-4" />
                        <div className="text-sm">
                          {t(lang, "Thinking...", "सोच रहा हूं...")}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
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
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.slice(0, 3).map((suggestion, i) => (
                      <Button 
                        key={i} 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setInput(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}