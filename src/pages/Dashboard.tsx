import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Assessment, industries, businessFunctions } from "@/types/assessment";
import { getSavedAssessments } from "@/lib/storage";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface NavState {
  assessment?: Assessment;
  language?: 'en' | 'hi';
}

const INDUSTRY_BENCHMARKS: Record<string, number> = {
  retail: 64,
  manufacturing: 60,
  "food-beverages": 62,
  service: 65,
  agriculture: 58,
  "construction-realestate": 59,
  wholesale: 63,
  ecommerce: 66,
  "transport-logistics": 61,
  "health-wellness": 67,
};

const FUNCTION_BENCHMARKS: Record<string, number> = {
  marketing: 62,
  sales: 64,
  finance: 63,
  operations: 65,
  "team-management": 66,
  "customer-service": 64,
  "business-operation": 63,
};

const DEFAULT_AVG = 63;

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const nav = (location.state || {}) as NavState;

  const saved = getSavedAssessments();
  const latestSaved = saved[0];

  const [language, setLanguage] = useState<'en' | 'hi'>(nav.language || latestSaved?.language || 'en');

  const assessment: Assessment | undefined = nav.assessment || latestSaved?.data;

  useEffect(() => {
    document.title = language === 'hi' ? 'डैशबोर्ड - बिज़नेस हेल्थ चेकअप' : 'Dashboard - Business Health Checkup';
  }, [language]);

  const industry = useMemo(() => industries.find(i => i.id === assessment?.industry), [assessment]);
  const businessFunction = useMemo(() => businessFunctions.find(f => f.id === assessment?.businessFunction), [assessment]);

  const compareData = useMemo(() => {
    if (!assessment) return [] as Array<{ label: string; you: number; industry: number }>;
    const industryAvg = INDUSTRY_BENCHMARKS[assessment.industry] ?? DEFAULT_AVG;
    const functionAvg = FUNCTION_BENCHMARKS[assessment.businessFunction] ?? DEFAULT_AVG;
    const overallAvg = DEFAULT_AVG;
    return [
      { label: language === 'hi' ? 'समग्र' : 'Overall', you: assessment.scores.overall, industry: overallAvg },
      { label: language === 'hi' ? 'उद्योग' : 'Industry', you: assessment.scores.industry, industry: industryAvg },
      { label: language === 'hi' ? 'फ़ंक्शन' : 'Function', you: assessment.scores.function, industry: functionAvg },
    ];
  }, [assessment, language]);

  const trendData = useMemo(() => {
    return [...saved].reverse().map((s) => ({
      date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: (s.data as Assessment).scores.overall,
    }));
  }, [saved]);

  const chartConfig = {
    you: { label: language === 'hi' ? 'आप' : 'You', color: 'hsl(var(--primary))' },
    industry: { label: language === 'hi' ? 'उद्योग औसत' : 'Industry Avg', color: 'hsl(var(--muted-foreground))' },
    score: { label: language === 'hi' ? 'स्कोर' : 'Score', color: 'hsl(var(--primary))' },
  } as const;

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
        <main className="max-w-6xl mx-auto px-6 py-12">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </h1>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </header>
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">
              {language === 'hi' ? 'अभी कोई रिपोर्ट उपलब्ध नहीं' : 'No reports available yet'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' ? 'कृपया पहले एक आकलन पूरा करें।' : 'Please complete an assessment first.'}
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/">
                <Button className="bg-gradient-primary">
                  {language === 'hi' ? 'आकलन शुरू करें' : 'Start Assessment'}
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">
            {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </h1>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{industry?.name}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{businessFunction?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            {language === 'hi' ? 'वापस' : 'Back'}
          </Button>
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {/* At-a-glance & Radial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-2">{language === 'hi' ? 'समग्र स्कोर' : 'Overall Score'}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'hi' ? 'आपके व्यापार का स्वास्थ्य एक नज़र में' : 'Your business health at a glance'}
            </p>
            <ChartContainer config={chartConfig} className="mx-auto">
              <RadialBarChart
                width={320}
                height={240}
                innerRadius={80}
                outerRadius={110}
                data={[{ name: 'score', value: assessment.scores.overall }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={8} fill="var(--color-score)" />
                {/* Center label */}
              </RadialBarChart>
            </ChartContainer>
            <div className="text-center mt-2 text-3xl font-bold">{assessment.scores.overall}%</div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{language === 'hi' ? 'तुलना: आप बनाम उद्योग' : 'Compare: You vs Industry'}</h2>
            </div>
            <ChartContainer config={chartConfig} className="aspect-[16/9]">
              <BarChart data={compareData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="you" fill="var(--color-you)" radius={[6,6,0,0]} />
                <Bar dataKey="industry" fill="var(--color-industry)" radius={[6,6,0,0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{language === 'hi' ? 'समग्र स्कोर ट्रेंड' : 'Overall Score Trend'}</h2>
            {trendData.length > 0 && (
              <span className="text-xs text-muted-foreground">{language === 'hi' ? `${trendData.length} सेव्ड रन` : `${trendData.length} saved runs`}</span>
            )}
          </div>
          <ChartContainer config={chartConfig} className="aspect-[16/9]">
            <LineChart data={trendData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
          {trendData.length === 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              {language === 'hi' ? 'ट्रेंड देखने हेतु रिपोर्ट सेव करें।' : 'Save reports to see trend over time.'}
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
