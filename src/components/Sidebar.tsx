import React from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  Satellite, 
  Sprout, 
  CloudRain, 
  TestTube, 
  Building2,
  Menu,
  X,
  TrendingUp, 
  MessageCircle, 
  Settings, 
  Calculator, 
  Map, 
  Target,
  Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { KrishiLogo } from './KrishiLogo';
import { getContent } from '../utils/languages';

interface SidebarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  language: string;
}

// Streamlined menu with consolidated features and multi-language support
const getMenuItems = (language: string) => {
  const menuTranslations: { [key: string]: any } = {
    en: {
      // Core Features (Primary)
      'dashboard': 'Dashboard',
      'yield-prediction': 'Yield Prediction',
      
      // Monitoring & Analysis
      'monitoring': 'Farm Monitoring',
      'analytics': 'Analytics & Reports',
      
      // Tools & Services
      'recommendations': 'AI Assistant',
      'schemes': 'Government Schemes',
      'alerts': 'Smart Alerts',
      
      // Account
      'settings': 'Settings'
    },
    hi: {
      'dashboard': 'डैशबोर्ड',
      'yield-prediction': 'उत्पादन पूर्वानुमान',
      'monitoring': 'खेत निगरानी',
      'analytics': 'विश्लेषण और रिपोर्ट',
      'recommendations': 'AI सहायक',
      'schemes': 'सरकारी योजनाएं',
      'alerts': 'स्मार्ट अलर्ट',
      'settings': 'सेटिंग्स'
    },
    mr: {
      'dashboard': 'डॅशबोर्ड',
      'yield-prediction': 'उत्पादन अंदाज',
      'monitoring': 'शेत निरीक्षण',
      'analytics': 'विश्लेषण आणि अहवाल',
      'recommendations': 'AI सहाय्यक',
      'schemes': 'सरकारी योजना',
      'alerts': 'स्मार्ट अलर्ट',
      'settings': 'सेटिंग्ज'
    },
    ta: {
      'dashboard': 'டாஷ்போர்டு',
      'yield-prediction': 'விளைச்சல் முன்னறிவிப்பு',
      'monitoring': 'பண்ணை கண்காணிப்பு',
      'analytics': 'பகுப்பாய்வு மற்றும் அறிக்கைகள்',
      'recommendations': 'AI உதவியாளர்',
      'schemes': 'அரசு திட்டங்கள்',
      'alerts': 'ஸ்மார்ட் எச்சரிக்கைகள்',
      'settings': 'அமைப்புகள்'
    },
    te: {
      'dashboard': 'డాష్‌బోర్డ్',
      'yield-prediction': 'దిగుబడి అంచనా',
      'monitoring': 'వ్యవసాయ పర్యవేక్షణ',
      'analytics': 'విశ్లేషణ మరియు నివేదికలు',
      'recommendations': 'AI సహాయకుడు',
      'schemes': 'ప్రభుత్వ పథకాలు',
      'alerts': 'స్మార్ట్ అలర్ట్‌లు',
      'settings': 'సెట్టింగ్‌లు'
    },
    bn: {
      'dashboard': 'ড্যাশবোর্ড',
      'yield-prediction': 'ফসল উৎপাদন পূর্বাভাস',
      'monitoring': 'খামার পর্যবেক্ষণ',
      'analytics': 'বিশ্লেষণ এবং রিপোর্ট',
      'recommendations': 'AI সহায়ক',
      'schemes': 'সরকারি পরিকল্পনা',
      'alerts': 'স্মার্ট সতর্কতা',
      'settings': 'সেটিংস'
    },
    kn: {
      'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'yield-prediction': 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ',
      'monitoring': 'ಕೃಷಿ ಮೇಲ್ವಿಚಾರಣೆ',
      'analytics': 'ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವರದಿಗಳು',
      'recommendations': 'AI ಸಹಾಯಕ',
      'schemes': 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      'alerts': 'ಸ್ಮಾರ್ಟ್ ಎಚ್ಚರಿಕೆಗಳು',
      'settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
    },
    gu: {
      'dashboard': 'ડેશબોર્ડ',
      'yield-prediction': 'ઉત્પાદન પૂર્વાનુમાન',
      'monitoring': 'ખેતર દેખરેખ',
      'analytics': 'વિશ્લેષણ અને અહેવાલો',
      'recommendations': 'AI સહાયક',
      'schemes': 'સરકારી યોજનાઓ',
      'alerts': 'સ્માર્ટ અલર્ટ',
      'settings': 'સેટિંગ્સ'
    },
    pa: {
      'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
      'yield-prediction': 'ਪੈਦਾਵਾਰ ਦੀ ਭਵਿੱਖਬਾਣੀ',
      'monitoring': 'ਖੇਤ ਨਿਗਰਾਨੀ',
      'analytics': 'ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਰਿਪੋਰਟਾਂ',
      'recommendations': 'AI ਸਹਾਇਕ',
      'schemes': 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
      'alerts': 'ਸਮਾਰਟ ਅਲਰਟ',
      'settings': 'ਸੈਟਿੰਗਜ਼'
    },
    ml: {
      'dashboard': 'ഡാഷ്‌ബോർഡ്',
      'yield-prediction': 'വിളവ് പ്രവചനം',
      'monitoring': 'കൃഷി നിരീക്ഷണം',
      'analytics': 'വിശകലനം, റിപ്പോർട്ടുകൾ',
      'recommendations': 'AI സഹായി',
      'schemes': 'സർക്കാർ പദ്ധതികൾ',
      'alerts': 'സ്മാർട്ട് അലേർട്ടുകൾ',
      'settings': 'സെറ്റിംഗുകൾ'
    }
  };

  const translations = menuTranslations[language] || menuTranslations.en;

  return [
    // Core Features (Primary)
    { id: 'dashboard', icon: Home, label: translations.dashboard, primary: true, category: 'core' },
    { id: 'yield-prediction', icon: Target, label: translations['yield-prediction'], primary: true, category: 'core' },
    
    // Monitoring & Analysis (Combined satellite, crop, soil, drought into one comprehensive monitoring)
    { id: 'monitoring', icon: Satellite, label: translations.monitoring, category: 'analysis', 
      subItems: ['satellite', 'crop', 'soil', 'drought'] },
    { id: 'analytics', icon: TrendingUp, label: translations.analytics, category: 'analysis',
      subItems: ['yield', 'simulation'] },
    
    // Tools & Services
    { id: 'recommendations', icon: Lightbulb, label: translations.recommendations, category: 'tools' },
    { id: 'schemes', icon: Building2, label: translations.schemes, category: 'tools' },
    { id: 'alerts', icon: MessageCircle, label: translations.alerts, category: 'tools',
      subItems: ['whatsapp'] },
    
    // Account
    { id: 'settings', icon: Settings, label: translations.settings, category: 'account' }
  ];
};

export function Sidebar({ currentScreen, setCurrentScreen, language }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const items = getMenuItems(language);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: any) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleExpanded(item.id);
    } else {
      setCurrentScreen(item.id);
      setIsMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <KrishiLogo size="md" />
          <div>
            <h2 className="font-semibold text-sidebar-foreground">
              {getContent(language, 'appName')}
            </h2>
            <p className="text-sm text-sidebar-foreground/60">
              {getContent(language, 'tagline')}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-4">
          {/* Core Features */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              {language === 'en' ? 'Core Features' : 
               language === 'hi' ? 'मुख्य सुविधाएं' :
               language === 'mr' ? 'मुख्य वैशिष्ट्ये' :
               language === 'ta' ? 'முக்கிய அம்சங்கள்' :
               language === 'te' ? 'ప్రధాన లక్షణాలు' :
               language === 'bn' ? 'মূল বৈশিষ্ট্য' :
               language === 'kn' ? 'ಮುಖ್ಯ ಲಕ್ಷಣಗಳು' :
               language === 'gu' ? 'મુખ્ય સુવિધાઓ' :
               language === 'pa' ? 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ' :
               language === 'ml' ? 'പ്രധാന സവിശേഷതകൾ' :
               'Core Features'}
            </div>
            <ul className="space-y-1">
              {items.filter(item => item.category === 'core').map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                const isPrimary = item.primary;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                          : isPrimary
                          ? 'text-sidebar-foreground hover:bg-green-100 hover:text-green-700 border border-green-200'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <Icon className={`h-5 w-5 ${isPrimary && !isActive ? 'text-green-600' : ''}`} />
                      <span className={`flex-1 text-left ${isPrimary && !isActive ? 'font-medium' : ''}`}>{item.label}</span>
                      {isPrimary && !isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Analysis & Monitoring */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              {language === 'en' ? 'Analysis' :
               language === 'hi' ? 'विश्लेषण' :
               language === 'mr' ? 'विश्लेषण' :
               language === 'ta' ? 'பகுப்பாய்வு' :
               language === 'te' ? 'విశ్లేషణ' :
               language === 'bn' ? 'বিশ্লেষণ' :
               language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ' :
               language === 'gu' ? 'વિશ્લેષણ' :
               language === 'pa' ? 'ਵਿਸ਼ਲੇਸ਼ਣ' :
               language === 'ml' ? 'വിശകലനം' :
               'Analysis'}
            </div>
            <ul className="space-y-1">
              {items.filter(item => item.category === 'analysis').map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id || (item.subItems && item.subItems.includes(currentScreen));
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tools & Services */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              {language === 'en' ? 'Tools & Services' :
               language === 'hi' ? 'उपकरण और सेवाएं' :
               language === 'mr' ? 'साधने आणि सेवा' :
               language === 'ta' ? 'கருவிகள் மற்றும் சேவைகள்' :
               language === 'te' ? 'సాధనాలు మరియు సేవలు' :
               language === 'bn' ? 'সরঞ্জাম এবং সেবা' :
               language === 'kn' ? 'ಸಾಧನಗಳು ಮತ್ತು ಸೇವೆಗಳು' :
               language === 'gu' ? 'સાધનો અને સેવાઓ' :
               language === 'pa' ? 'ਸਾਧਨ ਅਤੇ ਸੇਵਾਵਾਂ' :
               language === 'ml' ? 'ടൂളുകളും സേവനങ്ങളും' :
               'Tools & Services'}
            </div>
            <ul className="space-y-1">
              {items.filter(item => item.category === 'tools').map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id || (item.subItems && item.subItems.includes(currentScreen));
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">
              {getContent(language, 'profile')}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              {language === 'en' ? 'Farmer' : language === 'hi' ? 'किसान' : 'Farmer'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </motion.div>
      )}
    </>
  );
}