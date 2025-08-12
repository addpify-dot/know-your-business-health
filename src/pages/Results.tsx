import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment, industries, businessFunctions, BusinessFunction } from "@/types/assessment";
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle, Share2, Save, Bot, GraduationCap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAssessment, getFunctionDetail, saveFunctionDetail } from "@/lib/storage";
import FunctionDetailsModal from "@/components/FunctionDetailsModal";
import { useNavigate } from "react-router-dom";

interface ResultsPageProps {
  assessment: Assessment;
  onRestart: () => void;
  onBack: () => void;
  language: 'en' | 'hi';
}

export const ResultsPage = ({ assessment, onRestart, onBack, language }: ResultsPageProps) => {
  const industry = industries.find(i => i.id === assessment.industry);
  const businessFunction = businessFunctions.find(f => f.id === assessment.businessFunction);
  const { toast } = useToast();
const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Detailed function assessment modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFunc, setActiveFunc] = useState<BusinessFunction | null>(null);
  const [initialFuncAnswers, setInitialFuncAnswers] = useState<Record<string, any>>({});

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (language === 'hi') {
      if (score >= 80) return "बहुत अच्छा! आपका व्यापार अच्छी स्थिति में है।";
      if (score >= 60) return "ठीक है, लेकिन सुधार की गुंजाइश है।";
      return "ध्यान दें! कुछ महत्वपूर्ण क्षेत्रों में सुधार की जरूरत है।";
    } else {
      if (score >= 80) return "Excellent! Your business is in great shape.";
      if (score >= 60) return "Good, but there's room for improvement.";
      return "Attention needed! Several areas require improvement.";
    }
  };

  const getPoints = (answer: any) => {
    if (answer === 'yes' || answer === 'always') return 5;
    if (answer === 'sometimes' || answer === 'often') return 3;
    if (answer === 'not-sure') return 2;
    if (typeof answer === 'number') return Math.max(0, Math.min(5, answer));
    return 0;
  };

  const industryItems = (industry?.questions || []).map(q => ({
    id: q.id,
    text: language === 'hi' ? q.textHindi || q.text : q.text,
    points: getPoints(assessment.industryAnswers[q.id]),
    area: 'industry' as const,
  }));
  const functionItems = (businessFunction?.questions || []).map(q => ({
    id: q.id,
    text: language === 'hi' ? q.textHindi || q.text : q.text,
    points: getPoints(assessment.functionAnswers[q.id]),
    area: 'function' as const,
  }));
  const allItems = [...industryItems, ...functionItems];
  const strengths = allItems
    .filter(i => i.points >= 4)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
  const problems = allItems
    .filter(i => i.points <= 2)
    .sort((a, b) => a.points - b.points)
    .slice(0, 5);

  // Suggested services logic
  const overallScore = assessment.scores.overall;
  const functionScore = assessment.scores.function;
  const fnId = businessFunction?.id;

  const automationRelevantIds = new Set(['business-operation','ecommerce','retail','wholesale','manufacturing','service']);
  const needsAutomation = (fnId ? automationRelevantIds.has(fnId) && functionScore < 70 : false) || overallScore < 65;
  const needsTraining = (fnId === 'team-management' && functionScore < 80) || overallScore < 60 || problems.length >= 3;

  const suggestions: Array<{ id: string; title: string; description: string; href: string; type: 'automation' | 'training'; }> = [];

  if (needsAutomation) {
    suggestions.push({
      id: 'smart-ai',
      title: language === 'hi' ? 'स्मार्ट विद एआई' : 'Smart With AI',
      description: language === 'hi'
        ? 'लीड, फॉलो-अप, रिमाइंडर, रिपोर्ट आदि के लिए एआई ऑटोमेशन से उत्पादकता बढ़ाएं।'
        : 'Boost productivity with AI automations for leads, follow-ups, reminders, reports, and more.',
      href: 'https://smart-with-ai-india.lovable.app/?ref=bhc&src=results',
      type: 'automation',
    });
  }

  if (needsTraining) {
    suggestions.push({
      id: 'bb-lfp',
      title: language === 'hi' ? 'बड़ा बिज़नेस LFP (डॉ. विवेक बिंद्रा)' : 'Bada Business LFP (Dr. Vivek Bindra)',
      description: language === 'hi'
        ? 'टीम, सेल्स, ऑपरेशंस और फाइनेंस के लिए सिस्टम बनाने हेतु प्रैक्टिकल बिज़नेस ट्रेनिंग।'
        : 'Practical business training to build systems for team, sales, operations, and finance.',
      href: 'https://www.badabusiness.com/lfp?pp_code=BIHH037619&utm_source=bhc&utm_medium=app&utm_campaign=suggested_services',
      type: 'training',
    });
  }

  const handleDownloadReport = async () => {
    const node = reportRef.current;
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let y = 0;
    if (imgHeight < pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Split across pages
      let position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        position += pageHeight;
        if (position < imgHeight) pdf.addPage();
      }
    }
    pdf.save('Business-Health-Report.pdf');
  };

  const handleShareWhatsApp = () => {
    const title = language === 'hi' ? 'मेरी बिज़नेस हेल्थ रिपोर्ट' : 'My Business Health Report';
    const summary = `${title}: ${assessment.scores.overall}%`;
    const tips = problems.map((p, idx) => `${idx + 1}. ${p.text}`).join('\n');
    const appLink = window.location.origin;
    const linkLabel = language === 'hi' ? 'ऐप लिंक' : 'App link';
    const text = `${summary}\n${language === 'hi' ? 'मुख्य सुधार:' : 'Top fixes:'}\n${tips}\n\n${linkLabel}: ${appLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSave = () => {
    saveAssessment({
      id: String(Date.now()),
      date: new Date().toISOString(),
      language,
      data: assessment,
    });
    toast({
      title: language === 'hi' ? 'सेव हो गया' : 'Saved',
      description: language === 'hi' ? 'आपकी रिपोर्ट सेव हो गई है' : 'Your report has been saved',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Report Content (captured for PDF) */}
        <div ref={reportRef} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {language === 'hi' ? 'आपका व्यापार स्वास्थ्य रिपोर्ट' : 'Your Business Health Report'}
            </h1>
            <div className="flex justify-center items-center gap-4 text-muted-foreground">
              <span>{industry?.name}</span>
              <span>•</span>
              <span>{businessFunction?.name}</span>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="p-8 text-center space-y-6 bg-gradient-to-r from-card to-card/50 shadow-card">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {language === 'hi' ? 'समग्र स्वास्थ्य स्कोर' : 'Overall Health Score'}
              </h2>
              <div className={cn("text-6xl font-bold", getScoreColor(assessment.scores.overall))}>
                {assessment.scores.overall}%
              </div>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {getScoreMessage(assessment.scores.overall)}
              </p>
            </div>
          </Card>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{industry?.icon}</div>
                <h3 className="text-xl font-semibold">
                  {language === 'hi' ? 'उद्योग स्कोर' : 'Industry Score'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{industry?.name}</span>
                  <span className={cn("text-2xl font-bold", getScoreColor(assessment.scores.industry))}>
                    {assessment.scores.industry}%
                  </span>
                </div>
                <Progress value={assessment.scores.industry} className="h-3" />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{businessFunction?.icon}</div>
                <h3 className="text-xl font-semibold">
                  {language === 'hi' ? 'फ़ंक्शन स्कोर' : 'Function Score'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{businessFunction?.name}</span>
                  <span className={cn("text-2xl font-bold", getScoreColor(assessment.scores.function))}>
                    {assessment.scores.function}%
                  </span>
                </div>
                <Progress value={assessment.scores.function} className="h-3" />
              </div>
            </Card>
          </div>

          {/* Strengths and Problems */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{language === 'hi' ? 'शीर्ष 3 ताकतें' : 'Top 3 Strengths'}</h3>
              <div className="space-y-3">
                {strengths.length > 0 ? strengths.map((s, i) => (
                  <div key={i} className="p-3 rounded-md bg-success/10 text-success">
                    ✓ {s.text}
                  </div>
                )) : (
                  <p className="text-muted-foreground">{language === 'hi' ? 'अभी कोई विशेष ताकत नहीं दिखी' : 'No standout strengths yet.'}</p>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{language === 'hi' ? 'शीर्ष 5 समस्याएँ/जोखिम' : 'Top 5 Problems / Risks'}</h3>
              <div className="space-y-3">
                {problems.length > 0 ? problems.map((p, i) => (
                  <div key={i} className="p-3 rounded-md bg-destructive/10 text-destructive">
                    • {p.text}
                  </div>
                )) : (
                  <p className="text-muted-foreground">{language === 'hi' ? 'कोई बड़ी समस्या नहीं' : 'No major problems detected.'}</p>
                )}
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold">
                {language === 'hi' ? 'सुधार के सुझाव' : 'Improvement Recommendations'}
              </h3>
            </div>
            
            {assessment.recommendations.length > 0 ? (
              <div className="space-y-4">
                {assessment.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {problems.map((p, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground leading-relaxed">
                        {language === 'hi' 
                          ? `कार्रवाई (30 दिन): ${p.text} के लिए सरल कदम शुरू करें। मुफ्त टूल जैसे Google Business Profile, WhatsApp स्टेटस, और Excel/खाता-बही का उपयोग करें।`
                          : `Action (30 days): Start simple steps for "${p.text}". Use free tools like Google Business Profile, WhatsApp Status, and Excel/account book.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Suggested Services */}
          {suggestions.length > 0 && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold">
                  {language === 'hi' ? 'सुझाए गए सेवाएं' : 'Suggested Services'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((s) => (
                  <div key={s.id} className="p-4 rounded-lg bg-muted/50 flex items-start gap-4">
                    <div className="mt-1">
                      {s.type === 'automation' ? (
                        <Bot className="w-6 h-6 text-primary" aria-hidden="true" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-accent" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{s.title}</div>
                      <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="inline-flex items-center gap-2">
                          {language === 'hi' ? 'देखें' : 'Explore'}
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Detailed assessments by function */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold">
                {language === 'hi' ? 'फ़ंक्शन-वार विस्तृत जाँच' : 'Detailed Assessments by Function'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessFunctions.map((func) => {
                const saved = getFunctionDetail(func.id);
                return (
                  <Card key={func.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{func.icon}</div>
                      <div>
                        <div className="font-semibold">{language === 'hi' ? func.nameHindi || func.name : func.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {saved ? (language === 'hi' ? 'सेव किया गया' : 'Saved') : (language === 'hi' ? 'अभी तक पूरा नहीं' : 'Not completed')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveFunc(func);
                        setInitialFuncAnswers(saved?.answers || {});
                        setDetailsOpen(true);
                      }}
                    >
                      {saved ? (language === 'hi' ? 'एडिट' : 'Edit') : (language === 'hi' ? 'एड करें' : 'Add')}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
          </Button>
          <Button onClick={handleShareWhatsApp} className="flex items-center gap-2 flex-1 bg-primary/90">
            <Share2 className="w-4 h-4" />
            {language === 'hi' ? 'व्हाट्सऐप पर शेयर करें' : 'Share on WhatsApp'}
          </Button>
          <Button onClick={handleSave} variant="outline" className="flex items-center gap-2 flex-1">
            <Save className="w-4 h-4" />
            {language === 'hi' ? 'रिपोर्ट सेव करें' : 'Save Result'}
          </Button>
          <Button onClick={() => navigate('/dashboard', { state: { assessment, language } })} variant="outline" className="flex items-center gap-2 flex-1">
            {language === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}
          </Button>
          <Button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 flex-1 bg-gradient-secondary"
          >
            <Download className="w-4 h-4" />
            {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download PDF'}
          </Button>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 flex-1 bg-gradient-primary shadow-primary"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'hi' ? 'नई जांच शुरू करें' : 'Retake Assessment'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
          {language === 'hi' 
            ? 'भारतीय छोटे व्यापारों के लिए विशेष रूप से डिज़ाइन किया गया'
            : 'Specially designed for Indian small businesses'
          }
        </div>
      </div>

      {/* Modal for function details */}
      <FunctionDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        func={activeFunc}
        language={language}
        initialAnswers={initialFuncAnswers}
        onSave={(answers) => {
          if (!activeFunc) return;
          saveFunctionDetail({
            functionId: activeFunc.id,
            answers,
            date: new Date().toISOString(),
            language,
          });
          toast({
            title: language === 'hi' ? 'सेव हुआ' : 'Saved',
            description: language === 'hi' ? 'विस्तृत जाँच सेव हो गई' : 'Detailed assessment saved',
          });
        }}
      />

    </div>
  );
};
