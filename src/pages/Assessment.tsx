import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { IndustrySelector } from "@/components/IndustrySelector";
import { QuestionCard } from "@/components/QuestionCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { industries, businessFunctions, Assessment } from "@/types/assessment";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentPageProps {
  onComplete: (assessment: Assessment) => void;
}

export const AssessmentPage = ({ onComplete }: AssessmentPageProps) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [industryAnswers, setIndustryAnswers] = useState<Record<string, any>>({});
  const [functionAnswers, setFunctionAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalSteps = 2;
  const currentIndustry = industries.find(i => i.id === selectedIndustry);
  const currentFunction = businessFunctions.find(f => f.id === selectedFunction);

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
  };

  const handleFunctionSelect = (functionId: string) => {
    setSelectedFunction(functionId);
  };

  const handleIndustryAnswer = (questionId: string, answer: any) => {
    setIndustryAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleFunctionAnswer = (questionId: string, answer: any) => {
    setFunctionAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScores = () => {
    const getPoints = (answer: any) => {
      if (answer === 'yes' || answer === 'always') return 5;
      if (answer === 'sometimes' || answer === 'often') return 3;
      if (answer === 'not-sure') return 2;
      if (typeof answer === 'number') return Math.max(0, Math.min(5, answer));
      return 0;
    };

    let industryScore = 0;

    if (currentIndustry) {
      const questions = currentIndustry.questions;
      const totalPossible = questions.length * 5;
      const earned = questions.reduce((acc, q) => acc + getPoints(industryAnswers[q.id]), 0);
      industryScore = totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 0;
    }

    const overallScore = industryScore;

    return { overall: overallScore, industry: industryScore };
  };

  const generateRecommendations = () => {
    const recommendations: string[] = [];
    
    // Industry-specific recommendations
    if (currentIndustry) {
      currentIndustry.questions.forEach(q => {
        const answer = industryAnswers[q.id];
        if (answer === 'no' || (typeof answer === 'number' && answer < 3)) {
          if (q.id === 'r1') recommendations.push(language === 'hi' ? 'रोजाना बिक्री और स्टॉक की रिकॉर्डिंग शुरू करें। एक सिंपल रजिस्टर या मोबाइल ऐप का इस्तेमाल करें।' : 'Start tracking daily sales and stock. Use a simple register or mobile app for record keeping.');
          if (q.id === 'r3') recommendations.push(language === 'hi' ? 'अपनी दुकान को Google My Business पर मुफ्त में रजिस्टर करें।' : 'Register your store on Google My Business for free.');
          if (q.id === 'm1') recommendations.push(language === 'hi' ? 'प्रति यूनिट उत्पादन लागत को ट्रैक करना शुरू करें। यह प्रॉफिट बढ़ाने में मदद करेगा।' : 'Start tracking production cost per unit. This will help increase profits.');
          if (q.id === 'f1') recommendations.push(language === 'hi' ? 'खाद्य सुरक्षा प्रशिक्षण लें और FSSAI लाइसेंस प्राप्त करें।' : 'Take food safety training and obtain FSSAI license.');
        }
      });
    }

    // Function-specific recommendations
    if (currentFunction) {
      currentFunction.questions.forEach(q => {
        const answer = functionAnswers[q.id];
        if (answer === 'no' || (typeof answer === 'number' && answer < 3)) {
          if (q.id === 'mk1') recommendations.push(language === 'hi' ? 'WhatsApp Business और Instagram पर मुफ्त में अकाउंट बनाएं। हफ्ते में 2-3 बार पोस्ट करें।' : 'Create free WhatsApp Business and Instagram accounts. Post 2-3 times per week.');
          if (q.id === 's1') recommendations.push(language === 'hi' ? 'हर महीने के लिए बिक्री लक्ष्य निर्धारित करें और उसे ट्रैक करें।' : 'Set monthly sales targets and track them regularly.');
          if (q.id === 'fin1') recommendations.push(language === 'hi' ? 'सभी लेन-देन की रिकॉर्डिंग करें। एक सिंपल खाता बही या मोबाइल ऐप का इस्तेमाल करें।' : 'Record all transactions. Use a simple account book or mobile app.');
        }
      });
    }

    return recommendations;
  };

  const handleNext = () => {
    if (step === 1 && selectedIndustry) {
      setStep(2);
    } else if (step === 2 && currentIndustry) {
      if (currentQuestionIndex < currentIndustry.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const scores = calculateScores();
        const recommendations = generateRecommendations();
        onComplete({
          industry: selectedIndustry,
          industryAnswers,
          scores,
          recommendations
        });
      }
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (step === 4 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (step > 1) {
      setStep(step - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedIndustry;
    if (step === 2 && currentIndustry) {
      const currentQuestion = currentIndustry.questions[currentQuestionIndex];
      return industryAnswers[currentQuestion.id] !== undefined;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {language === 'hi' ? 'व्यापार स्वास्थ्य जांच' : 'Business Health Checkup'}
          </h1>
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        {/* Content */}
        <div className="space-y-6">
          {step === 1 && (
            <IndustrySelector
              selectedIndustry={selectedIndustry}
              onIndustrySelect={handleIndustrySelect}
              language={language}
            />
          )}

          {step === 2 && currentIndustry && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {language === 'hi' ? 'उद्योग प्रश्न' : 'Industry Questions'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'hi' 
                    ? `प्रश्न ${currentQuestionIndex + 1} / ${currentIndustry.questions.length}`
                    : `Question ${currentQuestionIndex + 1} of ${currentIndustry.questions.length}`
                  }
                </p>
              </div>
              <QuestionCard
                question={currentIndustry.questions[currentQuestionIndex]}
                answer={industryAnswers[currentIndustry.questions[currentQuestionIndex].id]}
                onAnswer={handleIndustryAnswer}
                language={language}
              />
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 && currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'hi' ? 'पिछला' : 'Back'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              canProceed() && "bg-gradient-primary shadow-primary hover:shadow-glow"
            )}
          >
            {language === 'hi' ? 'आगे' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};