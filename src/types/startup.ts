export interface BusinessModel {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  examples: string[];
  profitModel: string[];
  keyActivities: string[];
  resources: string[];
  targetCustomers: string;
}

export interface RevenueModel {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  advantages: string[];
  disadvantages: string[];
  examples: string[];
}

export interface BusinessFramework {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  sections: FrameworkSection[];
}

export interface FrameworkSection {
  id: string;
  title: string;
  titleHindi?: string;
  questions: string[];
  questionsHindi?: string[];
}

export interface StartupPlan {
  businessIdea: string;
  industryId: string;
  businessModel: string;
  revenueModel: string;
  targetMarket: string;
  marketSize: string;
  competitiveAdvantage: string;
  financialProjections: {
    initialInvestment: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    breakEvenMonth: number;
  };
  timeline: PlanMilestone[];
  risks: string[];
  mitigation: string[];
}

export interface PlanMilestone {
  id: string;
  title: string;
  titleHindi?: string;
  description: string;
  descriptionHindi?: string;
  timeframe: string;
  cost?: number;
  dependencies: string[];
}