export interface Question {
  id: string;
  text: string;
  textHindi?: string;
  type: 'yes-no' | 'rating' | 'multiple-choice';
  options?: string[];
  weight: number;
}

export interface Industry {
  id: string;
  name: string;
  nameHindi?: string;
  icon: string;
  questions: Question[];
}

export interface BusinessFunction {
  id: string;
  name: string;
  nameHindi?: string;
  icon: string;
  questions: Question[];
}

export interface Assessment {
  industry: string;
  businessFunction: string;
  industryAnswers: Record<string, any>;
  functionAnswers: Record<string, any>;
  scores: {
    overall: number;
    industry: number;
    function: number;
  };
  recommendations: string[];
}

export const industries: Industry[] = [
  {
    id: 'retail',
    name: 'Retail',
    nameHindi: 'खुदरा व्यापार',
    icon: '🛍️',
    questions: [
      {
        id: 'r1',
        text: 'Do you track your daily sales and stock?',
        textHindi: 'क्या आप अपनी दैनिक बिक्री और स्टॉक को ट्रैक करते हैं?',
        type: 'yes-no',
        weight: 10
      },
      {
        id: 'r2',
        text: 'Do you have repeat customers?',
        textHindi: 'क्या आपके पास नियमित ग्राहक हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 'r3',
        text: 'Is your store visible on Google Maps?',
        textHindi: 'क्या आपकी दुकान Google Maps पर दिखाई देती है?',
        type: 'yes-no',
        weight: 6
      },
      {
        id: 'r4',
        text: 'Do you accept digital payments?',
        textHindi: 'क्या आप डिजिटल पेमेंट स्वीकार करते हैं?',
        type: 'yes-no',
        weight: 7
      },
      {
        id: 'r5',
        text: 'Do you have a system to prevent theft and losses?',
        textHindi: 'क्या आपके पास चोरी और नुकसान को रोकने का सिस्टम है?',
        type: 'yes-no',
        weight: 9
      }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    nameHindi: 'विनिर्माण',
    icon: '🏭',
    questions: [
      {
        id: 'm1',
        text: 'Do you track production cost per unit?',
        textHindi: 'क्या आप प्रति यूनिट उत्पादन लागत को ट्रैक करते हैं?',
        type: 'yes-no',
        weight: 10
      },
      {
        id: 'm2',
        text: 'Do you have a system to reduce waste?',
        textHindi: 'क्या आपके पास कचरा कम करने का सिस्टम है?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 'm3',
        text: 'Do you deliver products on time?',
        textHindi: 'क्या आप समय पर प्रोडक्ट डिलीवर करते हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 'm4',
        text: 'Do you check quality before shipping?',
        textHindi: 'क्या आप शिपिंग से पहले गुणवत्ता की जांच करते हैं?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 'm5',
        text: 'Do you maintain equipment regularly?',
        textHindi: 'क्या आप नियमित रूप से मशीनों की देखभाल करते हैं?',
        type: 'yes-no',
        weight: 8
      }
    ]
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    nameHindi: 'खाद्य और पेय',
    icon: '🍽️',
    questions: [
      {
        id: 'f1',
        text: 'Do you follow food safety standards?',
        textHindi: 'क्या आप खाद्य सुरक्षा मानकों का पालन करते हैं?',
        type: 'yes-no',
        weight: 10
      },
      {
        id: 'f2',
        text: 'Do you track ingredient costs daily?',
        textHindi: 'क्या आप रोज सामग्री की लागत को ट्रैक करते हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 'f3',
        text: 'Do you have a food license?',
        textHindi: 'क्या आपके पास खाद्य लाइसेंस है?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 'f4',
        text: 'Do you get customer feedback regularly?',
        textHindi: 'क्या आप नियमित रूप से ग्राहकों की प्रतिक्रिया लेते हैं?',
        type: 'yes-no',
        weight: 7
      },
      {
        id: 'f5',
        text: 'Do you manage food waste properly?',
        textHindi: 'क्या आप खाद्य अपशिष्ट का सही प्रबंधन करते हैं?',
        type: 'yes-no',
        weight: 6
      }
    ]
  }
];

export const businessFunctions: BusinessFunction[] = [
  {
    id: 'sales',
    name: 'Sales',
    nameHindi: 'बिक्री',
    icon: '📈',
    questions: [
      {
        id: 's1',
        text: 'Do you have a sales target for each month?',
        textHindi: 'क्या आपका हर महीने का बिक्री लक्ष्य है?',
        type: 'yes-no',
        weight: 10
      },
      {
        id: 's2',
        text: 'Do you track conversion rate?',
        textHindi: 'क्या आप कन्वर्जन रेट को ट्रैक करते हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 's3',
        text: 'Do you follow up with potential customers?',
        textHindi: 'क्या आप संभावित ग्राहकों से फॉलो अप करते हैं?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 's4',
        text: 'Do you offer discounts or promotions?',
        textHindi: 'क्या आप छूट या प्रमोशन देते हैं?',
        type: 'yes-no',
        weight: 6
      },
      {
        id: 's5',
        text: 'Do you know your best-selling products?',
        textHindi: 'क्या आप अपने सबसे ज्यादा बिकने वाले प्रोडक्ट्स को जानते हैं?',
        type: 'yes-no',
        weight: 7
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    nameHindi: 'मार्केटिंग',
    icon: '📢',
    questions: [
      {
        id: 'mk1',
        text: 'Do you use social media to promote your products?',
        textHindi: 'क्या आप अपने प्रोडक्ट्स को बढ़ावा देने के लिए सोशल मीडिया का इस्तेमाल करते हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 'mk2',
        text: 'Do you have a budget for marketing?',
        textHindi: 'क्या आपका मार्केटिंग के लिए बजट है?',
        type: 'yes-no',
        weight: 7
      },
      {
        id: 'mk3',
        text: 'Do you know your target customers?',
        textHindi: 'क्या आप अपने टारगेट कस्टमर्स को जानते हैं?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 'mk4',
        text: 'Do you collect customer reviews?',
        textHindi: 'क्या आप कस्टमर रिव्यू लेते हैं?',
        type: 'yes-no',
        weight: 6
      },
      {
        id: 'mk5',
        text: 'Do you track which marketing brings most customers?',
        textHindi: 'क्या आप ट्रैक करते हैं कि कौन सी मार्केटिंग से सबसे ज्यादा कस्टमर आते हैं?',
        type: 'yes-no',
        weight: 8
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    nameHindi: 'वित्त',
    icon: '💰',
    questions: [
      {
        id: 'fin1',
        text: 'Do you maintain proper accounting records?',
        textHindi: 'क्या आप सही तरीके से हिसाब-किताब रखते हैं?',
        type: 'yes-no',
        weight: 10
      },
      {
        id: 'fin2',
        text: 'Do you know your monthly profit and loss?',
        textHindi: 'क्या आप अपना मासिक लाभ और हानि जानते हैं?',
        type: 'yes-no',
        weight: 9
      },
      {
        id: 'fin3',
        text: 'Do you pay taxes on time?',
        textHindi: 'क्या आप समय पर टैक्स देते हैं?',
        type: 'yes-no',
        weight: 8
      },
      {
        id: 'fin4',
        text: 'Do you have separate business and personal accounts?',
        textHindi: 'क्या आपके अलग बिजनेस और व्यक्तिगत खाते हैं?',
        type: 'yes-no',
        weight: 7
      },
      {
        id: 'fin5',
        text: 'Do you plan for future investments?',
        textHindi: 'क्या आप भविष्य के निवेश की योजना बनाते हैं?',
        type: 'yes-no',
        weight: 6
      }
    ]
  }
];