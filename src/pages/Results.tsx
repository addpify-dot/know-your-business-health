import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment, industries, businessFunctions } from "@/types/assessment";
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsPageProps {
  assessment: Assessment;
  onRestart: () => void;
  onBack: () => void;
  language: 'en' | 'hi';
}

export const ResultsPage = ({ assessment, onRestart, onBack, language }: ResultsPageProps) => {
  const industry = industries.find(i => i.id === assessment.industry);
  const businessFunction = businessFunctions.find(f => f.id === assessment.businessFunction);

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

  const handleDownloadReport = () => {
    // This would generate and download a PDF report
    console.log("Downloading report...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
              <p className="text-lg">
                {language === 'hi' 
                  ? 'बहुत बढ़िया! आपका व्यापार बेहतरीन चल रहा है।'
                  : 'Excellent! Your business is performing very well.'
                }
              </p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
          </Button>
          
          <Button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 flex-1 bg-gradient-secondary"
          >
            <Download className="w-4 h-4" />
            {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
          </Button>
          
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 flex-1 bg-gradient-primary shadow-primary"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'hi' ? 'नई जांच शुरू करें' : 'Start New Assessment'}
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
    </div>
  );
};