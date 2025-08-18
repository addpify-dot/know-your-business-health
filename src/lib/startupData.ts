import { BusinessModel, RevenueModel, BusinessFramework, PlanMilestone } from "@/types/startup";

export const businessModels: Record<string, BusinessModel[]> = {
  retail: [
    {
      id: 'physical-store',
      name: 'Physical Store',
      nameHindi: 'भौतिक दुकान',
      description: 'Traditional brick-and-mortar retail store serving local customers',
      descriptionHindi: 'स्थानीय ग्राहकों की सेवा करने वाली पारंपरिक भौतिक दुकान',
      examples: ['Grocery store', 'Clothing store', 'Electronics shop'],
      profitModel: ['Product markup', 'Volume sales', 'Customer loyalty'],
      keyActivities: ['Inventory management', 'Customer service', 'Store operations'],
      resources: ['Physical location', 'Inventory', 'Staff'],
      targetCustomers: 'Local community, walk-in customers'
    },
    {
      id: 'online-store',
      name: 'Online Store',
      nameHindi: 'ऑनलाइन स्टोर',
      description: 'E-commerce platform selling products directly to consumers online',
      descriptionHindi: 'उपभोक्ताओं को सीधे ऑनलाइन उत्पाद बेचने वाला ई-कॉमर्स प्लेटफॉर्म',
      examples: ['Amazon seller', 'Shopify store', 'Social commerce'],
      profitModel: ['Product margins', 'Shipping fees', 'Digital marketing'],
      keyActivities: ['Digital marketing', 'Order fulfillment', 'Customer support'],
      resources: ['Website/app', 'Inventory', 'Logistics'],
      targetCustomers: 'Online shoppers, specific niches'
    }
  ],
  manufacturing: [
    {
      id: 'b2b-supply',
      name: 'B2B Manufacturing',
      nameHindi: 'बी2बी निर्माण',
      description: 'Manufacturing products for other businesses and retailers',
      descriptionHindi: 'अन्य व्यवसायों और खुदरा विक्रेताओं के लिए उत्पाद निर्माण',
      examples: ['Component supplier', 'Private label manufacturing', 'Industrial parts'],
      profitModel: ['Bulk orders', 'Long-term contracts', 'Economies of scale'],
      keyActivities: ['Production planning', 'Quality control', 'B2B sales'],
      resources: ['Manufacturing facility', 'Equipment', 'Skilled labor'],
      targetCustomers: 'Retailers, distributors, other manufacturers'
    }
  ],
  "food-beverages": [
    {
      id: 'cloud-kitchen',
      name: 'Cloud Kitchen',
      nameHindi: 'क्लाउड किचन',
      description: 'Delivery-only restaurant without dine-in facility',
      descriptionHindi: 'बिना डाइन-इन सुविधा के केवल डिलीवरी रेस्टोरेंट',
      examples: ['Swiggy kitchen', 'Multi-brand kitchen', 'Ghost restaurant'],
      profitModel: ['Food delivery', 'Multiple brands', 'Lower overhead'],
      keyActivities: ['Food preparation', 'Order management', 'Delivery coordination'],
      resources: ['Kitchen space', 'Cooking equipment', 'Delivery partners'],
      targetCustomers: 'Urban customers, office workers, families'
    }
  ]
};

export const revenueModels: RevenueModel[] = [
  {
    id: 'product-sales',
    name: 'Product Sales',
    nameHindi: 'उत्पाद बिक्री',
    description: 'Direct sale of physical or digital products',
    descriptionHindi: 'भौतिक या डिजिटल उत्पादों की प्रत्यक्ष बिक्री',
    advantages: ['Simple to understand', 'Immediate revenue', 'Scalable'],
    disadvantages: ['Inventory management', 'Seasonal fluctuations', 'Competition'],
    examples: ['Retail stores', 'Manufacturing', 'E-commerce']
  },
  {
    id: 'subscription',
    name: 'Subscription Model',
    nameHindi: 'सब्स्क्रिप्शन मॉडल',
    description: 'Recurring revenue from regular payments',
    descriptionHindi: 'नियमित भुगतान से आवर्तक आय',
    advantages: ['Predictable revenue', 'Customer retention', 'Steady cash flow'],
    disadvantages: ['Customer acquisition cost', 'Churn management', 'Initial scaling'],
    examples: ['Netflix', 'Gym memberships', 'Software as a Service']
  },
  {
    id: 'commission',
    name: 'Commission/Marketplace',
    nameHindi: 'कमीशन/मार्केटप्लेस',
    description: 'Earning percentage from transactions between buyers and sellers',
    descriptionHindi: 'खरीदार और विक्रेता के बीच लेनदेन से प्रतिशत कमाई',
    advantages: ['No inventory', 'Scalable', 'Network effects'],
    disadvantages: ['Trust building', 'Platform dependency', 'High competition'],
    examples: ['Amazon marketplace', 'Uber', 'Real estate brokers']
  }
];

export const businessFrameworks: BusinessFramework[] = [
  {
    id: 'business-model-canvas',
    name: 'Business Model Canvas',
    nameHindi: 'बिजनेस मॉडल कैनवास',
    description: 'Visual framework describing business model components',
    descriptionHindi: 'व्यापार मॉडल घटकों का वर्णन करने वाला दृश्य ढांचा',
    sections: [
      {
        id: 'value-proposition',
        title: 'Value Proposition',
        titleHindi: 'मूल्य प्रस्ताव',
        questions: [
          'What problem are you solving?',
          'What value do you deliver to customers?',
          'What makes you different from competitors?'
        ],
        questionsHindi: [
          'आप कौन सी समस्या हल कर रहे हैं?',
          'आप ग्राहकों को क्या मूल्य प्रदान करते हैं?',
          'आपको प्रतिस्पर्धियों से क्या अलग बनाता है?'
        ]
      },
      {
        id: 'customer-segments',
        title: 'Customer Segments',
        titleHindi: 'ग्राहक खंड',
        questions: [
          'Who are your target customers?',
          'What are their demographics and characteristics?',
          'How do you segment your market?'
        ],
        questionsHindi: [
          'आपके लक्षित ग्राहक कौन हैं?',
          'उनकी जनसांख्यिकी और विशेषताएं क्या हैं?',
          'आप अपने बाजार को कैसे विभाजित करते हैं?'
        ]
      }
    ]
  }
];

export const commonMilestones: PlanMilestone[] = [
  {
    id: 'idea-validation',
    title: 'Idea Validation',
    titleHindi: 'आइडिया सत्यापन',
    description: 'Validate your business idea through market research and customer feedback',
    descriptionHindi: 'बाजार अनुसंधान और ग्राहक प्रतिक्रिया के माध्यम से अपने व्यापार विचार को सत्यापित करें',
    timeframe: 'Week 1-2',
    cost: 5000,
    dependencies: []
  },
  {
    id: 'business-registration',
    title: 'Business Registration',
    titleHindi: 'व्यापार पंजीकरण',
    description: 'Register your business legally and obtain necessary licenses',
    descriptionHindi: 'अपने व्यापार को कानूनी रूप से पंजीकृत करें और आवश्यक लाइसेंस प्राप्त करें',
    timeframe: 'Week 3-4',
    cost: 15000,
    dependencies: ['idea-validation']
  },
  {
    id: 'mvp-development',
    title: 'MVP Development',
    titleHindi: 'एमवीपी विकास',
    description: 'Build a minimum viable product to test with early customers',
    descriptionHindi: 'प्रारंभिक ग्राहकों के साथ परीक्षण के लिए न्यूनतम व्यवहार्य उत्पाद बनाएं',
    timeframe: 'Week 5-8',
    cost: 50000,
    dependencies: ['business-registration']
  },
  {
    id: 'launch',
    title: 'Launch & Marketing',
    titleHindi: 'लॉन्च और मार्केटिंग',
    description: 'Launch your product and execute marketing strategy',
    descriptionHindi: 'अपना उत्पाद लॉन्च करें और मार्केटिंग रणनीति को क्रियान्वित करें',
    timeframe: 'Week 9-12',
    cost: 25000,
    dependencies: ['mvp-development']
  }
];