import React, { useState, useEffect } from 'react';
import { VisualSidebar } from './components/VisualSidebar';
import { VisualDashboard } from './components/VisualDashboard';
import { YieldPredictionScreen } from './components/YieldPredictionScreen';
import { SatelliteAnalysisScreen } from './components/SatelliteAnalysisScreen';

import { DroughtMonitoringScreen } from './components/DroughtMonitoringScreen';

import { GovernmentSchemesScreen } from './components/GovernmentSchemesScreen';
import { YieldAnalyticsScreen } from './components/YieldAnalyticsScreen';
import { WhatsAppAlert } from './components/WhatsAppAlert';
import { SettingsScreen } from './components/SettingsScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AIAssistant } from './components/AIAssistant';
import { LanguageSelector } from './components/LanguageSelector';
import { ScenarioSimulation } from './components/ScenarioSimulation';
import { GEEMapIntegration } from './components/GEEMapIntegration';
import { VoiceSupport } from './components/VoiceSupport';
import { RecommendationsEngine } from './components/RecommendationsEngine';
import { DemoNotice } from './components/DemoNotice';
import { ComprehensiveMonitoring } from './components/ComprehensiveMonitoring';
import { AadhaarIntegration } from './components/AadhaarIntegration';
import { ComprehensiveAnalytics } from './components/ComprehensiveAnalytics';
import { CommunityConnect } from './components/CommunityConnect';
import { FarmerFeedback } from './components/FarmerFeedback';
import { OfflineSync } from './components/OfflineSync';
import { KrishiLogo } from './components/KrishiLogo';
import { Button } from './components/ui/button';
import { Moon, Sun, MessageCircle, Mic, MicOff } from 'lucide-react';
import { authService } from './services/AuthService';
import { voiceLanguageMap, getContent } from './utils/languages';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');

  // Check for existing session on app load
  useEffect(() => {
    checkAuthSession();
    
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkAuthSession = async () => {
    const result = await authService.getCurrentSession();
    setIsAuthenticated(result.success);
    setIsLoading(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Update voice language based on selected language
    setVoiceLanguage(voiceLanguageMap[newLanguage] || 'en-US');
  };

  const toggleVoiceSupport = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <KrishiLogo size="xl" className="rounded-full" />
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent" />
          <p className="text-muted-foreground">
            {getContent(language, 'loading')} {getContent(language, 'appName')}...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleAuth} language={language} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} language={language} />;
  }

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        // Core Features
        case 'dashboard':
          return <VisualDashboard language={language} setCurrentScreen={setCurrentScreen} />;
        case 'yield-prediction':
          return <YieldPredictionScreen language={language} />;

        // Consolidated Monitoring (combines satellite, crop, soil, drought)
        case 'monitoring':
          return <ComprehensiveMonitoring language={language} />;
        case 'satellite':
          return <SatelliteAnalysisScreen language={language} />;


        case 'drought':
          return <DroughtMonitoringScreen language={language} />;

        // Consolidated Analytics (combines yield analytics and simulation)
        case 'analytics':
          return <ComprehensiveAnalytics language={language} />;
        case 'yield':
          return <YieldAnalyticsScreen language={language} />;
        case 'simulation':
          return <ScenarioSimulation language={language} />;

        // Tools & Services
        case 'recommendations':
          return <RecommendationsEngine language={language} />;
        case 'schemes':
          return <GovernmentSchemesScreen language={language} />;
        case 'alerts':
          return <WhatsAppAlert language={language} />; // Consolidated alerts
        case 'whatsapp':
          return <WhatsAppAlert language={language} />;

        // Community & Support
        case 'community':
          return <CommunityConnect language={language} />;
        case 'feedback':
          return <FarmerFeedback language={language} />;
        case 'offline':
          return <OfflineSync language={language} />;

        // Identity & Verification
        case 'aadhaar':
          return <AadhaarIntegration language={language} />;

        // Account
        case 'settings':
          return <SettingsScreen language={language} onLanguageChange={handleLanguageChange} />;

        default:
          return <VisualDashboard language={language} setCurrentScreen={setCurrentScreen} />;
      }
    } catch (error) {
      console.error('Error rendering screen:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              {getContent(language, 'error')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Please try refreshing the page or contact support.' 
                : getContent(language, 'error')
              }
            </p>
            <Button onClick={() => window.location.reload()}>
              {getContent(language, 'refresh')}
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex">
        <VisualSidebar 
          currentScreen={currentScreen} 
          setCurrentScreen={setCurrentScreen}
          language={language}
        />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KrishiLogo size="md" />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-primary">
                  {getContent(language, 'appName')}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getContent(language, 'tagline')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceSupport}
                className={`gap-2 ${isVoiceEnabled ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
              >
                {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                <span className="hidden sm:inline">{getContent(language, 'voice')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIAssistant(true)}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span>
              </Button>
              <LanguageSelector 
                language={language} 
                setLanguage={handleLanguageChange} 
                compact={true} 
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline">{getContent(language, 'theme')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <span className="hidden sm:inline">{getContent(language, 'signOut')}</span>
                <span className="sm:hidden">↗</span>
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <DemoNotice language={language} />
            {renderScreen()}
          </main>
        </div>
      </div>
      
      {/* Voice Support */}
      {isVoiceEnabled && (
        <VoiceSupport 
          language={voiceLanguage}
          isEnabled={isVoiceEnabled}
          onToggle={toggleVoiceSupport}
        />
      )}
      
      {/* AI Assistant Modal */}
      <AIAssistant 
        language={language} 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
    </div>
  );
}