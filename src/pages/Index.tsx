import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssessmentPage } from "./Assessment";
import { ResultsPage } from "./Results";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Assessment, industries } from "@/types/assessment";
import { CheckCircle, TrendingUp, Users, Award, ShoppingBag, Factory, Utensils, Briefcase, Sprout, Building2, Package, ShoppingCart, Truck, HeartPulse, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSavedAssessments } from "@/lib/storage";
import { toast } from "sonner";
const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'assessment' | 'results'>('landing');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const location = useLocation();
  const navigate = useNavigate();
  const handleStartAssessment = () => {
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = (assessmentData: Assessment) => {
    setAssessment(assessmentData);
    setCurrentView('results');
  };

  const handleRestart = () => {
    setAssessment(null);
    setCurrentView('landing');
  };

  const handleBackToAssessment = () => {
    setCurrentView('assessment');
  };

  // Auto-download flow via navigation state
  useEffect(() => {
    const state: any = (location as any)?.state;
    if (state?.autoDownloadResults) {
      let data = assessment;
      if (!data) {
        const saved = getSavedAssessments();
        data = saved[0]?.data || null;
        if (data) setAssessment(data);
      }
      if (data) {
        setCurrentView('results');
        setTimeout(() => {
          window.dispatchEvent(new Event('bhc:download-results'));
        }, 300);
      } else {
        toast('Please complete an assessment first');
      }
      navigate('/', { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state]);

  if (currentView === 'assessment') {
    return <AssessmentPage onComplete={handleAssessmentComplete} />;
  }

  if (currentView === 'results' && assessment) {
    return (
      <ResultsPage
        assessment={assessment}
        onRestart={handleRestart}
        onBack={handleBackToAssessment}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {language === 'hi' ? 'बिज़नेस हेल्थ चेकअप' : 'Business Health Checkup'}
          </h1>
        </div>
<div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </Button>
          </Link>
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
              {language === 'hi' 
                ? 'आपके व्यापार का स्वास्थ्य जांचें'
                : 'Check Your Business Health'
              }
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'भारतीय छोटे व्यापारियों के लिए विशेष रूप से डिज़ाइन किया गया मुफ्त टूल। अपने व्यापार की कमियों को पहचानें और व्यावहारिक समाधान पाएं।'
                : 'A free tool specially designed for Indian small business owners. Identify your business weaknesses and get practical solutions.'
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStartAssessment}
              className="text-lg px-8 py-6 bg-gradient-primary shadow-primary hover:shadow-glow transition-all duration-300 animate-pulse-glow"
            >
              {language === 'hi' ? 'मुफ्त जांच शुरू करें' : 'Start Free Assessment'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2"
            >
              {language === 'hi' ? 'कैसे काम करता है?' : 'How It Works?'}
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center space-y-4 hover:shadow-card transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {language === 'hi' ? 'सरल सवाल' : 'Simple Questions'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'hi'
                ? 'आसान हिंदी और अंग्रेजी में सवाल, किसी भी व्यापारी के लिए समझने योग्य'
                : 'Easy questions in Hindi and English, understandable for any business owner'
              }
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-card transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {language === 'hi' ? 'भारतीय व्यापार के लिए' : 'For Indian Businesses'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'hi'
                ? '18+ उद्योगों के लिए विशेष प्रश्न और भारतीय बाजार के अनुकूल समाधान'
                : 'Specialized questions for 18+ industries and solutions tailored for Indian market'
              }
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-card transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {language === 'hi' ? 'तुरंत रिपोर्ट' : 'Instant Report'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'hi'
                ? 'स्कोर, कमियां और व्यावहारिक समाधान के साथ तुरंत रिपोर्ट प्राप्त करें'
                : 'Get instant report with scores, weaknesses and practical solutions'
              }
            </p>
          </Card>
        </div>

        {/* Industries Covered */}
        <Card className="p-8 space-y-6 bg-gradient-to-r from-card to-primary/5">
          <h2 className="text-2xl font-bold text-center text-foreground">
            {language === 'hi' ? 'समर्थित उद्योग' : 'Supported Industries'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {industries.map((ind) => {
              const Icon = ({ className = "w-6 h-6" }) => {
                switch (ind.id) {
                  case 'retail': return <ShoppingBag className={className} />;
                  case 'manufacturing': return <Factory className={className} />;
                  case 'food-beverages': return <Utensils className={className} />;
                  case 'service': return <Briefcase className={className} />;
                  case 'agriculture': return <Sprout className={className} />;
                  case 'construction-realestate': return <Building2 className={className} />;
                  case 'wholesale': return <Package className={className} />;
                  case 'ecommerce': return <ShoppingCart className={className} />;
                  case 'transport-logistics': return <Truck className={className} />;
                  case 'health-wellness': return <HeartPulse className={className} />;
                  default: return <Sparkles className={className} />;
                }
              };
              return (
                <div key={ind.id} className="p-4 rounded-lg bg-background/50 hover:bg-background transition-colors duration-300 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">
                    {language === 'hi' ? ind.nameHindi || ind.name : ind.name}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {language === 'hi' 
              ? 'आज ही अपने व्यापार की जांच करें'
              : 'Check Your Business Health Today'
            }
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'केवल 5-10 मिनट में अपने व्यापार की पूरी जांच करें और मुफ्त समाधान पाएं'
              : 'Complete assessment of your business in just 5-10 minutes and get free solutions'
            }
          </p>
          <Button
            size="lg"
            onClick={handleStartAssessment}
            className="text-lg px-12 py-6 bg-gradient-primary shadow-primary hover:shadow-glow transition-all duration-300"
          >
            {language === 'hi' ? 'अभी शुरू करें - बिल्कुल मुफ्त' : 'Start Now - Completely Free'}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
          <p>
            {language === 'hi'
              ? '© 2024 बिज़नेस हेल्थ चेकअप - भारतीय छोटे व्यापारों के लिए बनाया गया'
              : '© 2024 Business Health Checkup - Made for Indian Small Businesses'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
