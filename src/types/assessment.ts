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
    name: 'Retail Shop',
    nameHindi: 'खुदरा दुकान',
    icon: '',
    questions: [
      { id: 'r1', text: 'Do you track your daily sales and stock?', textHindi: 'क्या आप अपनी दैनिक बिक्री और स्टॉक को ट्रैक करते हैं?', type: 'yes-no', weight: 10 },
      { id: 'r2', text: 'Do you have repeat customers?', textHindi: 'क्या आपके पास नियमित ग्राहक हैं?', type: 'yes-no', weight: 8 },
      { id: 'r3', text: 'Is your store visible on Google Maps?', textHindi: 'क्या आपकी दुकान Google Maps पर दिखाई देती है?', type: 'yes-no', weight: 8 },
      { id: 'r4', text: 'Do you accept digital payments?', textHindi: 'क्या आप डिजिटल भुगतान स्वीकार करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'r5', text: 'Do you have a system to prevent theft and losses?', textHindi: 'क्या आपके पास चोरी और नुकसान को रोकने का सिस्टम है?', type: 'yes-no', weight: 9 },
      { id: 'r6', text: 'Do you maintain records of suppliers and purchases?', textHindi: 'क्या आप सप्लायर और खरीद के रिकॉर्ड रखते हैं?', type: 'yes-no', weight: 7 },
      { id: 'r7', text: 'Do you run weekly or monthly offers to boost sales?', textHindi: 'क्या आप बिक्री बढ़ाने के लिए साप्ताहिक या मासिक ऑफर चलाते हैं?', type: 'yes-no', weight: 6 },
      { id: 'r8', text: 'Do you track top-selling SKUs and slow movers?', textHindi: 'क्या आप सबसे ज्यादा बिकने वाले और धीमे चलने वाले उत्पादों को ट्रैक करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'r9', text: 'Do you use a billing/POS system?', textHindi: 'क्या आप बिलिंग/पीओएस सिस्टम का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'r10', text: 'Do you record and resolve customer complaints?', textHindi: 'क्या आप ग्राहक शिकायतों को रिकॉर्ड करते हैं और उनका समाधान करते हैं?', type: 'yes-no', weight: 7 }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    nameHindi: 'विनिर्माण',
    icon: '',
    questions: [
      { id: 'm1', text: 'Do you track production cost per unit?', textHindi: 'क्या आप प्रति यूनिट उत्पादन लागत को ट्रैक करते हैं?', type: 'yes-no', weight: 10 },
      { id: 'm2', text: 'Do you have a system to reduce waste?', textHindi: 'क्या आपके पास कचरा कम करने का सिस्टम है?', type: 'yes-no', weight: 9 },
      { id: 'm3', text: 'Do you deliver products on time?', textHindi: 'क्या आप समय पर उत्पाद डिलीवर करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'm4', text: 'Do you check quality before shipping?', textHindi: 'क्या आप शिपिंग से पहले गुणवत्ता की जांच करते हैं?', type: 'yes-no', weight: 9 },
      { id: 'm5', text: 'Do you maintain equipment regularly?', textHindi: 'क्या आप नियमित रूप से मशीनों की देखभाल करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'm6', text: 'Do you have safety protocols for workers?', textHindi: 'क्या आपके पास श्रमिकों के लिए सुरक्षा नियम हैं?', type: 'yes-no', weight: 8 },
      { id: 'm7', text: 'Do you track raw material inventory accurately?', textHindi: 'क्या आप कच्चे माल की इन्वेंट्री को सही तरीके से ट्रैक करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'm8', text: 'Do you follow a production planning schedule?', textHindi: 'क्या आप उत्पादन योजना अनुसूची का पालन करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'm9', text: 'Do you track supplier lead times and delays?', textHindi: 'क्या आप सप्लायर लीड टाइम और देरी को ट्रैक करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'm10', text: 'Do you have a backup power/contingency plan?', textHindi: 'क्या आपके पास बैकअप पावर/आकस्मिक योजना है?', type: 'yes-no', weight: 6 }
    ]
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverage',
    nameHindi: 'खाद्य और पेय',
    icon: '',
    questions: [
      { id: 'f1', text: 'Do you follow food safety standards?', textHindi: 'क्या आप खाद्य सुरक्षा मानकों का पालन करते हैं?', type: 'yes-no', weight: 10 },
      { id: 'f2', text: 'Do you track ingredient costs daily?', textHindi: 'क्या आप रोज सामग्री की लागत को ट्रैक करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'f3', text: 'Do you have a valid food license?', textHindi: 'क्या आपके पास वैध खाद्य लाइसेंस है?', type: 'yes-no', weight: 9 },
      { id: 'f4', text: 'Do you collect customer feedback regularly?', textHindi: 'क्या आप नियमित रूप से ग्राहकों की प्रतिक्रिया लेते हैं?', type: 'yes-no', weight: 7 },
      { id: 'f5', text: 'Do you manage food waste properly?', textHindi: 'क्या आप खाद्य अपशिष्ट का सही प्रबंधन करते हैं?', type: 'yes-no', weight: 6 },
      { id: 'f6', text: 'Do you follow a kitchen hygiene checklist daily?', textHindi: 'क्या आप रोजाना किचन हाइजीन चेकलिस्ट का पालन करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'f7', text: 'Do you maintain temperature logs for storage?', textHindi: 'क्या आप भंडारण के लिए तापमान लॉग रखते हैं?', type: 'yes-no', weight: 8 },
      { id: 'f8', text: 'Do you use standard recipes and portion control?', textHindi: 'क्या आप मानक रेसिपी और पोर्शन कंट्रोल का उपयोग करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'f9', text: 'Do you check delivery and packaging quality?', textHindi: 'क्या आप डिलीवरी और पैकेजिंग की गुणवत्ता की जांच करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'f10', text: 'Do you train staff on hygiene and safety?', textHindi: 'क्या आप स्टाफ को हाइजीन और सुरक्षा पर प्रशिक्षण देते हैं?', type: 'yes-no', weight: 8 }
    ]
  },
  {
    id: 'service',
    name: 'Service Business',
    nameHindi: 'सेवा व्यवसाय',
    icon: '',
    questions: [
      { id: 'svc1', text: 'Do you have written service packages and pricing?', textHindi: 'क्या आपके पास लिखित सेवा पैकेज और कीमतें हैं?', type: 'yes-no', weight: 8 },
      { id: 'svc2', text: 'Do you use an appointment or booking system?', textHindi: 'क्या आप अपॉइंटमेंट या बुकिंग सिस्टम का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'svc3', text: 'Do you collect customer feedback after service?', textHindi: 'क्या आप सेवा के बाद ग्राहक प्रतिक्रिया लेते हैं?', type: 'yes-no', weight: 7 },
      { id: 'svc4', text: 'Are service delivery timelines clearly defined?', textHindi: 'क्या सेवा डिलीवरी की समय-सीमाएँ स्पष्ट रूप से परिभाषित हैं?', type: 'yes-no', weight: 7 },
      { id: 'svc5', text: 'Do you track repeat clients and referrals?', textHindi: 'क्या आप दोबारा आने वाले क्लाइंट और रेफरल्स को ट्रैक करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'svc6', text: 'Do you use written contracts/agreements?', textHindi: 'क्या आप लिखित अनुबंध/एग्रीमेंट का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'svc7', text: 'Do you follow-up with clients after service?', textHindi: 'क्या आप सेवा के बाद ग्राहकों से फॉलो-अप करते हैं?', type: 'yes-no', weight: 6 },
      { id: 'svc8', text: 'Do you have a complaints resolution process?', textHindi: 'क्या आपके पास शिकायत समाधान की प्रक्रिया है?', type: 'yes-no', weight: 7 },
      { id: 'svc9', text: 'Do you maintain a digital presence (website/social)?', textHindi: 'क्या आपकी डिजिटल उपस्थिति (वेबसाइट/सोशल) है?', type: 'yes-no', weight: 6 },
      { id: 'svc10', text: 'Do you use a simple CRM to track leads?', textHindi: 'क्या आप लीड ट्रैक करने के लिए सरल सीआरएम का उपयोग करते हैं?', type: 'yes-no', weight: 7 }
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Farming',
    nameHindi: 'कृषि और खेती',
    icon: '',
    questions: [
      { id: 'agr1', text: 'Do you follow a crop planning calendar?', textHindi: 'क्या आप फसल योजना कैलेंडर का पालन करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'agr2', text: 'Do you conduct regular soil testing?', textHindi: 'क्या आप नियमित मिट्टी परीक्षण करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'agr3', text: 'Do you have a fixed irrigation schedule?', textHindi: 'क्या आपके पास तय सिंचाई कार्यक्रम है?', type: 'yes-no', weight: 7 },
      { id: 'agr4', text: 'Do you record input costs (seeds, fertilizer, labor)?', textHindi: 'क्या आप इनपुट लागत (बीज, खाद, मजदूरी) रिकॉर्ड करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'agr5', text: 'Do you monitor pests and diseases regularly?', textHindi: 'क्या आप नियमित रूप से कीट और रोगों की निगरानी करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'agr6', text: 'Do you have proper storage for harvested produce?', textHindi: 'क्या आपके पास कटाई के बाद उपज के लिए उचित भंडारण है?', type: 'yes-no', weight: 7 },
      { id: 'agr7', text: 'Do you sell through multiple channels to get better price?', textHindi: 'क्या आप बेहतर कीमत के लिए कई चैनलों से बिक्री करते हैं?', type: 'yes-no', weight: 6 },
      { id: 'agr8', text: 'Do you track yield per acre each season?', textHindi: 'क्या आप हर सीजन में प्रति एकड़ उत्पादन को ट्रैक करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'agr9', text: 'Do you have crop insurance?', textHindi: 'क्या आपके पास फसल बीमा है?', type: 'yes-no', weight: 8 },
      { id: 'agr10', text: 'Do you take training on new techniques?', textHindi: 'क्या आप नई तकनीकों पर प्रशिक्षण लेते हैं?', type: 'yes-no', weight: 6 }
    ]
  },
  {
    id: 'construction-realestate',
    name: 'Construction & Real Estate',
    nameHindi: 'निर्माण और रियल एस्टेट',
    icon: '',
    questions: [
      { id: 'con1', text: 'Do you maintain project timelines for each site?', textHindi: 'क्या आप प्रत्येक साइट के लिए परियोजना समय-रेखाएँ बनाए रखते हैं?', type: 'yes-no', weight: 8 },
      { id: 'con2', text: 'Do you track budget and BOQ against actuals?', textHindi: 'क्या आप बजट और बीओक्यू को वास्तविक खर्च के साथ ट्रैक करते हैं?', type: 'yes-no', weight: 9 },
      { id: 'con3', text: 'Do workers have safety gear and training?', textHindi: 'क्या श्रमिकों के पास सुरक्षा उपकरण और प्रशिक्षण है?', type: 'yes-no', weight: 9 },
      { id: 'con4', text: 'Are permits and approvals in place?', textHindi: 'क्या आवश्यक परमिट और अनुमोदन उपलब्ध हैं?', type: 'yes-no', weight: 8 },
      { id: 'con5', text: 'Do you have written vendor/subcontractor contracts?', textHindi: 'क्या आपके पास लिखित विक्रेता/उप-ठेकेदार अनुबंध हैं?', type: 'yes-no', weight: 8 },
      { id: 'con6', text: 'Do you track material inventory and wastage?', textHindi: 'क्या आप सामग्री इन्वेंट्री और बर्बादी को ट्रैक करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'con7', text: 'Do you monitor site progress weekly?', textHindi: 'क्या आप साइट की प्रगति साप्ताहिक रूप से मॉनिटर करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'con8', text: 'Do you use a quality checklist before handover?', textHindi: 'क्या आप हैंडओवर से पहले गुणवत्ता चेकलिस्ट का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'con9', text: 'Is client payment schedule linked to milestones?', textHindi: 'क्या ग्राहक भुगतान अनुसूची माइलस्टोन्स से जुड़ी है?', type: 'yes-no', weight: 8 },
      { id: 'con10', text: 'Do you have a defects liability/service process?', textHindi: 'क्या आपके पास दोष दायित्व/सेवा प्रक्रिया है?', type: 'yes-no', weight: 7 }
    ]
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    nameHindi: 'थोक और वितरण',
    icon: '',
    questions: [
      { id: 'wh1', text: 'Do you maintain SKU-wise inventory?', textHindi: 'क्या आप एसकेयू-वाइज इन्वेंट्री रखते हैं?', type: 'yes-no', weight: 9 },
      { id: 'wh2', text: 'Do you plan delivery routes efficiently?', textHindi: 'क्या आप डिलीवरी रूट्स को कुशलता से प्लान करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'wh3', text: 'Do you have a clear credit policy for buyers?', textHindi: 'क्या आपके पास खरीदारों के लिए स्पष्ट क्रेडिट नीति है?', type: 'yes-no', weight: 8 },
      { id: 'wh4', text: 'Do you track outstanding payments regularly?', textHindi: 'क्या आप बकाया भुगतान को नियमित रूप से ट्रैक करते हैं?', type: 'yes-no', weight: 9 },
      { id: 'wh5', text: 'Do you maintain minimum stock levels and reorder points?', textHindi: 'क्या आप न्यूनतम स्टॉक स्तर और रीऑर्डर पॉइंट्स बनाए रखते हैं?', type: 'yes-no', weight: 8 },
      { id: 'wh6', text: 'Do you maintain cold chain where required?', textHindi: 'जहाँ आवश्यक हो, क्या आप कोल्ड चेन बनाए रखते हैं?', type: 'yes-no', weight: 7 },
      { id: 'wh7', text: 'Is your warehouse safe and well-organized?', textHindi: 'क्या आपका वेयरहाउस सुरक्षित और सुव्यवस्थित है?', type: 'yes-no', weight: 7 },
      { id: 'wh8', text: 'Do you use barcodes or a labeling system?', textHindi: 'क्या आप बारकोड या लेबलिंग सिस्टम का उपयोग करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'wh9', text: 'Do you follow a vehicle maintenance schedule?', textHindi: 'क्या आप वाहन रखरखाव कार्यक्रम का पालन करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'wh10', text: 'Do you have a clear return/exchange policy?', textHindi: 'क्या आपकी स्पष्ट रिटर्न/एक्सचेंज नीति है?', type: 'yes-no', weight: 6 }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Online Selling',
    nameHindi: 'ई-कॉमर्स और ऑनलाइन बिक्री',
    icon: '',
    questions: [
      { id: 'ecom1', text: 'Are products listed with good photos and descriptions?', textHindi: 'क्या उत्पाद अच्छी फोटो और विवरण के साथ सूचीबद्ध हैं?', type: 'yes-no', weight: 9 },
      { id: 'ecom2', text: 'Are multiple payment options enabled?', textHindi: 'क्या कई भुगतान विकल्प सक्षम हैं?', type: 'yes-no', weight: 8 },
      { id: 'ecom3', text: 'Do customers receive order tracking notifications?', textHindi: 'क्या ग्राहकों को ऑर्डर ट्रैकिंग नोटिफिकेशन मिलते हैं?', type: 'yes-no', weight: 8 },
      { id: 'ecom4', text: 'Is your return/refund policy clearly defined?', textHindi: 'क्या आपकी रिटर्न/रिफंड नीति स्पष्ट रूप से परिभाषित है?', type: 'yes-no', weight: 8 },
      { id: 'ecom5', text: 'Do you run ads/SEO to drive store traffic?', textHindi: 'क्या आप स्टोर ट्रैफिक बढ़ाने के लिए विज्ञापन/SEO चलाते हैं?', type: 'yes-no', weight: 7 },
      { id: 'ecom6', text: 'Do you measure conversion rate and cart abandonment?', textHindi: 'क्या आप कन्वर्जन रेट और कार्ट परित्याग मापते हैं?', type: 'yes-no', weight: 7 },
      { id: 'ecom7', text: 'Do you reconcile marketplace settlements on time?', textHindi: 'क्या आप समय पर मार्केटप्लेस सेटलमेंट्स का मिलान करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'ecom8', text: 'Is inventory synced across all sales channels?', textHindi: 'क्या सभी बिक्री चैनलों में इन्वेंट्री सिंक है?', type: 'yes-no', weight: 8 },
      { id: 'ecom9', text: 'Do you provide customer support with SLAs?', textHindi: 'क्या आप एसएलए के साथ ग्राहक सहायता प्रदान करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'ecom10', text: 'Do you collect and respond to product reviews?', textHindi: 'क्या आप उत्पाद समीक्षाएँ एकत्र करते हैं और उनका जवाब देते हैं?', type: 'yes-no', weight: 6 }
    ]
  },
  {
    id: 'transport-logistics',
    name: 'Transport & Logistics',
    nameHindi: 'परिवहन और लॉजिस्टिक्स',
    icon: '',
    questions: [
      { id: 'trans1', text: 'Do you use GPS tracking for vehicles?', textHindi: 'क्या आप वाहनों के लिए जीपीएस ट्रैकिंग का उपयोग करते हैं?', type: 'yes-no', weight: 9 },
      { id: 'trans2', text: 'Do you plan trips and routes efficiently?', textHindi: 'क्या आप यात्राओं और मार्गों की कुशलता से योजना बनाते हैं?', type: 'yes-no', weight: 8 },
      { id: 'trans3', text: 'Are driver documents and compliances up to date?', textHindi: 'क्या ड्राइवर दस्तावेज़ और अनुपालन अद्यतन हैं?', type: 'yes-no', weight: 8 },
      { id: 'trans4', text: 'Do you follow a vehicle maintenance schedule?', textHindi: 'क्या आप वाहन रखरखाव अनुसूची का पालन करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'trans5', text: 'Do you track fuel consumption accurately?', textHindi: 'क्या आप ईंधन खपत को सही तरीके से ट्रैक करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'trans6', text: 'Do you measure on-time delivery performance?', textHindi: 'क्या आप समय पर डिलीवरी प्रदर्शन को मापते हैं?', type: 'yes-no', weight: 8 },
      { id: 'trans7', text: 'Is cargo insured as per requirement?', textHindi: 'क्या कार्गो आवश्यकता अनुसार बीमाकृत है?', type: 'yes-no', weight: 8 },
      { id: 'trans8', text: 'Do you collect Proof of Delivery (POD) reliably?', textHindi: 'क्या आप प्रूफ ऑफ डिलीवरी (POD) विश्वसनीय रूप से एकत्र करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'trans9', text: 'Do you optimize loads to reduce empty runs?', textHindi: 'क्या आप खाली दौड़ कम करने के लिए लोड का अनुकूलन करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'trans10', text: 'Do you have an emergency/incident response protocol?', textHindi: 'क्या आपके पास आपातकाल/घटना प्रतिक्रिया प्रोटोकॉल है?', type: 'yes-no', weight: 7 }
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    nameHindi: 'स्वास्थ्य और वेलनेस',
    icon: '',
    questions: [
      { id: 'health1', text: 'Do you have required certifications and licenses?', textHindi: 'क्या आपके पास आवश्यक प्रमाणपत्र और लाइसेंस हैं?', type: 'yes-no', weight: 9 },
      { id: 'health2', text: 'Do you use an appointment management system?', textHindi: 'क्या आप अपॉइंटमेंट प्रबंधन सिस्टम का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'health3', text: 'Do you maintain patient/client records securely?', textHindi: 'क्या आप मरीज/क्लाइंट रिकॉर्ड सुरक्षित रूप से रखते हैं?', type: 'yes-no', weight: 9 },
      { id: 'health4', text: 'Do you follow a hygiene and sanitation checklist?', textHindi: 'क्या आप स्वच्छता और सैनिटेशन चेकलिस्ट का पालन करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'health5', text: 'Are equipment calibrated and maintained regularly?', textHindi: 'क्या उपकरणों का नियमित रूप से अंशांकन और रखरखाव होता है?', type: 'yes-no', weight: 8 },
      { id: 'health6', text: 'Do you use consent forms and a privacy policy?', textHindi: 'क्या आप सहमति फॉर्म और गोपनीयता नीति का उपयोग करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'health7', text: 'Do you have a follow-up and reminder system?', textHindi: 'क्या आपके पास फॉलो-अप और रिमाइंडर सिस्टम है?', type: 'yes-no', weight: 7 },
      { id: 'health8', text: 'Do you track feedback and resolve complaints?', textHindi: 'क्या आप फीडबैक ट्रैक करते हैं और शिकायतों का समाधान करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'health9', text: 'Do you maintain inventory of medicines/consumables?', textHindi: 'क्या आप दवाइयों/उपभोग्य सामग्रियों की इन्वेंट्री बनाए रखते हैं?', type: 'yes-no', weight: 7 },
      { id: 'health10', text: 'Are you prepared for emergencies/first-aid?', textHindi: 'क्या आप आपातकाल/प्राथमिक उपचार के लिए तैयार हैं?', type: 'yes-no', weight: 8 }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    nameHindi: 'अन्य',
    icon: '',
    questions: [
      { id: 'oth1', text: 'Do you keep basic accounts for income and expenses?', textHindi: 'क्या आप आय और खर्चों का मूल लेखा रखते हैं?', type: 'yes-no', weight: 9 },
      { id: 'oth2', text: 'Do you separate business and personal finances?', textHindi: 'क्या आप व्यवसाय और व्यक्तिगत वित्त को अलग रखते हैं?', type: 'yes-no', weight: 8 },
      { id: 'oth3', text: 'Do you maintain records of customers and suppliers?', textHindi: 'क्या आप ग्राहकों और सप्लायर्स के रिकॉर्ड रखते हैं?', type: 'yes-no', weight: 8 },
      { id: 'oth4', text: 'Do you use digital payments and invoices?', textHindi: 'क्या आप डिजिटल भुगतान और इनवॉइस का उपयोग करते हैं?', type: 'yes-no', weight: 7 },
      { id: 'oth5', text: 'Do you comply with basic taxes and registrations?', textHindi: 'क्या आप बेसिक टैक्स और रजिस्ट्रेशन का पालन करते हैं?', type: 'yes-no', weight: 8 },
      { id: 'oth6', text: 'Do you track monthly sales, costs and profit?', textHindi: 'क्या आप मासिक बिक्री, लागत और लाभ को ट्रैक करते हैं?', type: 'yes-no', weight: 9 },
      { id: 'oth7', text: 'Do you have basic contracts/agreements where needed?', textHindi: 'जहाँ आवश्यक हो, क्या आपके पास बेसिक कॉन्ट्रैक्ट/एग्रीमेंट हैं?', type: 'yes-no', weight: 7 },
      { id: 'oth8', text: 'Do you have a simple marketing plan?', textHindi: 'क्या आपके पास एक सरल मार्केटिंग योजना है?', type: 'yes-no', weight: 6 },
      { id: 'oth9', text: 'Do you have a complaint and feedback process?', textHindi: 'क्या आपके पास शिकायत और फीडबैक प्रक्रिया है?', type: 'yes-no', weight: 6 },
      { id: 'oth10', text: 'Do you plan for future growth and investments?', textHindi: 'क्या आप भविष्य की वृद्धि और निवेश की योजना बनाते हैं?', type: 'yes-no', weight: 7 }
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