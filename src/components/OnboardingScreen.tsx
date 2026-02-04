import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Satellite, Brain, Shield, TrendingUp, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingScreenProps {
  onComplete: () => void;
  language: string;
}

export function OnboardingScreen({ onComplete, language }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = {
    en: [
      {
        icon: Satellite,
        title: 'Satellite-Powered Insights',
        description: 'Get real-time NDVI analysis, soil moisture tracking, and weather patterns directly from Google Earth Engine satellites.',
        benefit: 'Make data-driven decisions for better crop yields'
      },
      {
        icon: Brain,
        title: 'AI-Powered Agriculture',
        description: 'Our AI analyzes your farm data to detect diseases early, predict pest outbreaks, and optimize irrigation schedules.',
        benefit: 'Prevent crop losses with early warning systems'
      },
      {
        icon: Shield,
        title: 'Government Schemes',
        description: 'Access PM-KISAN, PM Fasal Bima, and other government schemes with eligibility checker and application tracking.',
        benefit: 'Maximize your benefits and financial security'
      },
      {
        icon: TrendingUp,
        title: 'Precision Farming',
        description: 'Monitor soil health, track crop growth stages, and get personalized recommendations for your specific farm conditions.',
        benefit: 'Increase productivity while reducing costs'
      }
    ],
    hi: [
      {
        icon: Satellite,
        title: 'उपग्रह-संचालित अंतर्दृष्टि',
        description: 'Google Earth Engine उपग्रहों से वास्तविक समय NDVI विश्लेषण, मिट्टी की नमी ट्रैकिंग, और मौसम पैटर्न प्राप्त करें।',
        benefit: 'बेहतर फसल उत्पादन के लिए डेटा-संचालित निर्णय लें'
      },
      {
        icon: Brain,
        title: 'AI-संचालित कृषि',
        description: 'हमारा AI आपके खेत के डेटा का विश्लेषण करके रोगों का जल्दी पता लगाता है, कीट प्रकोप की भविष्यवाणी करता है।',
        benefit: 'पूर्व चेतावनी प्रणाली के साथ फसल नुकसान को रोकें'
      },
      {
        icon: Shield,
        title: 'सरकारी योजनाएं',
        description: 'PM-KISAN, PM फसल बीमा, और अन्य सरकारी योजनाओं तक पहुंच प्राप्त करें।',
        benefit: 'अपने लाभ और वित्तीय सुरक्षा को अधिकतम करें'
      },
      {
        icon: TrendingUp,
        title: 'सटीक खेती',
        description: 'मिट्टी के स्वास्थ्य की निगरानी करें, फसल की वृद्धि के चरणों को ट्रैक करें।',
        benefit: 'लागत कम करते हुए उत्पादकता बढ़ाएं'
      }
    ]
  };

  const content = {
    en: {
      welcome: 'Welcome to KrishiSevak',
      subtitle: 'Let\'s get you started with smart farming',
      next: 'Next',
      getStarted: 'Get Started',
      skip: 'Skip',
      stepOf: 'Step {{current}} of {{total}}'
    },
    hi: {
      welcome: 'कृषिसेवक में आपका स्वागत है',
      subtitle: 'आइए आपको स्मार्ट खेती के साथ शुरुआत करते हैं',
      next: 'आगे',
      getStarted: 'शुरू करें',
      skip: 'छोड़ें',
      stepOf: 'चरण {{current}} का {{total}}'
    }
  };

  const t = content[language as keyof typeof content];
  const stepData = steps[language as keyof typeof steps];

  const nextStep = () => {
    if (currentStep < stepData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {t.welcome}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {stepData.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < stepData.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {React.createElement(stepData[currentStep].icon, { 
                    className: "h-10 w-10 text-white" 
                  })}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {stepData[currentStep].title}
                </h2>
                
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {stepData[currentStep].description}
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ {stepData[currentStep].benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={skipOnboarding}
            className="text-gray-500 hover:text-gray-700"
          >
            {t.skip}
          </Button>
          
          <div className="text-sm text-gray-500">
            {t.stepOf.replace('{{current}}', (currentStep + 1).toString()).replace('{{total}}', stepData.length.toString())}
          </div>
          
          <Button
            onClick={nextStep}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            {currentStep === stepData.length - 1 ? t.getStarted : t.next}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}