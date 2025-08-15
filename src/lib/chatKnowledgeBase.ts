// Business Knowledge Base for Rule-Based AI Chat
export interface BusinessProblem {
  id: string;
  keywords: string[];
  category: 'sales' | 'marketing' | 'operations' | 'finance' | 'hr' | 'general';
  problem: {
    en: string;
    hi: string;
  };
  solution: {
    en: string;
    hi: string;
  };
  actionSteps: {
    en: string[];
    hi: string[];
  };
  industrySpecific?: string[];
}

export interface ConversationFlow {
  id: string;
  trigger: string[];
  questions: {
    en: string[];
    hi: string[];
  };
  followUp: string[];
}

export const businessProblems: BusinessProblem[] = [
  {
    id: 'low-sales',
    keywords: ['sales', 'revenue', 'income', 'कम बिक्री', 'आमदनी', 'सेल्स'],
    category: 'sales',
    problem: {
      en: 'Low sales and revenue generation',
      hi: 'कम बिक्री और आमदनी की समस्या'
    },
    solution: {
      en: 'Focus on customer retention, improve product quality, and enhance marketing efforts',
      hi: 'ग्राहक बनाए रखने पर ध्यान दें, उत्पाद की गुणवत्ता सुधारें, और मार्केटिंग बढ़ाएं'
    },
    actionSteps: {
      en: [
        'Analyze your top 10 customers and understand why they buy from you',
        'Create customer feedback forms to understand their needs',
        'Offer referral incentives to existing customers',
        'Use WhatsApp Business to stay connected with customers',
        'Create simple promotional offers for slow-moving products'
      ],
      hi: [
        'अपने टॉप 10 ग्राहकों का विश्लेषण करें और समझें कि वे आपसे क्यों खरीदते हैं',
        'ग्राहकों की जरूरतें समझने के लिए फीडबैक फॉर्म बनाएं',
        'मौजूदा ग्राहकों को रेफरल इंसेंटिव दें',
        'ग्राहकों से जुड़े रहने के लिए WhatsApp Business का उपयोग करें',
        'धीमी चलने वाले उत्पादों के लिए सरल प्रमोशनल ऑफर बनाएं'
      ]
    }
  },
  {
    id: 'cash-flow',
    keywords: ['cash', 'money', 'payment', 'पैसा', 'कैश', 'भुगतान', 'cash flow'],
    category: 'finance',
    problem: {
      en: 'Cash flow management issues',
      hi: 'कैश फ्लो प्रबंधन की समस्या'
    },
    solution: {
      en: 'Implement better payment collection and inventory management',
      hi: 'बेहतर भुगतान संग्रह और इन्वेंटरी प्रबंधन लागू करें'
    },
    actionSteps: {
      en: [
        'Create a daily cash flow tracker in Excel or notebook',
        'Follow up on pending payments weekly',
        'Offer small discounts for advance payments',
        'Reduce inventory of slow-moving items',
        'Negotiate extended payment terms with suppliers'
      ],
      hi: [
        'Excel या नोटबुक में दैनिक कैश फ्लो ट्रैकर बनाएं',
        'लंबित भुगतान पर साप्ताहिक फॉलो-अप करें',
        'अग्रिम भुगतान के लिए छोटी छूट दें',
        'धीमी चलने वाली वस्तुओं का स्टॉक कम करें',
        'आपूर्तिकर्ताओं के साथ विस्तारित भुगतान शर्तों पर बातचीत करें'
      ]
    }
  },
  {
    id: 'marketing',
    keywords: ['marketing', 'promotion', 'advertising', 'मार्केटिंग', 'प्रचार', 'विज्ञापन'],
    category: 'marketing',
    problem: {
      en: 'Need better marketing and customer reach',
      hi: 'बेहतर मार्केटिंग और ग्राहक पहुंच की जरूरत'
    },
    solution: {
      en: 'Use low-cost digital marketing and local networking',
      hi: 'कम लागत वाली डिजिटल मार्केटिंग और स्थानीय नेटवर्किंग का उपयोग करें'
    },
    actionSteps: {
      en: [
        'Create Google My Business profile for free local visibility',
        'Use WhatsApp Status to showcase products daily',
        'Join local business WhatsApp groups',
        'Partner with complementary businesses for cross-promotion',
        'Create simple flyers for door-to-door distribution'
      ],
      hi: [
        'मुफ्त स्थानीय दृश्यता के लिए Google My Business प्रोफाइल बनाएं',
        'दैनिक उत्पादों को दिखाने के लिए WhatsApp Status का उपयोग करें',
        'स्थानीय व्यापारिक WhatsApp समूहों में शामिल हों',
        'क्रॉस-प्रमोशन के लिए पूरक व्यवसायों के साथ साझेदारी करें',
        'घर-घर वितरण के लिए सरल फ्लायर बनाएं'
      ]
    }
  },
  {
    id: 'competition',
    keywords: ['competition', 'competitor', 'market share', 'प्रतिस्पर्धा', 'प्रतियोगी'],
    category: 'general',
    problem: {
      en: 'Dealing with strong competition',
      hi: 'कड़ी प्रतिस्पर्धा से निपटना'
    },
    solution: {
      en: 'Focus on unique value proposition and customer service',
      hi: 'अनोखे मूल्य प्रस्ताव और ग्राहक सेवा पर ध्यान दें'
    },
    actionSteps: {
      en: [
        'List 3 things that make your business different from competitors',
        'Improve customer service response time',
        'Offer personalized service that big competitors cannot',
        'Focus on a specific niche market',
        'Build strong relationships with your regular customers'
      ],
      hi: [
        '3 चीजें सूचीबद्ध करें जो आपके व्यवसाय को प्रतियोगियों से अलग बनाती हैं',
        'ग्राहक सेवा की प्रतिक्रिया समय में सुधार करें',
        'व्यक्तिगत सेवा प्रदान करें जो बड़े प्रतियोगी नहीं कर सकते',
        'एक विशिष्ट नiche बाजार पर ध्यान दें',
        'अपने नियमित ग्राहकों के साथ मजबूत रिश्ते बनाएं'
      ]
    }
  },
  {
    id: 'team-management',
    keywords: ['employee', 'staff', 'team', 'कर्मचारी', 'टीम', 'स्टाफ'],
    category: 'hr',
    problem: {
      en: 'Team management and employee motivation',
      hi: 'टीम प्रबंधन और कर्मचारी प्रेरणा'
    },
    solution: {
      en: 'Implement clear communication and recognition systems',
      hi: 'स्पष्ट संचार और पहचान प्रणाली लागू करें'
    },
    actionSteps: {
      en: [
        'Hold weekly 15-minute team meetings',
        'Recognize good performance publicly',
        'Set clear daily and weekly targets',
        'Create a suggestion box for employee ideas',
        'Provide small incentives for achieving targets'
      ],
      hi: [
        'साप्ताहिक 15 मिनट की टीम मीटिंग करें',
        'अच्छे प्रदर्शन को सार्वजनिक रूप से पहचानें',
        'स्पष्ट दैनिक और साप्ताहिक लक्ष्य निर्धारित करें',
        'कर्मचारी विचारों के लिए सुझाव बॉक्स बनाएं',
        'लक्ष्य प्राप्त करने के लिए छोटे प्रोत्साहन प्रदान करें'
      ]
    }
  },
  {
    id: 'operations',
    keywords: ['process', 'efficiency', 'operations', 'प्रक्रिया', 'दक्षता', 'संचालन'],
    category: 'operations',
    problem: {
      en: 'Operational efficiency and process improvement',
      hi: 'परिचालन दक्षता और प्रक्रिया सुधार'
    },
    solution: {
      en: 'Streamline processes and eliminate waste',
      hi: 'प्रक्रियाओं को सुव्यवस्थित करें और बर्बादी को खत्म करें'
    },
    actionSteps: {
      en: [
        'Map out your current business processes on paper',
        'Identify 3 biggest time-wasters in daily operations',
        'Create standard operating procedures for repetitive tasks',
        'Use mobile apps for inventory tracking',
        'Implement 5S workplace organization method'
      ],
      hi: [
        'कागज पर अपनी वर्तमान व्यापारिक प्रक्रियाओं का नक्शा बनाएं',
        'दैनिक संचालन में 3 सबसे बड़े समय बर्बाद करने वालों की पहचान करें',
        'दोहराए जाने वाले कार्यों के लिए मानक संचालन प्रक्रियाएं बनाएं',
        'इन्वेंटरी ट्रैकिंग के लिए मोबाइल ऐप्स का उपयोग करें',
        '5S कार्यक्षेत्र संगठन पद्धति लागू करें'
      ]
    }
  }
];

export const conversationFlows: ConversationFlow[] = [
  {
    id: 'business-assessment',
    trigger: ['help', 'problem', 'issue', 'समस्या', 'मदद'],
    questions: {
      en: [
        'What is the main challenge your business is facing right now?',
        'How long have you been experiencing this issue?',
        'What have you already tried to solve this problem?'
      ],
      hi: [
        'अभी आपके व्यवसाय की मुख्य चुनौती क्या है?',
        'आप कितने समय से इस समस्या का सामना कर रहे हैं?',
        'इस समस्या को हल करने के लिए आपने क्या कोशिश की है?'
      ]
    },
    followUp: ['sales', 'marketing', 'operations', 'finance', 'hr']
  },
  {
    id: 'growth-planning',
    trigger: ['grow', 'expand', 'plan', 'बढ़ना', 'विस्तार', 'योजना'],
    questions: {
      en: [
        'What are your business goals for the next 6 months?',
        'What resources do you have available for growth?',
        'What is your current monthly revenue range?'
      ],
      hi: [
        'अगले 6 महीनों के लिए आपके व्यावसायिक लक्ष्य क्या हैं?',
        'विकास के लिए आपके पास कौन से संसाधन उपलब्ध हैं?',
        'आपकी वर्तमान मासिक आय की सीमा क्या है?'
      ]
    },
    followUp: ['marketing', 'operations', 'finance']
  }
];

export const quickSuggestions = {
  en: [
    'Create a 30-day action plan',
    'Improve cash flow',
    'Boost sales with low budget',
    'Reduce operational costs',
    'Better customer retention',
    'Digital marketing strategy'
  ],
  hi: [
    '30 दिनों की एक्शन प्लान बनाएं',
    'कैश फ्लो बेहतर करें',
    'कम बजट में सेल्स बढ़ाएं',
    'परिचालन लागत कम करें',
    'बेहतर ग्राहक बनाए रखना',
    'डिजिटल मार्केटिंग रणनीति'
  ]
};