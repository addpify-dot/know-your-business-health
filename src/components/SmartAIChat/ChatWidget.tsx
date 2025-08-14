import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Settings, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { chatWithOpenAI, AIMessage } from "@/lib/ai";
import { getSavedAssessments } from "@/lib/storage";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

// Minimal floating chat widget, global and context-aware
const STORAGE_KEY = "bhc_ai_chat_thread_v1";
const API_KEY_STORAGE = "bhc_openai_key";

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

export default function ChatWidget() {
  const { user } = useAuth();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem(API_KEY_STORAGE) || "");
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AIMessage[]) : [];
    } catch {
      return [];
    }
  });

  const lang = useLanguage();
  const areaRef = useRef<HTMLDivElement>(null);

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

  const assessment = useAssessmentContext();

  const systemPrompt = useMemo(() => {
    const intro = `You are Smart With AI, a professional advisor for Indian small businesses. You know common business functions (Sales, Marketing, Operations, Finance, HR) and frameworks (Lean, 5S, PDCA, AIDA, SPANCO, 7 QC tools). Give clear, actionable steps with low/no-cost tools. Keep it concise and practical. Reply in ${lang === "hi" ? "Hindi" : "English"}.`;

    const ctx = assessment
      ? `Assessment context (JSON): ${JSON.stringify({
          industry: assessment.industry,
          businessFunction: assessment.businessFunction,
          scores: assessment.scores,
          language: assessment.language,
          recommendations: assessment.recommendations,
        })}`
      : "No assessment available. Ask the user basic questions to understand their business and goals.";

    return `${intro}\n${ctx}`;
  }, [assessment, lang]);

  // Seed greeting on first open if empty
  useEffect(() => {
    if (open && messages.length === 0 && hasActiveSubscription) {
      const greeting: AIMessage = {
        role: "assistant",
        content: t(
          lang,
          "Hi! I reviewed your report. Would you like a 30-day action plan or help fixing one key issue first?",
          "नमस्ते! मैंने आपकी रिपोर्ट देखी। क्या आप 30 दिनों की एक्शन प्लान चाहते हैं या पहले किसी एक मुख्य समस्या को ठीक करना चाहेंगे?"
        ),
      };
      setMessages([greeting]);
    }
  }, [open, hasActiveSubscription]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      toast(t(lang, "Please add your OpenAI API key first.", "कृपया पहले अपना OpenAI API की जोड़ें।"));
      return;
    }
    const userMsg: AIMessage = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await chatWithOpenAI(
        [
          { role: "system", content: systemPrompt },
          ...messages,
          userMsg,
        ],
        apiKey
      );
      const aiMsg: AIMessage = { role: "assistant", content: resp };
      setMessages((m) => [...m, aiMsg]);
    } catch (e: any) {
      toast(t(lang, "AI request failed.", "एआई अनुरोध विफल हुआ।"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pointer-events-none">
      {/* Floating toggle is via events; the panel itself is here */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-1rem,380px)] pointer-events-auto">
          <Card className="shadow-xl border bg-background">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <div className="font-semibold">{t(lang, "Smart With AI", "स्मार्ट विद एआई")}</div>
                {!hasActiveSubscription && (
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveSubscription && (
                  <Button variant="ghost" size="icon" aria-label="Settings" onClick={() => {
                    const newKey = prompt(t(lang, "Enter OpenAI API key", "OpenAI API की दर्ज करें"), apiKey || "");
                    if (newKey !== null) {
                      setApiKey(newKey.trim());
                      if (newKey.trim()) {
                        localStorage.setItem(API_KEY_STORAGE, newKey.trim());
                        toast(t(lang, "API key saved.", "API की सेव हो गई।"));
                      }
                    }
                  }}>
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!hasActiveSubscription ? (
              <div className="p-6 text-center space-y-4">
                <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-lg">AI Chatbot - Premium Feature</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(
                      lang,
                      "Get unlimited AI business advice for just ₹99/month",
                      "केवल ₹99/महीना में असीमित AI बिजनेस सलाह पाएं"
                    )}
                  </p>
                </div>
                <Button onClick={() => navigate('/subscription')} className="w-full">
                  {t(lang, "Upgrade to Premium", "प्रीमियम में अपग्रेड करें")}
                </Button>
              </div>
            ) : (
              <>
                {!apiKey && (
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                    {t(
                      lang,
                      "Add your OpenAI API key to chat. Stored locally in your browser.",
                      "चैट के लिए अपना OpenAI API की जोड़ें। यह आपके ब्राउज़र में सुरक्षित रूप से संग्रहीत होगी।"
                    )}
                  </div>
                )}

                <ScrollArea className="max-h-80" ref={areaRef as any}>
                  <div className="p-3 space-y-3">
                    {messages.map((m, idx) => (
                      <div key={idx} className={m.role === "assistant" ? "" : "text-right"}>
                        <div className={`inline-block rounded-md px-3 py-2 text-sm ${
                          m.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t(lang, "Ask anything about your business...", "अपने बिज़नेस से जुड़ा कोई भी सवाल पूछें...")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={!apiKey}
                    />
                    <Button onClick={handleSend} disabled={loading || !apiKey}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {apiKey && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        t(lang, "Create a 30-day action plan", "30 दिनों की एक्शन प्लान बनाएं"),
                        t(lang, "Improve cash flow", "कैश फ्लो बेहतर करें"),
                        t(lang, "Boost sales with low budget", "कम बजट में सेल्स बढ़ाएं"),
                      ].map((chip, i) => (
                        <Button key={i} size="sm" variant="outline" onClick={() => setInput(chip)}>
                          {chip}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}