import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Lightbulb, Target, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { businessModels, revenueModels, businessFrameworks, commonMilestones } from "@/lib/startupData";
import { industries } from "@/types/assessment";
import { StartupPlan } from "@/types/startup";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import jsPDF from 'jspdf';

export default function StartupPlanning() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [startupPlan, setStartupPlan] = useState<Partial<StartupPlan>>({});
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setStartupPlan(prev => ({ ...prev, industryId }));
  };

  const generatePDF = () => {
    if (!startupPlan.businessIdea || !selectedIndustry) {
      toast("Please complete at least the business idea and industry selection");
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    let yPos = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Startup Business Plan', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // Business Idea
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Business Idea', 20, yPos);
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const ideaLines = pdf.splitTextToSize(startupPlan.businessIdea || '', pageWidth - 40);
    pdf.text(ideaLines, 20, yPos);
    yPos += ideaLines.length * 7 + 10;

    // Industry
    const selectedIndustryData = industries.find(i => i.id === selectedIndustry);
    if (selectedIndustryData) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Industry', 20, yPos);
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(selectedIndustryData.name, 20, yPos);
      yPos += 15;
    }

    // Business Models
    const industryModels = businessModels[selectedIndustry] || [];
    if (industryModels.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommended Business Models', 20, yPos);
      yPos += 10;
      
      industryModels.forEach((model, index) => {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${model.name}`, 25, yPos);
        yPos += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(model.description, pageWidth - 50);
        pdf.text(descLines, 25, yPos);
        yPos += descLines.length * 5 + 5;
      });
    }

    // Save PDF
    pdf.save('startup-business-plan.pdf');
    toast("Business plan downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {language === 'hi' ? 'स्टार्टअप योजना' : 'Startup Planning'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'hi' 
              ? 'अपने विचार से क्रियान्वयन तक - एक संपूर्ण स्टार्टअप योजना बनाएं'
              : 'From Idea to Execution - Create a comprehensive startup plan'
            }
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              variant={language === 'hi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </Button>
          </div>
        </div>

        <Tabs defaultValue="idea" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:mx-auto">
            <TabsTrigger value="idea" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {language === 'hi' ? 'विचार' : 'Idea'}
            </TabsTrigger>
            <TabsTrigger value="industry" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {language === 'hi' ? 'उद्योग' : 'Industry'}
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {language === 'hi' ? 'मॉडल' : 'Models'}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {language === 'hi' ? 'आय' : 'Revenue'}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {language === 'hi' ? 'समयरेखा' : 'Timeline'}
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {language === 'hi' ? 'जोखिम' : 'Risks'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="idea" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'अपना व्यापार विचार दर्ज करें' : 'Enter Your Business Idea'}
              </h2>
              <textarea
                placeholder={language === 'hi' 
                  ? 'अपना व्यापार विचार विस्तार से बताएं...'
                  : 'Describe your business idea in detail...'
                }
                className="w-full h-32 p-4 border rounded-lg resize-none"
                value={startupPlan.businessIdea || ''}
                onChange={(e) => setStartupPlan(prev => ({ ...prev, businessIdea: e.target.value }))}
              />
            </Card>
          </TabsContent>

          <TabsContent value="industry" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'अपना उद्योग चुनें' : 'Select Your Industry'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((industry) => (
                  <Card
                    key={industry.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105",
                      selectedIndustry === industry.id && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => handleIndustrySelect(industry.id)}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{industry.icon}</div>
                      <div className="font-semibold">
                        {language === 'hi' ? industry.nameHindi || industry.name : industry.name}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'व्यापार मॉडल' : 'Business Models'}
              </h2>
              {selectedIndustry ? (
                <div className="space-y-4">
                  {(businessModels[selectedIndustry] || []).map((model) => (
                    <Card key={model.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {language === 'hi' ? model.nameHindi || model.name : model.name}
                          </h3>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {language === 'hi' ? model.descriptionHindi || model.description : model.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Key Activities:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {model.keyActivities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Profit Sources:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {model.profitModel.map((profit, index) => (
                                <li key={index}>{profit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'hi' 
                    ? 'पहले उद्योग चुनें'
                    : 'Please select an industry first'
                  }
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'राजस्व मॉडल' : 'Revenue Models'}
              </h2>
              <div className="space-y-4">
                {revenueModels.map((model) => (
                  <Card key={model.id} className="p-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        {language === 'hi' ? model.nameHindi || model.name : model.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'hi' ? model.descriptionHindi || model.description : model.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Advantages:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {model.advantages.map((advantage, index) => (
                              <li key={index}>{advantage}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Challenges:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {model.disadvantages.map((disadvantage, index) => (
                              <li key={index}>{disadvantage}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'क्रियान्वयन समयरेखा' : 'Implementation Timeline'}
              </h2>
              <div className="space-y-4">
                {commonMilestones.map((milestone, index) => (
                  <Card key={milestone.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {language === 'hi' ? milestone.titleHindi || milestone.title : milestone.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{milestone.timeframe}</Badge>
                            {milestone.cost && (
                              <Badge variant="secondary">₹{milestone.cost.toLocaleString()}</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {language === 'hi' ? milestone.descriptionHindi || milestone.description : milestone.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'hi' ? 'जोखिम मूल्यांकन' : 'Risk Assessment'}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">Common Startup Risks:</h3>
                  <div className="grid gap-3">
                    {[
                      'Market validation failure',
                      'Cash flow issues', 
                      'Competition from established players',
                      'Regulatory changes',
                      'Technology disruption',
                      'Team management challenges'
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Mitigation Strategies:</h3>
                  <div className="grid gap-3">
                    {[
                      'Conduct thorough market research',
                      'Maintain 6-12 months cash runway',
                      'Focus on unique value proposition',
                      'Stay updated with regulations',
                      'Embrace continuous learning',
                      'Build strong company culture'
                    ].map((strategy, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Target className="w-5 h-5 text-green-500" />
                        <span>{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Button */}
        <div className="text-center">
          <Button 
            onClick={generatePDF}
            size="lg" 
            className="bg-gradient-primary shadow-primary hover:shadow-glow"
          >
            <Download className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'पूरी योजना PDF में डाउनलोड करें' : 'Download Complete Plan as PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}