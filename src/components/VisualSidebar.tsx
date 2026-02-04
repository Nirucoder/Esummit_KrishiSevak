import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  Target,
  Satellite, 
  TrendingUp, 
  Lightbulb,
  Building2,
  MessageCircle, 
  Settings, 
  Menu,
  X,
  User,
  Users,
  HeadphonesIcon,
  WifiOff,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';
import { KrishiLogo } from './KrishiLogo';
import { getContent } from '../utils/languages';

interface VisualSidebarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  language: string;
}

// Visual menu items with agricultural icons and emojis
const getVisualMenuItems = (language: string) => {
  const menuTranslations: { [key: string]: any } = {
    en: {
      // Core Features (Primary)
      'dashboard': { label: 'Home', emoji: '🏠', desc: 'Main Dashboard' },
      'yield-prediction': { label: 'Crop Yield', emoji: '🌾', desc: 'Predict Harvest' },
      
      // Monitoring & Analysis
      'monitoring': { label: 'Farm Watch', emoji: '📡', desc: 'Monitor Fields' },
      'analytics': { label: 'Reports', emoji: '📊', desc: 'View Analytics' },
      
      // Tools & Services
      'recommendations': { label: 'AI Helper', emoji: '🤖', desc: 'Smart Tips' },
      'schemes': { label: 'Govt. Schemes', emoji: '🏛️', desc: 'Apply Benefits' },
      'aadhaar': { label: 'Aadhaar ID', emoji: '🆔', desc: 'Verify Identity' },
      'alerts': { label: 'Alerts', emoji: '📱', desc: 'WhatsApp Alerts' },
      
      // Community & Support
      'community': { label: 'Community', emoji: '👥', desc: 'Connect Farmers' },
      'feedback': { label: 'Feedback', emoji: '🎤', desc: 'Voice & Text' },
      'offline': { label: 'Offline Mode', emoji: '📡', desc: 'Sync Data' },
      
      // Account
      'settings': { label: 'Settings', emoji: '⚙️', desc: 'App Settings' }
    },
    hi: {
      'dashboard': { label: 'घर', emoji: '🏠', desc: 'मुख्य डैशबोर्ड' },
      'yield-prediction': { label: 'फसल उत्पादन', emoji: '🌾', desc: 'फसल का अनुमान' },
      'monitoring': { label: 'खेत निगरानी', emoji: '📡', desc: 'खेत देखें' },
      'analytics': { label: 'रिपोर्ट', emoji: '📊', desc: 'विश्लेषण देखें' },
      'recommendations': { label: 'AI सहायक', emoji: '🤖', desc: 'स्मार्ट सुझाव' },
      'schemes': { label: 'सरकारी योजना', emoji: '🏛️', desc: 'लाभ पाएं' },
      'aadhaar': { label: 'आधार कार्ड', emoji: '🆔', desc: 'पहचान सत्यापन' },
      'alerts': { label: 'अलर्ट', emoji: '📱', desc: 'व्हाट्सअप अलर्ट' },
      'community': { label: 'समुदाय', emoji: '👥', desc: 'किसान जुड़ाव' },
      'feedback': { label: 'फीडबैक', emoji: '🎤', desc: 'आवाज़ और टेक्स्ट' },
      'offline': { label: 'ऑफलाइन मोड', emoji: '📡', desc: 'डेटा सिंक' },
      'settings': { label: 'सेटिंग्स', emoji: '⚙️', desc: 'ऐप सेटिंग्स' }
    },
    mr: {
      'dashboard': { label: 'घर', emoji: '🏠', desc: 'मुख्य डॅशबोर्ड' },
      'yield-prediction': { label: 'पीक उत्पादन', emoji: '🌾', desc: 'पिकाचा अंदाज' },
      'monitoring': { label: 'शेत निरीक्षण', emoji: '📡', desc: 'शेत पहा' },
      'analytics': { label: 'अहवाल', emoji: '📊', desc: 'विश्लेषण पहा' },
      'recommendations': { label: 'AI सहाय्यक', emoji: '🤖', desc: 'हुशार सल्ला' },
      'schemes': { label: 'सरकारी योजना', emoji: '🏛️', desc: 'लाभ मिळवा' },
      'aadhaar': { label: 'आधार कार्ड', emoji: '🆔', desc: 'ओळख पडताळणी' },
      'alerts': { label: 'अलर्ट', emoji: '📱', desc: 'व्हाट्सअप अलर्ट' },
      'community': { label: 'समुदाय', emoji: '👥', desc: 'शेतकरी जोडणी' },
      'feedback': { label: 'फीडबॅक', emoji: '🎤', desc: 'आवाज आणि मजकूर' },
      'offline': { label: 'ऑफलाइन मोड', emoji: '📡', desc: 'डेटा सिंक' },
      'settings': { label: 'सेटिंग्ज', emoji: '⚙️', desc: 'अॅप सेटिंग्ज' }
    },
    ta: {
      'dashboard': { label: 'வீடு', emoji: '🏠', desc: 'முதன்மை டாஷ்போர்டு' },
      'yield-prediction': { label: 'பயிர் விளைச்சல்', emoji: '🌾', desc: 'அறுவடை கணிப்பு' },
      'monitoring': { label: 'பண்ணை கண்காணிப்பு', emoji: '📡', desc: 'வயல்கள் பார்க்க' },
      'analytics': { label: 'அறிக்கைகள்', emoji: '📊', desc: 'பகுப்பாய்வு பார்க்க' },
      'recommendations': { label: 'AI உதவியாளர்', emoji: '🤖', desc: 'புத்திசாலி ஆலோசனை' },
      'schemes': { label: 'அரசு திட்டங்கள்', emoji: '🏛️', desc: 'நலன்கள் பெறுக' },
      'aadhaar': { label: 'ஆதார் அட்டை', emoji: '🆔', desc: 'அடையாள சரிபார்ப்பு' },
      'alerts': { label: 'எச்சரிக்கைகள்', emoji: '📱', desc: 'வாட்ஸ்ஆப் எச்சரிக்கை' },
      'community': { label: 'சமுதாயம்', emoji: '👥', desc: 'விவசாயிகள் இணைப்பு' },
      'feedback': { label: 'கருத்து', emoji: '🎤', desc: 'குரல் மற்றும் உரை' },
      'offline': { label: 'ஆஃப்லைன் முறை', emoji: '📡', desc: 'தரவு ஒத்திசைவு' },
      'settings': { label: 'அமைப்புகள்', emoji: '⚙️', desc: 'ஆப் அமைப்புகள்' }
    },
    te: {
      'dashboard': { label: 'ఇల్లు', emoji: '🏠', desc: 'ప్రధాన డాష్‌బోర్డ్' },
      'yield-prediction': { label: 'పంట దిగుబడి', emoji: '🌾', desc: 'పంట అంచనా' },
      'monitoring': { label: 'వ్యవసాయ పర్యవేక్షణ', emoji: '📡', desc: 'పొలాలు చూడండి' },
      'analytics': { label: 'నివేదికలు', emoji: '📊', desc: 'విశ్లేషణ చూడండి' },
      'recommendations': { label: 'AI సహాయకుడు', emoji: '🤖', desc: 'తెలివైన చిట్కాలు' },
      'schemes': { label: 'ప్రభుత్వ పథకాలు', emoji: '🏛️', desc: 'ప్రయోజనాలు పొందండి' },
      'aadhaar': { label: 'ఆధార్ కార్డ్', emoji: '🆔', desc: 'గుర్తింపు ధృవీకరణ' },
      'alerts': { label: 'హెచ్చరికలు', emoji: '📱', desc: 'వాట్సాప్ హెచ్చరికలు' },
      'community': { label: 'సంఘం', emoji: '👥', desc: 'రైతుల అనుసంధానం' },
      'feedback': { label: 'అభిప్రాయం', emoji: '🎤', desc: 'వాయిస్ మరియు టెక్స్ట్' },
      'offline': { label: 'ఆఫ్‌లైన్ మోడ్', emoji: '📡', desc: 'డేటా సింక్' },
      'settings': { label: 'సెట్టింగులు', emoji: '⚙️', desc: 'అప్ సెట్టింగులు' }
    },
    bn: {
      'dashboard': { label: 'বাড়ি', emoji: '🏠', desc: 'প্রধান ড্যাশবোর্ড' },
      'yield-prediction': { label: 'ফসল উৎপাদন', emoji: '🌾', desc: 'ফসল অনুমান' },
      'monitoring': { label: 'খামার পর্যবেক্ষণ', emoji: '📡', desc: 'খেত দেখুন' },
      'analytics': { label: 'রিপোর্ট', emoji: '📊', desc: 'বিশ্লেষণ দেখুন' },
      'recommendations': { label: 'AI সহায়ক', emoji: '🤖', desc: 'স্মার্ট পরামর���শ' },
      'schemes': { label: 'সরকারি পরিকল্পনা', emoji: '🏛️', desc: 'সুবিধা পান' },
      'aadhaar': { label: 'আধার কার্ড', emoji: '🆔', desc: 'পরিচয় যাচাই' },
      'alerts': { label: 'সতর্কতা', emoji: '📱', desc: 'হোয়াটসঅ্যাপ সতর্কতা' },
      'community': { label: 'সম্প্রদায়', emoji: '👥', desc: 'কৃষক সংযোগ' },
      'feedback': { label: 'মতামত', emoji: '🎤', desc: 'কণ্ঠস্বর ও টেক্সট' },
      'offline': { label: 'অফলাইন মোড', emoji: '📡', desc: 'ডেটা সিঙ্ক' },
      'settings': { label: 'সেটিংস', emoji: '⚙️', desc: 'অ্যাপ সেটিংস' }
    },
    kn: {
      'dashboard': { label: 'ಮನೆ', emoji: '🏠', desc: 'ಮುಖ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
      'yield-prediction': { label: 'ಬೆಳೆ ಇಳುವರಿ', emoji: '🌾', desc: 'ಬೆಳೆ ಅಂದಾಜು' },
      'monitoring': { label: 'ಕೃಷಿ ಮೇಲ್ವಿಚಾರಣೆ', emoji: '📡', desc: 'ಹೊಲಗಳನ್ನು ನೋಡಿ' },
      'analytics': { label: 'ವರದಿಗಳು', emoji: '📊', desc: 'ವಿಶ್ಲೇಷಣೆ ನೋಡಿ' },
      'recommendations': { label: 'AI ಸಹಾಯಕ', emoji: '🤖', desc: 'ಸ್ಮಾರ್ಟ್ ಸಲಹೆ' },
      'schemes': { label: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', emoji: '🏛️', desc: 'ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯಿರಿ' },
      'aadhaar': { label: 'ಆಧಾರ್ ಕಾರ್ಡ್', emoji: '🆔', desc: 'ಗುರುತಿಸುವಿಕೆ ಪರಿಶೀಲನೆ' },
      'alerts': { label: 'ಎಚ್ಚರಿಕೆಗಳು', emoji: '📱', desc: 'ವಾಟ್ಸ್ಆಪ್ ಎಚ್ಚರಿಕೆಗಳು' },
      'community': { label: 'ಸಮುದಾಯ', emoji: '👥', desc: 'ರೈತರ ಸಂಪರ್ಕ' },
      'feedback': { label: 'ಅಭಿಪ್ರಾಯ', emoji: '🎤', desc: 'ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ' },
      'offline': { label: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್', emoji: '📡', desc: 'ಡೇಟಾ ಸಿಂಕ್' },
      'settings': { label: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', emoji: '⚙️', desc: 'ಅಪ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು' }
    },
    gu: {
      'dashboard': { label: 'ઘર', emoji: '🏠', desc: 'મુખ્ય ડેશબોર્ડ' },
      'yield-prediction': { label: 'પાક ઉત્પાદન', emoji: '🌾', desc: 'પાક અનુમાન' },
      'monitoring': { label: 'ખેતર દેખરેખ', emoji: '📡', desc: 'ખેતરો જુઓ' },
      'analytics': { label: 'અહેવાલો', emoji: '📊', desc: 'વિશ્લેષણ જુઓ' },
      'recommendations': { label: 'AI સહાયક', emoji: '🤖', desc: 'સ્માર્ટ સલાહ' },
      'schemes': { label: 'સરકારી યોજનાઓ', emoji: '🏛️', desc: 'ફાયદા મેળવો' },
      'aadhaar': { label: 'આધાર કાર્ડ', emoji: '🆔', desc: 'ઓળખ ચકાસણી' },
      'alerts': { label: 'અલર્ટ', emoji: '📱', desc: 'વ્હાટ્સઅપ અલર્ટ' },
      'community': { label: 'સમુદાય', emoji: '👥', desc: 'ખેડૂત જોડાણ' },
      'feedback': { label: 'પ્રતિસાદ', emoji: '🎤', desc: 'અવાજ અને ટેક્સ્ટ' },
      'offline': { label: 'ઓફલાઇન મોડ', emoji: '📡', desc: 'ડેટા સિંક' },
      'settings': { label: 'સેટિંગ્સ', emoji: '⚙️', desc: 'અેપ સેટિંગ્સ' }
    },
    pa: {
      'dashboard': { label: 'ਘਰ', emoji: '🏠', desc: 'ਮੁੱਖ ਡੈਸ਼ਬੋਰਡ' },
      'yield-prediction': { label: 'ਫਸਲ ਪੈਦਾਵਾਰ', emoji: '🌾', desc: 'ਫਸਲ ਦਾ ਅਨੁਮਾਨ' },
      'monitoring': { label: 'ਖੇਤ ਨਿਗਰਾਨੀ', emoji: '📡', desc: 'ਖੇਤ ਦੇਖੋ' },
      'analytics': { label: 'ਰਿਪੋਰਟਾਂ', emoji: '📊', desc: 'ਵਿਸ਼ਲੇਸ਼ਣ ਦੇਖੋ' },
      'recommendations': { label: 'AI ਸਹਾਇਕ', emoji: '🤖', desc: 'ਸਮਾਰਟ ਸਲਾਹ' },
      'schemes': { label: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', emoji: '🏛️', desc: 'ਫਾਇਦੇ ਲਓ' },
      'aadhaar': { label: 'ਆਧਾਰ ਕਾਰਡ', emoji: '🆔', desc: 'ਪਛਾਣ ਪੁਸ਼ਟੀ' },
      'alerts': { label: 'ਅਲਰਟ', emoji: '📱', desc: 'ਵ੍ਹਾਟਸਐਪ ਅਲਰਟ' },
      'community': { label: 'ਭਾਈਚਾਰਾ', emoji: '👥', desc: 'ਕਿਸਾਨ ਕਨੈਕਸ਼ਨ' },
      'feedback': { label: 'ਫੀਡਬੈਕ', emoji: '🎤', desc: 'ਆਵਾਜ਼ ਅਤੇ ਟੈਕਸਟ' },
      'offline': { label: 'ਆਫਲਾਈਨ ਮੋਡ', emoji: '📡', desc: 'ਡੇਟਾ ਸਿੰਕ' },
      'settings': { label: 'ਸੈਟਿੰਗਜ਼', emoji: '⚙️', desc: 'ਐਪ ਸੈਟਿੰਗਜ਼' }
    },
    ml: {
      'dashboard': { label: 'വീട്', emoji: '🏠', desc: 'പ്രധാന ഡാഷ്ബോർഡ്' },
      'yield-prediction': { label: 'വിള വിളവ്', emoji: '🌾', desc: 'വിള പ്രവചനം' },
      'monitoring': { label: 'കൃഷി നിരീക്ഷണം', emoji: '📡', desc: 'വയലുകൾ കാണുക' },
      'analytics': { label: 'റിപ്പോർട്ടുകൾ', emoji: '📊', desc: 'വിശകലനം കാണുക' },
      'recommendations': { label: 'AI സഹായി', emoji: '🤖', desc: 'സ്മാർട്ട് നിർദ്ദേശങ്ങൾ' },
      'schemes': { label: 'സർക്കാർ പദ്ധതികൾ', emoji: '🏛️', desc: 'ആനുകൂല്യങ്ങൾ നേടുക' },
      'aadhaar': { label: 'ആധാർ കാർഡ്', emoji: '🆔', desc: 'തിരിച്ചറിയൽ പരിശോധന' },
      'alerts': { label: 'അലേർട്ടുകൾ', emoji: '📱', desc: 'വാട്ട്സാപ്പ് അലേർട്ടുകൾ' },
      'community': { label: 'സമൂഹം', emoji: '👥', desc: 'കർഷക ബന്ധം' },
      'feedback': { label: 'ഫീഡ്ബാക്ക്', emoji: '🎤', desc: 'വോയ്സും ടെക്സ്റ്റും' },
      'offline': { label: 'ഓഫ്ലൈൻ മോഡ്', emoji: '📡', desc: 'ഡാറ്റ സിങ്ക്' },
      'settings': { label: 'സെറ്റിംഗുകൾ', emoji: '⚙️', desc: 'ആപ്പ് സെറ്റിംഗുകൾ' }
    }
  };

  const translations = menuTranslations[language] || menuTranslations.en;

  return [
    // Core Features (Primary)
    { id: 'dashboard', icon: Home, ...translations.dashboard, primary: true, color: 'bg-blue-500' },
    { id: 'yield-prediction', icon: Target, ...translations['yield-prediction'], primary: true, color: 'bg-green-500' },
    
    // Monitoring & Analysis 
    { id: 'monitoring', icon: Satellite, ...translations.monitoring, color: 'bg-purple-500' },
    { id: 'analytics', icon: TrendingUp, ...translations.analytics, color: 'bg-orange-500' },
    
    // Tools & Services
    { id: 'recommendations', icon: Lightbulb, ...translations.recommendations, color: 'bg-yellow-500' },
    { id: 'schemes', icon: Building2, ...translations.schemes, color: 'bg-red-500' },
    { id: 'aadhaar', icon: CreditCard, ...translations.aadhaar, color: 'bg-indigo-500' },
    { id: 'alerts', icon: MessageCircle, ...translations.alerts, color: 'bg-cyan-500' },
    
    // Community & Support
    { id: 'community', icon: Users, ...translations.community, color: 'bg-blue-500' },
    { id: 'feedback', icon: HeadphonesIcon, ...translations.feedback, color: 'bg-pink-500' },
    { id: 'offline', icon: WifiOff, ...translations.offline, color: 'bg-indigo-500' },
    
    // Account
    { id: 'settings', icon: Settings, ...translations.settings, color: 'bg-gray-500' }
  ];
};

export function VisualSidebar({ currentScreen, setCurrentScreen, language }: VisualSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = getVisualMenuItems(language);

  const SidebarContent = () => (
    <div className="h-full bg-gradient-to-b from-green-50 to-emerald-50 border-r-4 border-green-200 flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center gap-3">
          <KrishiLogo size="lg" className="text-white" />
          <div>
            <h2 className="font-bold text-xl">
              {getContent(language, 'appName')}
            </h2>
            <p className="text-sm opacity-90">
              {language === 'hi' ? 'AI किसान सहायक' : 
               language === 'mr' ? 'AI शेतकरी सहाय्यक' :
               language === 'ta' ? 'AI விவசாய உதவியாளர்' :
               language === 'te' ? 'AI రైతు సహాయకుడు' :
               language === 'bn' ? 'AI কৃষক সহায়ক' :
               language === 'kn' ? 'AI ರೈತ ಸಹಾಯಕ' :
               language === 'gu' ? 'AI ખેડૂત મદદગાર' :
               language === 'pa' ? 'AI ਕਿਸਾਨ ਸਹਾਇਕ' :
               language === 'ml' ? 'AI കർഷക സഹായി' :
               'AI Farming Assistant'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu - Big Visual Buttons */}
      <nav className="flex-1 p-4 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          const isPrimary = item.primary;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => {
                setCurrentScreen(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full h-20 p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105' 
                  : isPrimary
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border-2 border-green-300 shadow-md'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
              style={{
                boxShadow: isActive ? '0 10px 25px rgba(34, 197, 94, 0.3)' : undefined
              }}
            >
              <div className="flex items-center gap-4 w-full">
                {/* Visual Icon + Emoji */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{item.emoji}</span>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-white' : isPrimary ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-left">
                  <div className={`font-bold text-lg ${isActive ? 'text-white' : isPrimary ? 'text-green-800' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${isActive ? 'text-green-100' : isPrimary ? 'text-green-600' : 'text-gray-500'}`}>
                    {item.desc}
                  </div>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                )}
                {isPrimary && !isActive && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-t-2 border-green-200">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
            🧑‍🌾
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">
              {language === 'hi' ? 'किसान' : 
               language === 'mr' ? 'शेतकरी' :
               language === 'ta' ? 'விவசாயி' :
               language === 'te' ? 'రైతు' :
               language === 'bn' ? 'কৃষক' :
               language === 'kn' ? 'ರೈತ' :
               language === 'gu' ? 'ખેડૂત' :
               language === 'pa' ? 'ਕਿਸਾਨ' :
               language === 'ml' ? 'കർഷകൻ' :
               'Farmer'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'hi' ? 'स्मार्ट खेती' : 
               language === 'mr' ? 'स्मार्ट शेती' :
               language === 'ta' ? 'புத்திசாலி விவசாயம்' :
               language === 'te' ? 'స్మార్ట్ వ్యవసాయం' :
               language === 'bn' ? 'স্মার্ট চাষাবাদ' :
               language === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ' :
               language === 'gu' ? 'સ્માર્ટ ખેતી' :
               language === 'pa' ? 'ਸਮਾਰਟ ਖੇਤੀ' :
               language === 'ml' ? 'സ്മാർട്ട് കൃഷി' :
               'Smart Farming'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen('settings')}
            className="p-2 hover:bg-green-100 rounded-lg"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="default"
          size="lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-2xl p-3"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="ml-2 font-medium">
            {isMobileMenuOpen ? 
              (language === 'hi' ? 'बंद करें' : 'Close') : 
              (language === 'hi' ? 'मेनू' : 'Menu')
            }
          </span>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-80 h-full" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </motion.div>
      )}
    </>
  );
}