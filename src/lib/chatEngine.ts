import { businessProblems, conversationFlows, quickSuggestions, BusinessProblem, ConversationFlow } from './chatKnowledgeBase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatContext {
  industry?: string;
  businessFunction?: string;
  language: 'en' | 'hi';
  previousMessages: ChatMessage[];
  currentTopic?: string;
  assessmentData?: any;
}

export class RuleBasedChatEngine {
  private context: ChatContext;

  constructor(context: ChatContext) {
    this.context = context;
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }

  private findMatchingProblems(input: string): BusinessProblem[] {
    const normalizedInput = this.normalizeText(input);
    
    return businessProblems.filter(problem => 
      problem.keywords.some(keyword => 
        normalizedInput.includes(this.normalizeText(keyword))
      )
    ).sort((a, b) => {
      // Prioritize by number of matching keywords
      const aMatches = a.keywords.filter(k => normalizedInput.includes(this.normalizeText(k))).length;
      const bMatches = b.keywords.filter(k => normalizedInput.includes(this.normalizeText(k))).length;
      return bMatches - aMatches;
    });
  }

  private findMatchingFlow(input: string): ConversationFlow | null {
    const normalizedInput = this.normalizeText(input);
    
    return conversationFlows.find(flow =>
      flow.trigger.some(trigger => 
        normalizedInput.includes(this.normalizeText(trigger))
      )
    ) || null;
  }

  private generateActionPlan(language: 'en' | 'hi'): string {
    const planSteps = language === 'hi' ? [
      '🎯 सप्ताह 1-2: वर्तमान स्थिति का विश्लेषण',
      '• अपने टॉप 10 ग्राहकों की सूची बनाएं',
      '• पिछले 3 महीने की बिक्री का डेटा इकट्ठा करें',
      '• मुख्य प्रतियोगियों की पहचान करें',
      '',
      '📈 सप्ताह 3-4: तत्काल सुधार',
      '• Google My Business प्रोफाइल बनाएं/अपडेट करें',
      '• WhatsApp Business सेटअप करें',
      '• ग्राहकों से फीडबैक लेना शुरू करें',
      '',
      '🚀 सप्ताह 5-8: विकास रणनीति',
      '• रेफरल प्रोग्राम शुरू करें',
      '• सोशल मीडिया पर नियमित पोस्टिंग',
      '• नए उत्पाद/सेवा लॉन्च की योजना',
      '',
      '💰 सप्ताह 9-12: स्केलिंग',
      '• सफल रणनीतियों को दोहराएं',
      '• नए बाजार खंडों को लक्षित करें',
      '• टीम विस्तार की योजना बनाएं'
    ] : [
      '🎯 Week 1-2: Current Situation Analysis',
      '• List your top 10 customers',
      '• Gather sales data from last 3 months',
      '• Identify main competitors',
      '',
      '📈 Week 3-4: Immediate Improvements',
      '• Create/update Google My Business profile',
      '• Setup WhatsApp Business',
      '• Start collecting customer feedback',
      '',
      '🚀 Week 5-8: Growth Strategy',
      '• Launch referral program',
      '• Regular social media posting',
      '• Plan new product/service launch',
      '',
      '💰 Week 9-12: Scaling',
      '• Repeat successful strategies',
      '• Target new market segments',
      '• Plan team expansion'
    ];

    return planSteps.join('\n');
  }

  private getContextualResponse(language: 'en' | 'hi'): string {
    if (!this.context.assessmentData) {
      return language === 'hi' 
        ? 'मैं आपके व्यवसाय को बेहतर बनाने में मदद कर सकता हूं। कृपया बताएं कि आपकी मुख्य चुनौती क्या है?'
        : 'I can help improve your business. Please tell me what your main challenge is?';
    }

    const { industry, businessFunction, scores } = this.context.assessmentData;
    
    if (language === 'hi') {
      return `आपके ${industry} व्यवसाय के ${businessFunction} function में सुधार के लिए मैं यहाँ हूँ। आपकी वर्तमान स्कोर के अनुसार, मैं व्यावहारिक सुझाव दे सकता हूं। आप किस विशिष्ट क्षेत्र में मदद चाहते हैं?`;
    } else {
      return `I'm here to help improve your ${industry} business, specifically in ${businessFunction}. Based on your current scores, I can provide practical suggestions. Which specific area would you like help with?`;
    }
  }

  public generateResponse(userInput: string): string {
    const language = this.context.language;
    
    // Check for greeting
    if (/^(hi|hello|हैलो|नमस्ते|hey)$/i.test(userInput.trim())) {
      return this.getContextualResponse(language);
    }

    // Check for action plan request
    if (this.normalizeText(userInput).includes('action plan') || this.normalizeText(userInput).includes('एक्शन प्लान')) {
      const intro = language === 'hi' 
        ? '📋 आपके लिए 30-दिन की व्यावसायिक एक्शन प्लान:\n\n'
        : '📋 Here\'s your 30-day business action plan:\n\n';
      return intro + this.generateActionPlan(language);
    }

    // Find matching problems
    const matchingProblems = this.findMatchingProblems(userInput);
    
    if (matchingProblems.length > 0) {
      const problem = matchingProblems[0];
      const response = [
        `💡 ${problem.solution[language]}\n`,
        `📝 ${language === 'hi' ? 'तत्काल कार्य योजना:' : 'Immediate Action Plan:'}\n`,
        ...problem.actionSteps[language].map((step, index) => `${index + 1}. ${step}`)
      ].join('\n');
      
      // Add contextual suggestions
      const suggestions = language === 'hi' 
        ? '\n\n🤔 और मदद चाहिए? पूछें:\n• "कैश फ्लो कैसे बेहतर करें?"\n• "मार्केटिंग बजट कम कैसे करें?"\n• "ग्राहक कैसे बनाए रखें?"'
        : '\n\n🤔 Need more help? Ask:\n• "How to improve cash flow?"\n• "How to reduce marketing budget?"\n• "How to retain customers?"';
      
      return response + suggestions;
    }

    // Check for conversation flows
    const flow = this.findMatchingFlow(userInput);
    if (flow) {
      const questions = flow.questions[language];
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      return `🤔 ${randomQuestion}`;
    }

    // Default helpful response
    const defaultResponses = {
      hi: [
        '🤔 मैं समझ गया कि आप व्यावसायिक सहायता चाहते हैं। कृपया अधिक विशिष्ट बताएं:',
        '• बिक्री और आमदनी की समस्या',
        '• मार्केटिंग और प्रचार',
        '• कैश फ्लो प्रबंधन',
        '• टीम मैनेजमेंट',
        '• प्रतिस्पर्धा से निपटना',
        '',
        'या फिर "30 दिनों की एक्शन प्लान बनाएं" लिखें।'
      ],
      en: [
        '🤔 I understand you need business help. Please be more specific about:',
        '• Sales and revenue issues',
        '• Marketing and promotion',
        '• Cash flow management',
        '• Team management',
        '• Dealing with competition',
        '',
        'Or simply type "Create a 30-day action plan".'
      ]
    };

    return defaultResponses[language].join('\n');
  }

  public getQuickSuggestions(): string[] {
    return quickSuggestions[this.context.language];
  }

  public updateContext(newContext: Partial<ChatContext>): void {
    this.context = { ...this.context, ...newContext };
  }
}